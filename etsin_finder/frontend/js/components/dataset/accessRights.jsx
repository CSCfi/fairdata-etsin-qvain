import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import checkNested from '../../utils/checkNested'
import checkDataLang from '../../utils/checkDataLang'
import Button from '../general/button'
import Modal from '../general/modal'

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
    let description = ''
    let url = ''
    if (props.access_rights !== undefined && props.access_rights !== null) {
      title = props.access_rights.access_type
        ? props.access_rights.access_type.pref_label
        : props.access_rights.license.map(item => item.title)[0]
      description = props.access_rights.description
      url = props.access_rights.access_url
    }
    this.lang = props.Stores.Locale.currentLang
    this.state = {
      title,
      description,
      url,
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  restricted() {
    return (
      <div>
        <FontAwesomeIcon icon={faLock} />
        <AccessLabel>{checkDataLang(this.state.title)}</AccessLabel>
      </div>
    )
  }

  openAccess() {
    return (
      <div>
        <FontAwesomeIcon icon={faLockOpen} />
        <AccessLabel>{checkDataLang(this.state.title)}</AccessLabel>
      </div>
    )
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  render() {
    this.lang = this.props.Stores.Locale
    // display button on dataset page
    if (this.props.button) {
      return (
        <React.Fragment>
          <CustomButton
            onClick={this.openModal}
            color="lightgray"
            padding="0.2em 0.9em"
            noMargin
            {...this.props}
          >
            <Inner title={checkDataLang(this.state.description)}>
              {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
            </Inner>
          </CustomButton>
          {/* POPUP modal */}
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Access Modal"
          >
            <ModalInner>
              {console.log(this.props.access_rights)}
              {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
              {this.state.description && (
                <div>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <AccessLabel>{checkDataLang(this.state.description)}</AccessLabel>
                </div>
              )}
              {this.state.url && (
                <div>
                  <FontAwesomeIcon icon={faGlobe} />
                  <AccessUrl href={this.state.url.identifier} title={this.state.url.identifier}>
                    {checkDataLang(this.state.url.title)}
                  </AccessUrl>
                </div>
              )}
            </ModalInner>
          </Modal>
        </React.Fragment>
      )
    }
    // display only main info on results list
    return (
      <Access {...this.props}>
        <Inner title={checkDataLang(this.state.description)}>
          {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
        </Inner>
      </Access>
    )
  }
}

export default inject('Stores')(observer(AccessRights))
export const undecorated = AccessRights

const Access = styled.div`
  padding: 0.2em 0.9em;
  background-color: ${p => p.theme.color.lightgray};
  border-radius: 1em;
`

const CustomButton = styled(Button)`
  border-radius: 1em;
  color: ${p => p.theme.color.dark};
`

const AccessLabel = styled.div`
  display: inline;
`

const AccessUrl = styled.a`
  display: inline;
`

const Inner = styled.div`
  max-width: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    width: max-content;
    max-width: 14em;
  }
  svg {
    margin-right: 0.5em;
  }
`

const ModalInner = styled.div`
  max-width: 100%;
  svg {
    margin-right: 1.5em;
  }
`

AccessRights.defaultProps = {
  access_rights: undefined,
  button: false,
}

AccessRights.propTypes = {
  button: PropTypes.bool,
  access_rights: PropTypes.shape({
    description: PropTypes.object,
    access_url: PropTypes.object,
    access_type: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      pref_label: PropTypes.objectOf(PropTypes.string),
    }),
    license: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  Stores: PropTypes.object.isRequired,
}
