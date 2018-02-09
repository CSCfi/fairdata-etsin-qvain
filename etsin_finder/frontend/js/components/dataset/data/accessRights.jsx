import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Tooltip from '../../general/tooltip'

import checkNested from '../../../utils/checkNested'
import checkDataLang from '../../../utils/checkDataLang'

const Access = styled.div`
  background-color: ${props => props.theme.color.lightgray};
  padding: 0.2em 0.9em;
  border-radius: 1em;
`

class AccessRights extends Component {
  constructor(props) {
    super(props)
    let title = { en: 'Restricted Access' }
    if (
      this.props.access_rights !== undefined &&
      this.props.access_rights !== null
    ) {
      title = this.props.access_rights.type
        ? this.props.access_rights.type.map(item => item.identifier)
        : this.props.access_rights.license.map(item => item.identifier)
    }
    this.lang = this.props.Stores.Locale.currentLang
    this.state = {
      title,
    }
  }
  accessRights() {
    console.log(this.props)
    if (
      this.props.access_rights !== undefined &&
      this.props.access_rights !== null
    ) {
      if (
        (checkNested(this.props.access_rights, 'type') &&
          this.props.access_rights.type.filter(
            item => item.identifier === 'open_access'
          ))[0] ||
        (checkNested(this.props.access_rights, 'license') &&
          this.props.access_rights.license.filter(
            item =>
              item.identifier ===
              'http://purl.org/att/es/reference_data/access_type/access_type_open_access'
          )[0])
      ) {
        return this.openAccess()
      }
    }
    return this.restricted()
  }

  restricted() {
    return (
      <Tooltip title={checkDataLang(this.state.title, this.lang)}>
        <div
          className="access-symbol"
          title={checkDataLang(this.state.title, this.lang)}
        >
          <i className="fa fa-lock" aria-hidden="true" />
          <Translate
            content="dataset.access_locked"
            fallback="Restricted Access"
          />
        </div>
      </Tooltip>
    )
  }

  openAccess() {
    return (
      <div
        className="access-symbol"
        title={checkDataLang(this.state.title, this.lang)}
      >
        <i className="fa fa-unlock" aria-hidden="true" />
        <Translate content="dataset.access_open" fallback="Open Access" />
      </div>
    )
  }

  render() {
    this.lang = this.props.Stores.Locale
    return <Access>{this.accessRights()}</Access>
  }
}

export default inject('Stores')(observer(AccessRights))
export const undecorated = AccessRights
