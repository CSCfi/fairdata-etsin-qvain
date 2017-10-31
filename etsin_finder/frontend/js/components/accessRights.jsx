import React, { Component } from 'react'

export default class AccessRights extends Component {
  accessRights() {
    // this is not the right place to check. type if array
    if (this.props.access_rights !== undefined) {
      if (this.props.access_rights.type.filter(item => item.identifier !== 'http://purl.org/att/es/reference_data/access_type/access_type_open_access')[0]) {
        return (
          <div>
            <i className="fa fa-lock" aria-hidden="true" />
            <span> Rajattu käyttöoikeus</span>
          </div>
        )
      }
      return (
        <div>
          <i className="fa fa-unlock" aria-hidden="true" />
          <span> Open</span>
        </div>
      )
    }
    return 'not defined'
  }

  render() {
    return (
      <button className="btn btn-gray" disabled>
        {this.accessRights()}
      </button>
    );
  }
}
