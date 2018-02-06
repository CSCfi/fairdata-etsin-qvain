import React, { Component } from 'react'
import DataItem from './data/dataItem'
import DatasetQuery from '../../stores/view/datasetquery'
import checkDataLang from '../../utils/checkDataLang'
import Breadcrumbs from './data/breadcrumbs'
import sizeParse from '../../utils/sizeParse'
import createTree from '../../utils/createTree'

export default class Downloads extends Component {
  constructor(props) {
    super(props)

    const files = DatasetQuery.results.research_dataset.files
    const folders = DatasetQuery.results.research_dataset.directories
    const fileDirTree = this.createDirTree(files, folders)
    this.state = {
      results: DatasetQuery.results,
      fileDirTree,
      currentFolder: fileDirTree,
      currentPath: [],
    }

    this.updatePath = this.updatePath.bind(this)
    this.tableItems = this.tableItems.bind(this)
    this.changeFolder = this.changeFolder.bind(this)
  }

  createDirTree(files, folders) {
    let filePaths = []
    let folderPaths = []
    console.log(files)
    console.log(folders)
    if (filePaths) {
      filePaths = files.map(file => {
        let fileType
        if (file.type || file.file_type) {
          fileType = file.type
            ? checkDataLang(file.type.pref_label)
            : checkDataLang(file.file_type.pref_label)
        }
        return {
          path: file.details.file_path.substring(1),
          type: fileType,
          details: file.details,
          use_category: file.use_category,
          title: file.title,
          identifier: file.identifier,
        }
      })
    }
    if (folders) {
      folderPaths = folders.map(folder => ({
        path: folder.details.directory_path.substring(1),
        type: 'dir',
        details: folder.details,
        use_category: folder.use_category,
        title: folder.title,
        identifier: folder.identifier,
      }))
    }
    const combined = filePaths.concat(folderPaths)
    return createTree(combined)
  }

  changeFolder(folderName) {
    console.log(folderName)
    const path = this.state.currentPath.slice()
    path.push(folderName)
    let currFolder = this.state.currentFolder.slice()
    currFolder = currFolder.find(single => single.name === folderName).children
    this.setState({
      currentPath: path,
      currentFolder: currFolder,
    })
  }

  updatePath(path) {
    if (!path) {
      this.setState({
        currentPath: [],
        currentFolder: this.state.fileDirTree,
      })
    } else {
      const currentPath = this.state.currentPath.slice()
      const newPath = currentPath.slice(0, currentPath.indexOf(path) + 1)

      const fileDirTree = this.state.fileDirTree
      let currentFolder = fileDirTree
      newPath.map(folder => {
        currentFolder = currentFolder.find(item => item.path === folder)
          .children
        return true
      })
      this.setState({
        currentPath: newPath,
        currentFolder,
      })
    }
  }

  tableItems() {
    return this.state.currentFolder.map((single, i) => (
      <DataItem
        key={`dataitem-${single.details.id}`}
        item={single}
        index={i}
        changeFolder={this.changeFolder}
      />
    ))
  }

  render() {
    if (!this.state.results) {
      return 'Loading'
    }

    return (
      <div className="dataset-downloads">
        <div className="downloads-header d-flex justify-content-between">
          <div className="heading-right">
            <div className="title">Tiedostot</div>
            <div className="files-size-all">
              {`${
                this.state.results.research_dataset.files.length
              } aineistoa (${sizeParse(
                this.state.results.research_dataset.total_ida_byte_size,
                1
              )})`}
            </div>
          </div>
          <div className="heading-left d-flex align-items-center">
            <div className="files-filter">Suodata</div>
            <div className="files-search">Search</div>
          </div>
        </div>
        <Breadcrumbs path={this.state.currentPath} callback={this.updatePath} />
        <table className="table downloads-table">
          <thead className="thead-dark">
            <tr>
              <th className="rowIcon" scope="col" />
              <th className="rowName" scope="col">
                Nimi
              </th>
              <th className="rowSize" scope="col">
                Koko
              </th>
              <th className="rowCategory" scope="col">
                Kategoria
              </th>
              <th className="rowButtons" scope="col" />
            </tr>
          </thead>
          <tbody>{this.tableItems()}</tbody>
        </table>
      </div>
    )
  }
}
