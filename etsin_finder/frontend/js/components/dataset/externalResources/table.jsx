import React, { Component, Fragment } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

// import Breadcrumbs from '../downloads/breadcrumbs'
import TableItem from './tableItem'

export default class Table extends Component {
  state = {}

  parseIda = ida => {
    const parsed = {}
    if (ida.type === 'dir') {
      parsed.type = ida.type
      parsed.name = ida.name
      parsed.file_count = ida.details.file_count
      parsed.byte_size = ida.details.byte_size
      parsed.identifier = ida.identifier
      parsed.category = ida.use_category.pref_label
      parsed.description = ida.description
    } else {
      parsed.type = ida.type
      parsed.name = ida.name
      parsed.byte_size = ida.details.byte_size
      parsed.identifier = ida.identifier
      parsed.category = ida.use_category.pref_label
      parsed.description = ida.description
    }
    return parsed
  }

  changeFolder() {
    console.log('hi')
  }

  // prints files to dom as list items
  tableItems(folder) {
    return folder.map((single, i) => {
      let current = single
      // check if file is among described files (if there is more information available)
      const described = this.props.describedObjects.filter(
        item => item.identifier === single.identifier
      )[0]
      if (described) {
        current = described
      }
      current = this.parseIda(current)
      return (
        <TableItem
          key={`dataitem-${current.identifier}`}
          item={current}
          index={i}
          changeFolder={this.changeFolder}
          access={this.props.access}
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
          <tbody>{this.tableItems(this.props.currentFolder)}</tbody>
        </table>
      </Fragment>
    )
  }
}

Table.defaultProps = {
  describedObjects: [],
}

Table.propTypes = {
  breadcrumbs: PropTypes.bool.isRequired,
  currentFolder: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  describedObjects: PropTypes.arrayOf(PropTypes.object.isRequired),
  access: PropTypes.bool.isRequired,
}
