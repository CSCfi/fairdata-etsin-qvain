import { observable, action, runInAction, computed, makeObservable } from 'mobx'

import urls from '../../utils/urls'
import { Project, dirIdentifierKey, fileIdentifierKey } from './common.files.items'
import PromiseManager from '../../utils/promiseManager'
import { itemLoaderPublic } from './common.files.loaders'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import Sort from './common.files.sort'

class Files {
  // Base class for file hierarchies.

  constructor() {
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
    Files.prototype.reset.call(this)
    makeObservable(this)
  }

  @observable datasetIdentifier = null

  @observable draftOfHasProject = null

  @observable root = null

  @observable selectedProject = undefined

  @observable projectLocked = false // prevent changing saved project

  @observable loadingProjectInfo = null

  @observable loadingProjectRoot = null

  @observable loadingMetadata = null

  @observable loadingDraftOfProjects = null

  cache = {} // used for storing data for items that haven't been fully loaded yet

  @observable originalMetadata = {}

  @observable initialLoadCount = 200

  @action async reset() {
    this.datasetIdentifier = null
    this.draftOfHasProject = null
    this.root = null
    this.selectedProject = undefined
    this.cache = {}
    this.originalMetadata = {}
    this.projectLocked = false
    this.loadingProjectInfo = null
    this.loadingMetadata = null
    this.loadingProjectRoot = null
    this.client.abort()
  }

