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

import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import translate from 'counterpart'
import { faInfoCircle, faExclamationTriangle, faGlobe } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Button from '../general/button'
import Modal from '@/components/general/modal'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { useStores } from '@/utils/stores'

function AccessRights(props) {
  const {
    Etsin: {
      EtsinDataset: { accessRights },
    },
    Locale: { getValueTranslation, getPreferredLang, dateFormat },
  } = useStores()

  const [isModalOpen, setModal] = useState(false)

  const title = accessRights?.access_type?.pref_label || {
    en: 'Restricted Access',
    fi: 'Rajoitettu käyttöoikeus',
  }
  const identifier = accessRights?.access_type.url
  const id = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === identifier)
  const description = translate(
    `dataset.access_rights_description.${id !== undefined ? id.toLowerCase() : ''}`
  )
  const url = accessRights?.access_url
  const embargoDate = id === ACCESS_TYPE_URL.EMBARGO ? accessRights?.available : undefined
  const restrictionGrounds = accessRights?.restriction_grounds

  const hasOpenAccess = accessRights?.access_type?.url === ACCESS_TYPE_URL.OPEN

  const restricted = () => (
    <RestrictedButton>
      <div>
        <AccessLabel lang={getPreferredLang(title)}>{getValueTranslation(title)}</AccessLabel>
        {embargoDate && <Date>{dateFormat(embargoDate, { shortMonth: true })} </Date>}
      </div>
    </RestrictedButton>
  )

  const openAccess = () => (
    <AccessLabel lang={getPreferredLang(title)}>{getValueTranslation(title)}</AccessLabel>
  )

  const openModal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  return (
    <>
      <CustomButton
        onClick={() => openModal}
        color="#e0e0e0"
        padding="0.2em 0.9em"
        noMargin
        {...props}
      >
        <Inner lang={getPreferredLang(description)} title={getValueTranslation(description)}>
          {hasOpenAccess ? openAccess() : restricted()}
        </Inner>
      </CustomButton>
      {/* POPUP modal */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Access Modal">
        <ModalInner>
          {hasOpenAccess ? openAccess() : restricted()}
          {description && (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div tabIndex="0">
              <Translate
                component={FontAwesomeIcon}
                icon={faInfoCircle}
                attributes={{ title: 'dataset.additionalInformation' }}
              />
              <AccessLabel lang={getPreferredLang(description)}>
                {getValueTranslation(description)}
              </AccessLabel>
            </div>
          )}
          {url && (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div tabIndex="0">
              <FontAwesomeIcon icon={faGlobe} title="Access to data" />
              <AccessUrl
                href={url.identifier}
                title={url.identifier}
                lang={getPreferredLang(url.title)}
              >
                {getValueTranslation(url.title)}
              </AccessUrl>
            </div>
          )}
          {restrictionGrounds &&
            restrictionGrounds.map(() => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <div tabIndex="0">
                <Translate
                  component={FontAwesomeIcon}
                  icon={faInfoCircle}
                  attributes={{ title: 'dataset.additionalInformation' }}
                />
                <AccessLabel lang={getPreferredLang(description)}>
                  {getValueTranslation(description)}
                </AccessLabel>
              </div>
            ))}
          {url && (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div tabIndex="0">
              <FontAwesomeIcon icon={faGlobe} title="Access to data" />
              <AccessUrl href={identifier} title={identifier} lang={getPreferredLang(url.title)}>
                {getValueTranslation(url.title)}
              </AccessUrl>
            </div>
          )}
          {restrictionGrounds &&
            restrictionGrounds.map(rg => (
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

AccessRights.defaultProps = {
  button: false,
}

AccessRights.propTypes = {
  button: PropTypes.bool,
  Stores: PropTypes.object.isRequired,
}

export default observer(AccessRights)
export const undecorated = AccessRights

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
