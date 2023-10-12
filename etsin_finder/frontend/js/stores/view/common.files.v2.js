import { observable, action, runInAction, override } from 'mobx'

import urls from '../../utils/urls'
import { dirIdentifierKey, fileIdentifierKey } from './common.files.items'
import { isAbort } from '@/utils/AbortClient'
import FilesBase from './common.files.base'

class FilesBaseV2 extends FilesBase {
  @observable draftOfHasProject = null

  @observable loadingProjectInfo = null

  @observable loadingMetadata = null

  @observable loadingDraftOfProjects = null

  @override reset() {
    this.draftOfHasProject = null
    this.loadingProjectInfo = null
    this.loadingMetadata = null
    super.reset()
  }

  @override async openDataset(dataset) {
    this.reset()
    runInAction(() => {
      if (!this.datasetIdentifier) this.datasetIdentifier = dataset.identifier
    })
    await Promise.all([
      this.loadProjectInfo(),
      this.loadMetadata(),
      this.checkDraftOfProjects(dataset),
    ])
    return this.loadProjectRoot()
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
        this.loadingProjectInfo.error = error
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
            this.cache[key].originalMetadata = {
              title: file.title,
              description: file.description,
              use_category: file.use_category,
              file_type: file.file_type,
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
            this.cache[key].originalMetadata = {
              title: dir.title,
              description: dir.description,
              use_category: dir.use_category,
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
        console.error(error)
        throw error
      }
      runInAction(() => {
        this.loadingMetadata.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingMetadata?.promise === promise) {
          this.loadingMetadata.done = true
        }
      })
    }
  }

  @action async checkDraftOfProjects(dataset) {
    // If dataset is a draft of another dataset, check if the original had a selected project
    const draftOf = dataset.draftOf?.identifier
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

  async fetchRootIdentifier(projectIdentifier) {
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

  @override get isLoadingProject() {
    if (this.loadingProjectInfo && !this.loadingProjectInfo.done) {
      return true
    }
    if (this.loadingMetadata && !this.loadingMetadata.done) {
      return true
    }
    return super.isLoadingProject
  }

  @override get loadingProjectError() {
    if (this.loadingProjectInfo && this.loadingProjectInfo.error) {
      return this.loadingProjectInfo.error
    }
    if (this.loadingMetadata && this.loadingMetadata.error) {
      return this.loadingMetadata.error
    }
    return super.loading
  }

  @override async retry() {
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

export default FilesBaseV2