  @action loadProjectInfo = async () => {
    const identifier = this.datasetIdentifier
    const alreadyLoading =
      this.loadingProjectInfo && this.loadingProjectInfo.identifier === this.identifier
    if (alreadyLoading) {
      return
    }

    const load = async () => {
      await this.client.abort('load-project-info')
      const { data } = await this.client.get(urls.common.datasetProjects(identifier), {
        tag: 'load-project-info',
      })
      runInAction(() => {
        if (data.length > 0) {
          this.selectedProject = data[0]
          this.projectLocked = true
        } else {
          this.selectedProject = undefined
        }
      })
    }

    let promise
    try {
      promise = load()
      this.loadingProjectInfo = {
        identifier,
        promise,
        error: null,
        done: false,
      }
      await promise
    } catch (error) {
      if (isAbort(error)) {
        throw error
      }
      runInAction(() => {
        this.selectedProject = undefined
        if (this.loadingProjectInfo) {
          this.loadingProjectInfo.error = error
        }
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectInfo?.promise === promise) {
          this.loadingProjectInfo.done = true
        }
      })
    }
  }

  @action loadMetadata = async () => {
    const identifier = this.datasetIdentifier

    const alreadyLoading =
      this.loadingMetadata && this.loadingMetadata.identifier === this.identifier
    if (alreadyLoading) {
      return
    }

    const load = async () => {
      await this.client.abort('load-metadata')
      const { data } = await this.client.get(
        urls.common.datasetUserMetadata(identifier, { tag: 'load-metadata' })
      )
      runInAction(() => {
        // Load metadata for files and directories selected in the dataset.
        const dsFiles = data.files || []
        const dsDirectories = data.directories || []
        if (dsFiles.length > 0 || dsDirectories.length > 0) {
          const items = [...dsFiles, ...dsDirectories]
          items.forEach((v, i) => {
            v.details = { id: i }
          })

          dsFiles.forEach(file => {
            file.id = file.details.id
            const key = fileIdentifierKey(file)
            this.cache[key] = {
              identifier: file.identifier,
              title: file.title,
              description: file.description,
              useCategory: file.use_category && file.use_category.identifier,
              fileType: file.file_type && file.file_type.identifier,
              existing: true,
              type: 'file',
            }
            this.originalMetadata[key] = {
              ...this.cache[key],
              useCategoryLabel: file.use_category && file.use_category.pref_label,
              fileTypeLabel: file.file_type && file.file_type.pref_label,
            }
          })

          dsDirectories.forEach(dir => {
            dir.id = dir.details.id
            const key = dirIdentifierKey(dir)
            this.cache[key] = {
              identifier: dir.identifier,
              title: dir.title,
              description: dir.description,
              useCategory: dir.use_category && dir.use_category.identifier,
              existing: true,
              type: 'directory',
            }
            this.originalMetadata[key] = {
              ...this.cache[key],
              useCategoryLabel: dir.use_category && dir.use_category.pref_label,
            }
          })
        }
      })
    }

    let promise
    try {
      promise = load()
      this.loadingMetadata = {
        identifier,
        promise,
        error: null,
        done: false,
      }
      await this.loadingMetadata.promise
    } catch (error) {
      if (isAbort(error)) {
        throw error
      }
      runInAction(() => {
        if (this.loadingMetadata) {
          this.loadingMetadata.error = error
        }
      })
    } finally {
      runInAction(() => {
        if (this.loadingMetadata?.promise === promise) {
          this.loadingMetadata.done = true
        }
      })
    }
  }

  @action checkDraftOfProjects = async dataset => {
    // If dataset is a draft of another dataset, check if the original had a selected project
    const draftOf = dataset.draft_of?.identifier
    if (draftOf) {
      await this.client.abort('check-draft-of-project')
      const { data } = await this.client.get(urls.common.datasetProjects(draftOf), {
        tag: 'check-draft-of-project',
      })
      runInAction(() => {
        this.draftOfHasProject = !!(data && data.length > 0)
      })
    }
  }

  @action openDataset = async dataset => {
    this.reset()
    runInAction(() => {
      this.datasetIdentifier = dataset.identifier
    })
    await Promise.all([
      this.loadProjectInfo(),
      this.loadMetadata(),
      this.checkDraftOfProjects(dataset),
    ])
    return this.loadProjectRoot()
  }

  @action loadAllDirectories = async () => {
    const loadChildren = async dir =>
      Promise.all(
        dir.directories.map(async d => {
          await this.loadDirectory(d)
          return loadChildren(d)
        })
      )
    await loadChildren(this.root)
  }

  @action.bound async loadDirectory(dir) {
    return itemLoaderPublic.loadDirectory({
      Files: this,
      dir,
      totalLimit: this.initialLoadCount,
      sort: new Sort(),
    })
  }

  @action changeProject = async projectId => {
    Files.prototype.reset.call(this)
    runInAction(() => {
      this.selectedProject = projectId
    })
    return this.loadProjectRoot()
  }

  fetchRootIdentifier = async projectIdentifier => {
    // Public access to projects is only through published datasets.
    // To access user projects, overload this and remove cr_identifier from the request.

    await this.client.abort('fetch-root-identifier')
    const { data } = await this.client.get(urls.common.projectFiles(projectIdentifier), {
      tag: 'fetch-root-identifier',
      params: {
        cr_identifier: this.datasetIdentifier,
      },
    })
    return data.identifier
  }

  @action loadProjectRoot = async () => {
    const alreadyLoading =
      this.loadingProjectRoot && this.loadingProjectRoot.identifier === this.selectedProject
    if (alreadyLoading || (this.root && this.root.projectIdentifier === this.selectedProject)) {
      return
    }
    this.root = null
    if (!this.selectedProject) {
      return
    }

    const loadRoot = async projectIdentifier => {
      const rootIdentifier = await this.fetchRootIdentifier(projectIdentifier)
      const root = observable(Project(projectIdentifier, rootIdentifier))
      await this.loadDirectory(root)
      runInAction(() => {
        this.root = root
      })
    }

    let promise
    try {
      promise = loadRoot(this.selectedProject)
      this.loadingProjectRoot = {
        identifier: this.selectedProject,
        promise,
        error: null,
        done: false,
      }
      await this.loadingProjectRoot.promise
    } catch (error) {
      if (isAbort(error)) {
        throw error
      }
      console.error(error)

      runInAction(() => {
        this.root = null
        this.loadingProjectRoot.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectRoot?.promise === promise) {
          this.loadingProjectRoot.done = true
        }
      })
    }
  }

  getItemByPath = async (path, skipFinalLoad) => {
    // Get file or directory by path. Loads all parent directories in the path
    // automatically if needed. Fails to find item if it's not found within the first
    // initialLoadCount items of a directory.
    const parts = path.split('/')
    if (parts.length === 1) {
      return undefined
    }
    if (path === '/') {
      return this.root
    }
    let dir = this.root
    let prevDir = dir
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i]
      dir = dir.directories.find(d => d.name === part)
      if (dir && !dir.loaded) {
        if (i < parts.length - 1 || !skipFinalLoad) {
          // eslint-disable-next-line no-await-in-loop
          await this.loadDirectory(dir)
        }
      }
      if (!dir) {
        const file = prevDir.files.find(f => f.name === part)
        return file
      }
      prevDir = dir
    }
    return dir
  }

  getItemPath = item => {
    if (item.parent && item.parent.type === 'directory') {
      return `${this.getItemPath(item.parent)}/${item.name}`
    }
    return `/${item.name}`
  }

  getEquivalentItemScope = item => {
    // Return topmost path that contains the same files as current item
    if (!item.parent) {
      return '/'
    }
    if (item.parent.directChildCount === 1) {
      return this.getEquivalentItemScope(item.parent)
    }
    return this.getItemPath(item)
  }

  @computed get isLoadingProject() {
    if (this.loadingProjectInfo && !this.loadingProjectInfo.done) {
      return true
    }
    if (this.loadingProjectRoot && !this.loadingProjectRoot.done) {
      return true
    }
    if (this.loadingMetadata && !this.loadingMetadata.done) {
      return true
    }
    return false
  }

  @computed get loadingProjectError() {
    if (this.loadingProjectInfo && this.loadingProjectInfo.error) {
      return this.loadingProjectInfo.error
    }
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      return this.loadingProjectRoot.error
    }
    if (this.loadingMetadata && this.loadingMetadata.error) {
      return this.loadingMetadata.error
    }
    return null
  }

  @action
  retry = async () => {
    if (this.loadingProjectInfo && this.loadingProjectInfo.error) {
      this.loadingProjectInfo = null
    }
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      this.loadingProjectRoot = null
    }
    if (this.loadingMetadata && this.loadingMetadata.error) {
      this.loadingMetadata = null
    }

    const datasetIdentifier = this.datasetIdentifier
    if (datasetIdentifier) {
      await Promise.all([this.loadProjectInfo(), this.loadMetadata()])
    }
    return this.loadProjectRoot()
  }
}

export default Files
