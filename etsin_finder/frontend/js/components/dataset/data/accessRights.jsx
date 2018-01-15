import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import checkNested from '../../../utils/checkNested'
import checkDataLang from '../../../utils/checkDataLang'

class AccessRights extends Component {
  constructor(props) {
    super(props)
    let title = { en: 'Restricted Access' }
    if (this.props.access_rights !== undefined && this.props.access_rights !== null) {
      title = this.props.access_rights.type
        ? this.props.access_rights.type.map(item => item.label)[0]
        : this.props.access_rights.license.map(item => item.label)[0]
    }
    this.lang = this.props.Stores.Locale.currentLang
    this.state = {
      title,
    }
  }
  accessRights() {
    // this is not the right place to check. type if array
    if (this.props.access_rights !== undefined && this.props.access_rights !== null) {
      if (checkNested(this.props.access_rights, 'type')
      && !this.props.access_rights.type.filter(item =>
        item.identifier !== 'http://purl.org/att/es/reference_data/access_type/access_type_open_access')[0]
      ) {
        return (
          this.openAccess()
        )
      }
    }
    return (
      this.restricted()
    )
  }

  restricted() {
    return (
      <div className="access-symbol" title={checkDataLang(this.state.title, this.lang)}>
        <i className="fa fa-lock" aria-hidden="true" />
        <Translate content="dataset.access_locked" fallback="Restricted Access" />
      </div>
    )
  }

  openAccess() {
    return (
      <div className="access-symbol" title={checkDataLang(this.state.title, this.lang)}>
        <i className="fa fa-unlock" aria-hidden="true" />
        <Translate content="dataset.access_open" fallback="Open Access" />
      </div>
    )
  }

  render() {
    this.lang = this.props.Stores.Locale
    return (
      <button className="btn btn-gray" disabled>
        {this.accessRights()}
      </button>
    );
  }
}

export default inject('Stores')(observer(AccessRights))
export const undecorated = AccessRights
