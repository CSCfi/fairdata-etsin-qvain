{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import checkNested from '../../utils/checkNested'
import checkDataLang from '../../utils/checkDataLang'
import Button from '../general/button'
import Modal from '../general/modal'

export const accessRightsBool = accessRights => {
  const openValue = 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open_access'

  if (accessRights !== undefined && accessRights !== null) {
    // check access_type
    if (checkNested(accessRights, 'access_type')) {
      if (accessRights.access_type.identifier === openValue) {
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
      if (checkNested(props.access_rights, 'access_type', 'pref_label')) {
        title = props.access_rights.access_type.pref_label
      }
      description = props.access_rights.description
      url = props.access_rights.access_url
    }
    this.state = {
      title,
      description,
      url,
      restriction_grounds:
        checkNested(props.access_rights, 'restriction_grounds', 'pref_label') &&
        props.access_rights.restriction_grounds.pref_label,
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
              {this.state.restriction_grounds && (
                <div>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <AccessLabel>{checkDataLang(this.state.restriction_grounds)}</AccessLabel>
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
  & > div:not(:last-child) {
    margin-bottom: 0.2em;
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
    restriction_grounds: PropTypes.shape({
      pref_label: PropTypes.objectOf(PropTypes.string),
    }),
    license: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  Stores: PropTypes.object.isRequired,
}
