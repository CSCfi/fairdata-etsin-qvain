import { action, override, observable, runInAction, makeObservable } from 'mobx'
import FilesBaseV3 from '../common.files.v3'
import QvainFilesMixin from './qvain.files.mixin'

class QvainFilesV3 extends QvainFilesMixin(FilesBaseV3) {
  constructor(Env, Auth) {
    super(Env, Auth)
    makeObservable(this)
  }

  // True when dataset been published with files or is a draft from a dataset with files.
  // Only used in V3, undefined in V2.
  @observable hasPublishedFiles = null

  @action async checkHasPublishedFiles(dataset) {
    // Determine if dataset or its draft_of has been published with files.
    const draftOf = dataset.draft_of?.id
    let publishedDataset
    if (dataset.state === 'published') {
      publishedDataset = dataset
    } else if (draftOf) {
      await this.client.abort('check-has-published-files') // abort previous request if any
      const { data } = await this.client.get(this.Env.metaxV3Url('dataset', draftOf), {
        params: { fields: 'id,title,fileset,deprecated' },
        tag: 'check-has-published-files',
      })
      publishedDataset = data
    }

    let hasPublishedFiles = false
    if (publishedDataset?.fileset?.total_files_count > 0 || publishedDataset?.deprecated) {
      hasPublishedFiles = true
    }
    runInAction(() => {
      this.hasPublishedFiles = hasPublishedFiles
    })
  }

  @override async openDataset(dataset) {
    this.hasPublishedFiles = null
    return Promise.all([super.openDataset(dataset), this.checkHasPublishedFiles(dataset)])
  }

  @override reset() {
    this.hasPublishedFiles = null
    super.reset()
  }

  directoryMetadataToMetax(dir) {
    return {
      title: dir.title || undefined,
      description: dir.description || undefined,
      use_category:
        (dir.useCategory && {
          url: dir.useCategory,
        }) ||
        undefined,
    }
  }

  fileMetadataToMetax(file) {
    return {
      title: file.title || undefined,
      description: file.description || undefined,
      file_type:
        (file.fileType && {
          url: file.fileType,
        }) ||
        undefined,
      use_category:
        (file.useCategory && {
          url: file.useCategory,
        }) ||
        undefined,
    }
  }

  itemMetadataToMetax(item) {
    if (item.type === 'file') {
      return this.fileMetadataToMetax(item)
    }
    return this.directoryMetadataToMetax(item)
  }

  actionsToMetax() {
    // Returns addition/removal actions
    if (!this.selectedProject) {
      return null
    }

    const actions = { directories: [], files: [] }
    const recurse = item => {
      const actionGroup = item.type === 'file' ? actions.files : actions.directories
      let metadata = null
      let actionType = null

      if (this.metadataHasChanged(item)) {
        metadata = this.itemMetadataToMetax(item)
      }

      if (item.added) {
        actionType = 'add'
      } else if (item.removed) {
        actionType = 'remove'
      } else if (metadata) {
        actionType = 'update'
      }

      if (actionType) {
        const action = {
          action: actionType,
        }
        if (item.type !== 'file') {
          action.pathname = item.path
        } else {
          action.id = item.id
        }
        if (metadata) {
          action.dataset_metadata = metadata
        }
        actionGroup.push(action)
      }

      if (item.type !== 'file') {
        item.files.forEach(f => recurse(f))
        item.directories.forEach(d => recurse(d))
      }
    }
    if (this.root) {
      this.root.directories.forEach(d => recurse(d))
      this.root.files.forEach(f => recurse(f))
    }
    return {
      directory_actions: actions.directories,
      file_actions: actions.files,
      storage_service: 'ida',
      csc_project: this.selectedProject,
    }
  }
}

export default QvainFilesV3
