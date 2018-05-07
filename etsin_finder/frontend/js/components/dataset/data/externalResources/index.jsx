import React, { Component } from 'react'

import DatasetQuery from '../../../../stores/view/datasetquery'
import createTree from '../../../../utils/createTree'
import checkDataLang from '../../../../utils/checkDataLang'
import checkNested from '../../../../utils/checkNested'
import { accessRightsBool } from '../../accessRights'
import TableHeader from '../tableHeader'
import Table from '../table'

export default class ExternalResources extends Component {
  constructor(props) {
    super(props)
    let results
    if (!props.results) {
      results = DatasetQuery.results
    } else {
      results = props.results
    }
    const remote = results.research_dataset.remote_resources
    if (remote) {
      // createTree converts combined to object with nested hierarchy
      const parsed = remote.map(single => this.parseExt(single))
      const totalCount = parsed.length
      this.state = {
        results,
        access: accessRightsBool(results.research_dataset.access_rights),
        currentFolder: parsed,
        totalCount,
      }
    }
  }

  parseExt = ext => {
    const parsed = {}
    if (checkNested(ext, 'file_type', 'pref_label')) {
      parsed.type = checkDataLang(ext.file_type.pref_label)
    }
    parsed.name = ext.title
    parsed.byte_size = ext.byte_size
    parsed.identifier = ext.identifier
    if (checkNested(ext, 'use_category', 'pref_label')) {
      parsed.category = ext.use_category.pref_label
    }
    parsed.description = ext.description
    return parsed
  }

  render() {
    if (!this.state.results) {
      return 'Loading'
    }

    return (
      <div className="dataset-downloads">
        <TableHeader
          objectCount={this.state.totalCount}
          title={'files'}
          access={this.state.access}
        />
        <Table data={this.state.currentFolder} access={this.state.access} />
      </div>
    )
  }
}
