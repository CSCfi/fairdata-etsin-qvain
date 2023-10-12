import urls from '../../../utils/urls'
import { hasMetadata } from '../common.files.items'

import FilesBaseV2 from '../common.files.v2'
import QvainFilesMixin from './qvain.files.mixin'

class QvainFilesV2 extends QvainFilesMixin(FilesBaseV2) {
  async fetchRootIdentifier(projectIdentifier) {
    // when the user is not in project, send datasetIdentifier
    // when the user is in project, don't send datasetIdentifier

    await this.client.abort('fetch-root-identifier')
    if (this.userHasRightsToEditProject) {
      const { data } = await this.client.get(urls.common.projectFiles(projectIdentifier), {
        tag: 'fetch-root-identifier',
      })
      return data.identifier
    }

    const { data } = await this.client.get(urls.common.projectFiles(projectIdentifier), {
      tag: 'fetch-root-identifier',
      params: {
        cr_identifier: this.datasetIdentifier,
      },
    })
    return data.identifier
  }

  directoryMetadataToMetax(dir) {
    return {
      identifier: dir.identifier,
      title: dir.title || undefined,
      description: dir.description || undefined,
      use_category:
        (dir.useCategory && {
          identifier: dir.useCategory,
        }) ||
        undefined,
    }
  }

  fileMetadataToMetax(file) {
    return {
      identifier: file.identifier,
      title: file.title || undefined,
      description: file.description || undefined,
      file_type:
        (file.fileType && {
          identifier: file.fileType,
        }) ||
        undefined,
      use_category:
        (file.useCategory && {
          identifier: file.useCategory,
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

  metadataToMetax() {
    // Returns changed Metadata

    const files = []
    const directories = []

    // add updated selection data
    const recurse = parent => {
      parent.files.forEach(file => {
        if (file.removed) {
          return
        }
        if (hasMetadata(file)) {
          if (this.metadataHasChanged(file)) {
            files.push(this.fileMetadataToMetax(file))
          }
        } else if (file.originalMetadata) {
          files.push({ identifier: file.identifier, delete: true }) // remove metadata
        }
      })

      parent.directories.forEach(dir => {
        if (dir.removed) {
          return
        }
        if (hasMetadata(dir)) {
          if (this.metadataHasChanged(dir)) {
            directories.push(this.directoryMetadataToMetax(dir))
          }
        } else if (dir.originalMetadata) {
          directories.push({ identifier: dir.identifier, delete: true }) // remove metadata
        }
        if (dir.addedChildCount > 0 || dir.fileCount > 0) {
          recurse(dir)
        }
      })
    }
    if (this.root) {
      recurse(this.root)
    }

    return {
      files,
      directories,
    }
  }

  actionsToMetax() {
    // Returns addition/removal actions

    const actions = { directories: [], files: [] }
    const recurse = item => {
      const actionGroup = item.type === 'file' ? actions.files : actions.directories
      if (item.added) {
        actionGroup.push({ identifier: item.identifier })
      }
      if (item.removed) {
        actionGroup.push({ identifier: item.identifier, exclude: true })
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
    return actions
  }
}

export default QvainFilesV2
