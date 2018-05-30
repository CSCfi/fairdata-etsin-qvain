import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TableItem from './tableItem'

export default class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadUrl: '/api/od',
    }

    this.downloadRef = React.createRef()
  }

  downloadFile = (itemID, type, name) => {
    console.log('id', itemID)
    console.log('cr_id', this.props.cr_id)
    const options = {
      cr_id: this.props.cr_id,
    }

    if (type === 'dir') {
      options.dir_ids = itemID
    } else {
      options.file_ids = itemID
    }
    // TODO: create url for api
    this.setState(
      {
        downloadUrl: '/api/od',
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
        access={this.props.access}
        fields={this.props.fields}
        download={this.downloadFile}
      />
    ))
  }
  /* eslint-enable react/no-array-index-key */

  render() {
    return (
      <TableContainer>
        <StyledTable aria-live="polite">
          <THead>
            <tr>
              <Icon scope="col" />
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
                <Buttons scope="col" />
              )}
            </tr>
          </THead>
          <TBody>{this.tableItems(this.props.data)}</TBody>
        </StyledTable>
        {this.state.downloadUrl && (
          <HiddenLink innerRef={this.downloadRef} href={this.state.downloadUrl} download />
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
  access: PropTypes.bool.isRequired,
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
