{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import DatasetQuery from '../../../../stores/view/datasetquery'
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
    const parsed = {
      name: ext.title,
      description: ext.description,
      use_category: ext.use_category,
      identifier: ext.identifier,
      type: ext.file_type,
      byte_size: ext.byte_size,
      remote: {
        resource_type: ext.resource_type,
        mediatype: ext.mediatype,
        download_url: ext.download_url,
        access_url: ext.access_url,
        object_characteristics: ext.object_characteristics,
        checksum: ext.checksum,
      },
    }
    return parsed
  }

  render() {
    if (!this.state.results) {
      return ''
    }
    return (
      <DataTable>
        <TableHeader
          objectCount={this.state.totalCount}
          title={'remote'}
          allowDownload={false}
          downloadAll={false}
        />
        <Table
          cr_id={this.state.results.identifier}
          data={this.state.currentFolder}
          allowDownload
          allowInfo
          isRemote
          fields={{ size: false, category: false, name: true, downloadBtn: true, infoBtn: true }}
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
