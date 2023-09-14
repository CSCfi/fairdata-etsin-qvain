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
import translate from 'counterpart'
import { faInfoCircle, faExclamationTriangle, faGlobe } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import dateFormat from '@/utils/dateFormat'
import Button from '../general/button'
import Modal from '@/components/general/modal'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { withStores } from '@/utils/stores'

class AccessRights extends Component {
  constructor(props) {
    super(props)
    let title = ''
    let description = ''
    let identifier = ''
    let url = ''
    let id = ''
    let embargoDate = ''

    const {
      Etsin: {
        EtsinDataset: { accessRights },
      },
    } = this.props.Stores

    title = accessRights?.access_type?.pref_label || {
      en: 'Restricted Access',
      fi: 'Rajoitettu käyttöoikeus',
    }
    identifier = accessRights?.access_type.url
    id = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === identifier)
    description = translate(
      `dataset.access_rights_description.${id !== undefined ? id.toLowerCase() : ''}`
    )
    url = accessRights?.access_url
    embargoDate = id === ACCESS_TYPE_URL.EMBARGO ? accessRights?.available : undefined

    this.state = {
      title,
      description,
      url,
      embargoDate,
      restriction_grounds: accessRights?.restriction_grounds,
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.hasOpenAccess = accessRights?.access_type?.url === ACCESS_TYPE_URL.OPEN
  }

  restricted() {
    return (
      <>
        <RestrictedButton>
          <div>
            <AccessLabel lang={getDataLang(this.state.title)}>
              {checkDataLang(this.state.title)}
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
    return (
      <>
        <AccessLabel lang={getDataLang(this.state.title)}>
          {checkDataLang(this.state.title)}
        </AccessLabel>
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
    // display button on dataset page
    if (this.props.button) {
      return (
        <>
          <CustomButton
            onClick={this.openModal}
            color="#e0e0e0"
            padding="0.2em 0.9em"
            noMargin
            {...this.props}
          >
            <Inner
              lang={getDataLang(this.state.description)}
              title={checkDataLang(this.state.description)}
            >
              {this.hasOpenAccess ? this.openAccess() : this.restricted()}
            </Inner>
          </CustomButton>
          {/* POPUP modal */}
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Access Modal"
          >
            <ModalInner>
              {this.hasOpenAccess ? this.openAccess() : this.restricted()}
              {this.state.description && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                <div tabIndex="0">
                  <Translate
                    component={FontAwesomeIcon}
                    icon={faInfoCircle}
                    attributes={{ title: 'dataset.additionalInformation' }}
                  />
                  <AccessLabel lang={getDataLang(this.state.description)}>
                    {checkDataLang(this.state.description)}
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
                    lang={getDataLang(this.state.url.title)}
                  >
                    {checkDataLang(this.state.url.title)}
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
                      lang={getDataLang(rg.pref_label)}
                      tabIndex="0"
                    >
                      {checkDataLang(rg.pref_label)}
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
          title={checkDataLang(this.state.description)}
          lang={getDataLang(this.state.description)}
        >
          {this.hasOpenAccess ? this.openAccess() : this.restricted()}
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
  margin: 0rem 0.5rem;
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
  button: false,
}

AccessRights.propTypes = {
  button: PropTypes.bool,
  Stores: PropTypes.object.isRequired,
}
