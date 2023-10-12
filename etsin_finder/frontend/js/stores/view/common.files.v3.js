import { override } from 'mobx'

import FilesBase from './common.files.base'

class FilesBaseV3 extends FilesBase {
  useV3 = true // use V3 loaders

  @override async openDataset(dataset) {
    this.reset()
    this.datasetIdentifier = dataset.identifier
    const datasetContent = dataset.dataset || dataset
    this.selectedProject = datasetContent.fileset?.project
    if (this.selectedProject) {
      this.projectLocked = true
    }
    return this.loadProjectRoot()
  }

  async fetchRootIdentifier() {
    // Metax V3 uses paths for identifying directories, root is always /
    return '/'
  }
}

export default FilesBaseV3
