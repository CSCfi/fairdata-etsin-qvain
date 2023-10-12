import FilesBaseV3 from '../common.files.v3'
import QvainFilesMixin from './qvain.files.mixin'

class QvainFilesV3 extends QvainFilesMixin(FilesBaseV3) {
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
      project: this.selectedProject,
    }
  }
}

export default QvainFilesV3
