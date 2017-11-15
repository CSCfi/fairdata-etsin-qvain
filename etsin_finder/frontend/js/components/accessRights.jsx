import React, { Component } from 'react'
import Translate from 'react-translate-component'

export default class AccessRights extends Component {
  accessRights() {
    // this is not the right place to check. type if array
    if (this.props.access_rights !== undefined && this.props.access_rights !== null) {
      if (this.props.access_rights.type.filter(item => item.identifier !== 'http://purl.org/att/es/reference_data/access_type/access_type_open_access')[0]) {
        return (
          <div className="access-symbol">
            <i className="fa fa-lock" aria-hidden="true" />
            <Translate content="dataset.access_locked" fallback="Restricted Access" />
          </div>
        )
      }
      return (
        <div className="access-symbol">
          <i className="fa fa-unlock" aria-hidden="true" />
          <Translate content="dataset.access_open" fallback="Open Access" />
        </div>
      )
    }
    return (
      <div className="access-symbol">
        <i className="fa fa-lock" aria-hidden="true" />
        <Translate content="dataset.access_locked" fallback="Restricted Access" />
      </div>
    )
  }

  render() {
    return (
      <button className="btn btn-gray" disabled>
        {this.accessRights()}
      </button>
    );
  }
}
