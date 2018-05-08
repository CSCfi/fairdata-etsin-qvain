import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TableItem from './tableItem'

export default class Table extends Component {
  state = {}

  // prints files to dom as list items
  tableItems(data) {
    return data.map((single, i) => (
      <TableItem
        key={`dataitem-${single.identifier}`}
        item={single}
        index={i}
        changeFolder={this.props.changeFolder}
        access={this.props.access}
        fields={this.props.fields}
      />
    ))
  }

  render() {
    return (
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
    )
  }
}

Table.defaultTypes = {
  changeFolder: () => {},
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  changeFolder: PropTypes.func,
  access: PropTypes.bool.isRequired,
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
