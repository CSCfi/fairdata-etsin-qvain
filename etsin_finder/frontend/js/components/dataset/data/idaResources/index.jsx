import React, { Component } from 'react'
import styled from 'styled-components'
import translate from 'counterpart'

import DatasetQuery from '../../../../stores/view/datasetquery'
import createTree from '../../../../utils/createTree'
import TableHeader from '../tableHeader'
import Table from '../table'
import Breadcrumbs from '../breadcrumbs'
import access from '../../../../stores/view/access'
import Accessibility from '../../../../stores/view/accessibility'

export default class IdaResources extends Component {
  constructor(props) {
    super(props)
    const results = DatasetQuery.results
    const files = results.research_dataset.files
    const folders = results.research_dataset.directories
    if (files || folders) {
      const parsed = this.createDirTree(files, folders)
      // createTree converts combined to object with nested hierarchy
      const fileDirTree = createTree(parsed)
      const totalCount = this.countFiles(fileDirTree)
      this.state = {
        results,
        described: parsed,
        allowInfo: access.restrictions.allowDataIdaInfoButton,
        allowDownload: access.restrictions.allowDataIdaDownloadButton,
        fileDirTree,
        currentFolder: fileDirTree,
        currentPath: [],
        currentIDs: [],
        totalCount,
      }
    }

    this.updatePath = this.updatePath.bind(this)
    this.changeFolder = this.changeFolder.bind(this)
    this.query = this.query.bind(this)
    this.tableFocusReset = React.createRef()
  }

  // combines folders and files into single array of objects
  /*
    {
      title: ,
      description?: ,
      use_category: ,
      type: ,
      identifier: ,
      name: ,
      path: ,
      byte_size: ,
      directory: {
        file_count: ,
      }
      file: {
        file_format?: ,
        open_access?: ,
        file_characteristics: ,
        checksum: ,
      }
    }
  */

  createDirTree(files, folders, fileApi = false) {
    let filePaths = []
    let folderPaths = []
    if (files) {
      if (!fileApi) {
        filePaths = files.map(file => ({
          title: file.title,
          description: file.description,
          use_category: file.use_category,
          type: file.file_type,
          identifier: file.details.identifier,
          name: file.details.file_name,
          path: file.details.file_path.substring(1),
          byte_size: file.details.byte_size,
          file: {
            file_format: file.details.file_format,
            open_access: file.details.open_access,
            file_characteristics: file.details.file_characteristics,
            checksum: file.details.checksum,
          },
          directory: undefined,
        }))
      } else {
        filePaths = files.map(file => ({
          title: undefined,
          description: undefined,
          use_category: undefined,
          type: undefined,
          identifier: file.identifier,
          name: file.file_name,
          path: file.file_path.substring(1),
          byte_size: file.byte_size,
          file: {
            file_format: file.file_format,
            open_access: file.open_access,
            file_characteristics: file.file_characteristics,
            checksum: { value: file.checksum_value },
          },
          directory: undefined,
        }))
      }
    }
    if (folders) {
      if (!fileApi) {
        folderPaths = folders.map(folder => ({
          title: folder.title,
          description: folder.description,
          use_category: folder.use_category,
          type: 'dir',
          identifier: folder.details.identifier,
          name: folder.details.directory_name,
          path: folder.details.directory_path.substring(1),
          byte_size: folder.details.byte_size,
          directory: {
            file_count: folder.details.file_count,
          },
          file: undefined,
        }))
      } else {
        folderPaths = folders.map(folder => ({
          title: undefined,
          description: undefined,
          use_category: undefined,
          type: 'dir',
          identifier: folder.identifier,
          name: folder.directory_name,
          path: folder.directory_path.substring(1),
          byte_size: folder.byte_size,
          directory: {
            file_count: folder.file_count,
          },
          file: undefined,
        }))
      }
    }

    if (files && folders) {
      return filePaths.concat(folderPaths)
    }

    if (files || folders) {
      return files ? filePaths : folderPaths
    }

    return null
  }

  // checks if there is more data available (described content) for directory contents
  combineDescribed(formatted) {
    return formatted.map(single => {
      // search for the same ID
      const describedVersion = this.state.described.find(
        described => described.identifier === single.identifier
      )
      // combine the two objects
      if (describedVersion) {
        const combined = { ...single, ...describedVersion }
        return combined
      }
      return single
    })
  }

  // counts total number of files in dataset (files + folders)
  // file = 1
  // folder = file_count
  countFiles(dirTree) {
    const fileCount = dirTree.map(single => {
      // if folder, return folder file amounts
      if (single.directory) {
        return single.directory.file_count
      }
      return 1
    })
    return fileCount.reduce((prev, curr) => prev + curr)
  }

  query(id, newPath, newIDs) {
    DatasetQuery.getFolderData(id, this.state.results.identifier)
      .then(res => {
        const formatted = this.createDirTree(res.files, res.directories, true)
        const currFolder = createTree(this.combineDescribed(formatted)).reverse()
        this.setState({
          currentPath: newPath,
          currentIDs: newIDs,
          currentFolder: currFolder,
        })
        this.tableFocusReset.current.focus()
        Accessibility.announce(translate('dataset.dl.loaded'))
      })
      .catch(err => {
        console.log(err)
      })
  }

  changeFolder(folderName, id) {
    const path = this.state.currentPath.slice()
    path.push(folderName)
    const identifiers = this.state.currentIDs.slice()
    identifiers.push(id)
    const clickedFolder = this.state.currentFolder.find(single => single.identifier === id)
    this.query(clickedFolder.identifier, path, identifiers)
  }

  updatePath(path, id) {
    if (!path) {
      this.setState({
        currentPath: [],
        currentIDs: [],
        currentFolder: this.state.fileDirTree,
      })
    } else {
      const currentIDs = this.state.currentIDs.slice()
      const newIDs = currentIDs.slice(0, currentIDs.indexOf(id) + 1)
      const currentPaths = this.state.currentPath.slice()
      const newPaths = currentPaths.slice(0, currentPaths.indexOf(path) + 1)

      this.query(id, newPaths, newIDs)
    }
  }

  render() {
    if (!this.state.results) {
      return ''
    }

    return (
      <DataTable>
        <TableHeader
          objectCount={this.state.totalCount}
          totalSize={this.state.results.research_dataset.total_ida_byte_size}
          title={'files'}
          allowDownload={this.state.allowDownload}
          crId={this.state.results.identifier}
          downloadAll
        />
        <Breadcrumbs
          path={this.state.currentPath}
          folderIds={this.state.currentIDs}
          changeFolder={this.updatePath}
        />
        <div className="sr-only" aria-hidden tabIndex="-1" ref={this.tableFocusReset} />
        <Table
          cr_id={this.state.results.identifier}
          data={this.state.currentFolder}
          allowDownload={this.state.allowDownload}
          allowInfo={this.state.allowInfo}
          changeFolder={this.changeFolder}
          isRemote={false}
          fields={{ size: true, category: true, name: true, downloadBtn: true, infoBtn: true }}
        />
      </DataTable>
    )
  }
}

const DataTable = styled.div`
  margin-top: 1em;
`
