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
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import faExclamation from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import TableItem from './tableItem'

const itemMaxAmt = 500

export default class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadUrl: '/api/dl',
    }

    this.downloadRef = React.createRef()
  }

  downloadFile = (itemID, type) => {
    let urlParams = `?cr_id=${this.props.cr_id}`
    if (type === 'dir') {
      urlParams += `&dir_id=${itemID}`
    } else {
      urlParams += `&file_id=${itemID}`
    }
    this.setState(
      {
        downloadUrl: `/api/dl${urlParams}`,
      },
      () => {
        this.downloadRef.current.click()
      }
    )
  }

  downloadProgress = pe => {
    console.log(pe)
  }

  // prints files to dom as list items
  tableItems(data) {
    /* eslint-disable react/no-array-index-key */
    return data.map((single, i) => (
      <TableItem
        key={`dataitem-${single.identifier}-${single.name}`}
        item={single}
        index={i}
        changeFolder={this.props.changeFolder}
        allowInfo={this.props.allowInfo}
        allowDownload={this.props.allowDownload}
        fields={this.props.fields}
        download={this.downloadFile}
        isRemote={this.props.isRemote}
      />
    ))
  }
  /* eslint-enable react/no-array-index-key */

  render() {
    const sliced = this.props.data.length > itemMaxAmt
    const data = sliced ? this.props.data.slice(0, itemMaxAmt) : this.props.data

    return (
      <TableContainer>
        <StyledTable>
          <THead>
            <tr>
              <Icon scope="col">
                <Translate content="dataset.dl.type" className="sr-only" />
              </Icon>
              {this.props.fields.name && (
                <Name scope="col">
                  <Translate content="dataset.dl.name" />
                </Name>
              )}
              {this.props.fields.size && (
                <Size scope="col">
                  <Translate content="dataset.dl.size" />
                </Size>
              )}
              {this.props.fields.category && (
                <Category scope="col">
                  <Translate content="dataset.dl.category" />
                </Category>
              )}
              {(this.props.fields.downloadBtn || this.props.fields.infoBtn) && (
                <Buttons scope="col">
                  <Translate content="dataset.dl.info" className="sr-only" />
                </Buttons>
              )}
            </tr>
          </THead>
          <TBody>
            {sliced && (
              <tr>
                <SlicedInfo colSpan="5">
                  <FontAwesomeIcon icon={faExclamation} />
                  {' '}
                  <Translate content="dataset.dl.sliced" />
                </SlicedInfo>
              </tr>
            )}
            {this.tableItems(data)}
          </TBody>
        </StyledTable>
        {this.state.downloadUrl && (
          <HiddenLink ref={this.downloadRef} href={this.state.downloadUrl} download />
        )}
      </TableContainer>
    )
  }
}

Table.defaultProps = {
  changeFolder: () => {},
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  changeFolder: PropTypes.func,
  allowDownload: PropTypes.bool.isRequired,
  allowInfo: PropTypes.bool.isRequired,
  isRemote: PropTypes.bool.isRequired,
  cr_id: PropTypes.string.isRequired,
  fields: PropTypes.shape({
    size: PropTypes.bool.isRequired,
    name: PropTypes.bool.isRequired,
    category: PropTypes.bool.isRequired,
    downloadBtn: PropTypes.bool.isRequired,
    infoBtn: PropTypes.bool.isRequired,
  }).isRequired,
}

const Category = styled.th`
  display: none;
  @media (min-width: ${p => p.theme.breakpoints.sm}) {
    display: table-cell;
  }
`

const Icon = styled.th``

const Size = styled.th``

const Name = styled.th``

const Buttons = styled.th``

const SlicedInfo = styled.td`
  text-align: center;
  padding: 12px;
  color: red;
`

const THead = styled.thead`
  background-color: ${p => p.theme.color.darker};
  color: white;
  th {
    border: 0;
    font-weight: 400;
    padding: 12px;
  }
`

const TBody = styled.tbody`
  position: relative;
  border: 2px solid ${p => p.theme.color.lightgray};
  border-top: none;
  color: ${p => p.theme.color.dark};
  font-weight: 300;
`

const StyledTable = styled.table`
  width: 100%;
`

const TableContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    overflow-x: hidden;
  }
`

const HiddenLink = styled.a`
  visibility: hidden;
  display: none;
`
