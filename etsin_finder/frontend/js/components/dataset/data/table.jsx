import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

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
      />
    ))
  }

  render() {
    return (
      <table className="table downloads-table" aria-live="polite">
        <thead className="thead-dark">
          <tr>
            <th className="rowIcon" scope="col" />
            <th className="rowName" scope="col">
              <Translate content="dataset.dl.name" />
            </th>
            <th className="rowSize" scope="col">
              <Translate content="dataset.dl.size" />
            </th>
            <th className="rowCategory" scope="col">
              <Translate content="dataset.dl.category" />
            </th>
            <th className="rowButtons" scope="col" />
          </tr>
        </thead>
        <tbody>{this.tableItems(this.props.data)}</tbody>
      </table>
    )
  }
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  changeFolder: PropTypes.func.isRequired,
  access: PropTypes.bool.isRequired,
}
