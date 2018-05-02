import React, { Component, Fragment } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import Breadcrumbs from '../downloads/breadcrumbs'
import TableItem from './tableItem'

export default class Table extends Component {
  state = {}

  // prints files to dom as list items
  tableItems(folder) {
    return folder.map((single, i) => {
      let current = single
      // check if file is among described files (if there is more information available)
      const described = this.state.filesAndFolders.filter(
        item => item.identifier === single.identifier
      )[0]
      if (described) {
        current = described
      }
      return (
        <TableItem
          key={`dataitem-${current.details.identifier}`}
          item={current}
          index={i}
          changeFolder={this.changeFolder}
          access={this.state.access}
        />
      )
    })
  }

  render() {
    return (
      <Fragment>
        {this.props.breadcrumbs && null
        // <Breadcrumbs
        //   path={this.state.currentPath}
        //   ids={this.state.currentIDs}
        //   callback={this.updatePath}
        // />
        }
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
          <tbody>{this.tableItems(this.state.currentFolder)}</tbody>
        </table>
      </Fragment>
    )
  }
}

Table.propTypes = {
  breadcrumbs: PropTypes.bool.isRequired,
}
