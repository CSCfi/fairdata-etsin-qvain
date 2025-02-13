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
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faLockOpen,
  faInfoCircle,
  faExclamationTriangle,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import checkNested from '../../../../utils/checkNested'
import Button from '../../../general/button'
import Modal from '../../../general/modal'
import { ACCESS_TYPE_URL } from '../../../../utils/constants'
import { withStores } from '../../../../utils/stores'

export const accessRightsBool = accessRights => {
  if (accessRights !== undefined && accessRights !== null) {
    // check access_type
    if (checkNested(accessRights, 'access_type')) {
      if (accessRights.access_type.identifier === ACCESS_TYPE_URL.OPEN) {
        return true
      }
    }
  }
  return false
}

class AccessRights extends Component {
  constructor(props) {
    super(props)
    const {
      Locale: { translate },
    } = this.props.Stores
    let title = { en: 'Restricted Access', fi: 'Rajoitettu käyttöoikeus' }
    let description = ''
    let identifier = ''
    let url = ''
    let id = ''
    let embargoDate = ''
    if (props.access_rights !== undefined && props.access_rights !== null) {
      if (checkNested(props.access_rights, 'access_type', 'pref_label')) {
        title = props.access_rights.access_type.pref_label
      }
      identifier = props.access_rights.access_type.identifier
      id = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === identifier)
      description = translate(
        `dataset.access_rights_description.${id !== undefined ? id.toLowerCase() : ''}`
      )
      url = props.access_rights.access_url
      embargoDate = props.access_rights.available
    }
    this.state = {
      title,
      description,
      url,
      embargoDate,
      restriction_grounds:
        props.access_rights.restriction_grounds !== undefined &&
        props.access_rights.restriction_grounds.length > 0 &&
        props.access_rights.restriction_grounds,
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  restricted() {
    const {
      Locale: { dateFormat, getPreferredLang, getValueTranslation },
    } = this.props.Stores

    return (
      <>
        <RestrictedButton>
          <FontAwesomeIcon icon={faLock} title="Closed lock" />
          <div>
            <AccessLabel lang={getPreferredLang(this.state.title)}>
              {getValueTranslation(this.state.title)}
            </AccessLabel>
            {this.state.embargoDate && (
              <Date>{dateFormat(this.state.embargoDate, { shortMonth: true })} </Date>
            )}
          </div>
        </RestrictedButton>
      </>
    )
  }

  openAccess() {
    const [translation, lang] = this.props.Stores.Locale.getValueTranslationWithLang(
      this.state.title
    )
    return (
      <>
        <FontAwesomeIcon icon={faLockOpen} title="Lock open" />
        <AccessLabel lang={lang}>{translation}</AccessLabel>
      </>
    )
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  render() {
    // display button on dataset
    const {
      Locale: { getPreferredLang, getValueTranslation },
    } = this.props.Stores

    if (this.props.button) {
      return (
        <>
          <CustomButton
            onClick={this.openModal}
            color="lightgray"
            padding="0.2em 0.9em"
            noMargin
            {...this.props}
          >
            <Inner
              lang={getPreferredLang(this.state.description)}
              title={getValueTranslation(this.state.description)}
            >
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
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                <div tabIndex="0">
                  <Translate
                    component={FontAwesomeIcon}
                    icon={faInfoCircle}
                    attributes={{ title: 'dataset.additionalInformation' }}
                  />
                  <AccessLabel lang={getPreferredLang(this.state.description)}>
                    {getValueTranslation(this.state.description)}
                  </AccessLabel>
                </div>
              )}
              {this.state.url && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                <div tabIndex="0">
                  <FontAwesomeIcon icon={faGlobe} title="Access to data" />
                  <AccessUrl
                    href={this.state.url.identifier}
                    title={this.state.url.identifier}
                    lang={getPreferredLang(this.state.url.title)}
                  >
                    {getValueTranslation(this.state.url.title)}
                  </AccessUrl>
                </div>
              )}
              {this.state.restriction_grounds &&
                this.state.restriction_grounds.map(rg => (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  <div key={`div-rg-${rg.identifier}`} tabIndex="0">
                    <FontAwesomeIcon
                      key={`fai-rg-${rg.identifier}`}
                      icon={faExclamationTriangle}
                      title="Restricted"
                    />
                    <AccessLabel
                      key={`al-rg-${rg.identifier}`}
                      lang={getPreferredLang(rg.pref_label)}
                      tabIndex="0"
                    >
                      {getValueTranslation(rg.pref_label)}
                    </AccessLabel>
                  </div>
                ))}
            </ModalInner>
          </Modal>
        </>
      )
    }
    // display only main info on results list
    return (
      <Access {...this.props}>
        <Inner
          title={getValueTranslation(this.state.description)}
          lang={getPreferredLang(this.state.description)}
        >
          {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
        </Inner>
      </Access>
    )
  }
}

export default withStores(observer(AccessRights))
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

const Date = styled.span`
  font-size: 12px;
  display: block;
`

const RestrictedButton = styled.div`
  display: flex;
  align-items: center;
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
    available: PropTypes.string,
    access_type: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      pref_label: PropTypes.objectOf(PropTypes.string),
    }),
    restriction_grounds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    license: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  Stores: PropTypes.object.isRequired,
}
