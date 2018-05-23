import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import checkNested from '../../utils/checkNested'
import checkDataLang from '../../utils/checkDataLang'

export const accessRightsBool = accessRights => {
  const openValues = [
    'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
    'open_access',
    'http://www.opensource.org/licenses/Apache-2.0',
  ]

  // function to compare string to possible open values
  const checkOpen = string => {
    if (openValues.filter(open => open === string)[0]) {
      return true
    }
    return false
  }

  if (accessRights !== undefined && accessRights !== null) {
    // check access_type
    if (checkNested(accessRights, 'access_type')) {
      if (checkOpen(accessRights.access_type.identifier)) {
        return true
      }
    }
    // check license
    if (checkNested(accessRights, 'license')) {
      if (accessRights.license.filter(item => checkOpen(item.identifier))[0]) {
        return true
      }
    }
  }
  return false
}

class AccessRights extends Component {
  constructor(props) {
    super(props)
    let title = { en: 'Restricted Access', fi: 'Rajoitettu käyttöoikeus' }
    if (props.access_rights !== undefined && props.access_rights !== null) {
      title = props.access_rights.access_type
        ? props.access_rights.access_type.pref_label
        : props.access_rights.license.map(item => item.title)[0]
    }
    this.lang = props.Stores.Locale.currentLang
    this.state = {
      title,
    }
  }

  restricted() {
    return (
      <div title={checkDataLang(this.state.title)}>
        <FontAwesomeIcon icon={faLock} />
        <AccessLabel>{checkDataLang(this.state.title)}</AccessLabel>
      </div>
    )
  }

  openAccess() {
    return (
      <div title={checkDataLang(this.state.title)}>
        <FontAwesomeIcon icon={faLockOpen} />
        <AccessLabel>{checkDataLang(this.state.title)}</AccessLabel>
      </div>
    )
  }
  render() {
    this.lang = this.props.Stores.Locale
    return (
      <Access {...this.props}>
        {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
      </Access>
    )
  }
}

export default inject('Stores')(observer(AccessRights))
export const undecorated = AccessRights

const Access = styled.div`
  background-color: ${props => props.theme.color.lightgray};
  padding: 0.2em 0.9em;
  border-radius: 1em;
  svg {
    margin-right: 0.5em;
  }
`

const AccessLabel = styled.div`
  display: inline;
`

AccessRights.defaultProps = {
  access_rights: undefined,
}

AccessRights.propTypes = {
  access_rights: PropTypes.shape({
    access_type: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      pref_label: PropTypes.objectOf(PropTypes.string),
    }),
    license: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  Stores: PropTypes.object.isRequired,
}
