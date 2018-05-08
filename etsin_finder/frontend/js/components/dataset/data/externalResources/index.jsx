import React, { Component } from 'react'
import styled from 'styled-components'

import DatasetQuery from '../../../../stores/view/datasetquery'
import checkDataLang from '../../../../utils/checkDataLang'
import checkNested from '../../../../utils/checkNested'
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
      <DataTable>
        <TableHeader
          objectCount={this.state.totalCount}
          title={'remote'}
          access
          downloadAll={false}
        />
        <Table
          data={this.state.currentFolder}
          access
          fields={{ size: false, category: false, name: true, downloadBtn: false, infoBtn: true }}
        />
      </DataTable>
    )
  }
}

const DataTable = styled.div`
  margin-top: 1em;
`
