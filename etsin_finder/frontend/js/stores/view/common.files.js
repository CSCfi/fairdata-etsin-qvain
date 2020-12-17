import axios from 'axios'
import { observable, action, runInAction, computed, makeObservable } from 'mobx'

import urls from '../../components/qvain/utils/urls'
import { Project, dirIdentifierKey, fileIdentifierKey } from './common.files.items'
import { PromiseManager } from './common.files.utils'
import { itemLoaderPublic } from './common.files.loaders'

class Files {
  // Base class for file hierarchies.

  constructor() {
    this.promiseManager = new PromiseManager()
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

  @action reset() {
    this.datasetIdentifier = null
    this.draftOfHasProject = null
    this.root = null
    this.selectedProject = undefined
    this.refreshModalDirectory = null
    this.cache = {}
    this.originalMetadata = {}
    this.projectLocked = false

    if (this.loadingProjectInfo?.promise) {
      this.loadingProjectInfo.promise.cancel()
    }
    this.loadingProjectInfo = null

    if (this.loadingMetadata?.promise) {
      this.loadingMetadata.promise.cancel()
    }
    this.loadingMetadata = null

    if (this.loadingProjectRoot?.promise) {
      this.loadingProjectRoot.promise.cancel()
    }
    this.loadingProjectRoot = null
    this.promiseManager.reset()

    if (this.loadingDraftOfProjects?.promise) {
      this.loadingDraftOfProjects.promise.cancel()
    }
    this.loadingDraftOfProjects = null
  }

  @action loadProjectInfo = async () => {
    const identifier = this.datasetIdentifier
    const alreadyLoading =
      this.loadingProjectInfo && this.loadingProjectInfo.identifier === this.identifier
    if (alreadyLoading) {
      return
    }

    const loadingAnotherProject =
      this.loadingProjectInfo && this.loadingProjectInfo.promise && !this.loadingProjectInfo.error
    if (loadingAnotherProject) {
      this.loadingProjectInfo.promise.cancel()
    }

    const load = async () => {
      const { data } = await axios.get(urls.v2.datasetProjects(identifier))
      runInAction(() => {
        if (data.length > 0) {
          this.selectedProject = data[0]
          this.projectLocked = true
        } else {
          this.selectedProject = undefined
        }
      })
    }

    try {
      this.loadingProjectInfo = {
        identifier,
        promise: load(this.selectedProject),
        error: null,
        done: false,
      }
      await this.loadingProjectInfo.promise
    } catch (error) {
      runInAction(() => {
        this.selectedProject = undefined
        this.loadingProjectInfo.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectInfo) {
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

    if (this.loadingMetadata && this.loadingMetadata.promise && !this.loadingMetadata.error) {
      this.loadingMetadata.promise.cancel()
    }

    const load = async () => {
      const { data } = await axios.get(urls.v2.datasetUserMetadata(identifier))
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

    try {
      this.loadingMetadata = {
        identifier,
        promise: load(this.selectedProject),
        error: null,
        done: false,
      }
      await this.loadingMetadata.promise
    } catch (error) {
      runInAction(() => {
        this.loadingMetadata.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingMetadata) {
          this.loadingMetadata.done = true
        }
      })
    }
  }

  @action checkDraftOfProjects = async dataset => {
    const draftOf = dataset.draft_of?.identifier
    if (draftOf) {
      if (this.loadingDraftOfProjects?.promise) {
        this.loadingDraftOfProjects.promise.cancel()
      }

      const run = async () => {
        const { data } = await axios.get(urls.v2.datasetProjects(draftOf))
        runInAction(() => {
          this.draftOfHasProject = !!(data && data.length > 0)
        })
      }
      try {
        this.loadingDraftOfProjects = {
          identifier: draftOf,
          promise: run(),
          error: null,
          done: false,
        }
        await this.loadingDraftOfProjects.promise
      } catch (err) {
        runInAction(() => { this.loadingDraftOfProjects.error = err })
      } finally {
        runInAction(() => { this.loadingDraftOfProjects = null })
      }
    }
  }

  @action openDataset = async dataset => {
    this.reset()
    this.datasetIdentifier = dataset.identifier
    await Promise.all([this.loadProjectInfo(), this.loadMetadata(), this.checkDraftOfProjects(dataset)])
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

  @action loadDirectory = async dir => itemLoaderPublic.loadDirectory(this, dir, 100)

  @action changeProject = projectId => {
    Files.prototype.reset.call(this)
    this.selectedProject = projectId
    this.promiseManager.reset()
    return this.loadProjectRoot()
  }

  fetchRootIdentifier = async projectIdentifier => {
    // Public access to projects is only through published datasets.
    // To access user projects, overload this and remove cr_identifier from the request.
    const { data } = await axios.get(urls.v2.projectFiles(projectIdentifier), {
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
    if (this.loadingProjectRoot && !this.loadingProjectRoot.error) {
      this.loadingProjectRoot.promise.cancel()
    }

    const loadRoot = async projectIdentifier => {
      const rootIdentifier = await this.fetchRootIdentifier(projectIdentifier)
      const root = observable(Project(projectIdentifier, rootIdentifier))
      await this.loadDirectory(root)
      runInAction(() => {
        this.root = root
      })
    }

    try {
      this.loadingProjectRoot = {
        identifier: this.selectedProject,
        promise: loadRoot(this.selectedProject),
        error: null,
        done: false,
        random: Math.random(),
      }
      await this.loadingProjectRoot.promise
    } catch (error) {
      runInAction(() => {
        this.root = null
        this.loadingProjectRoot.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectRoot) {
          this.loadingProjectRoot.done = true
        }
      })
    }
  }

  getItemByPath = async (path, skipFinalLoad) => {
    // Get file or directory by path. Loads all parent directories in the path
    // automatically if needed. Useful for tests.
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

  getItemPath = (item) => {
    if (item.parent && item.parent.type === 'directory') {
      return `${this.getItemPath(item.parent)}/${item.name}`
    }
    return `/${item.name}`
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
