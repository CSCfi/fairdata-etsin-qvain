import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import DatasetQuery from '../../../../stores/view/datasetquery'
import checkDataLang from '../../../../utils/checkDataLang'
import checkNested from '../../../../utils/checkNested'
import TableHeader from '../tableHeader'
import Table from '../table'

export default class ExternalResources extends Component {
  constructor(props) {
    super(props)
    let results
    // this is only for testing and storybook
    if (!props.testData) {
      results = DatasetQuery.results
    } else {
      results = props.testData
    }
    const remote = results.research_dataset.remote_resources
    console.log('remote', remote)
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
    parsed.checksum = ext.checksum
    parsed.download_url = ext.download_url
    parsed.access_url = ext.access_url
    if (checkNested(ext, 'use_category', 'pref_label')) {
      parsed.category = ext.use_category.pref_label
    }
    if (checkNested(ext, 'resource_type', 'pref_label')) {
      parsed.resource_type = ext.resource_type.pref_label
    }
    parsed.description = ext.description
    return parsed
  }

  render() {
    if (!this.state.results) {
      return 'Loading'
    }
    console.log('data', this.state.currentFolder)
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

ExternalResources.defaultProps = {
  testData: null,
}

ExternalResources.propTypes = {
  testData: PropTypes.object,
}
