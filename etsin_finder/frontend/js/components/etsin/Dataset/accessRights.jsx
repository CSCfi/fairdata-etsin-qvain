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

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from '@/components/general/modal'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { useStores } from '@/utils/stores'
import Translate from '@/utils/Translate'
import Button from '../general/button'
import DatasetInfoItem from './DatasetInfoItem'

function AccessRights(props) {
  const {
    Etsin: {
      EtsinDataset: { accessRights },
    },
    Locale: { lang, getValueTranslation, getPreferredLang, dateFormat },
  } = useStores()

  const [isModalOpen, setModal] = useState(false)

  const url = accessRights?.access_type?.url || ACCESS_TYPE_URL.RESTRICTED
  const type = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === url) || 'none'
  const title = `dataset.access_rights_title.${type.toLowerCase()}`
  const typeDescription = `dataset.access_rights_description.${type.toLowerCase()}`
  const embargoDate = type === 'EMBARGO' ? accessRights?.available : undefined
  const restrictionGrounds = accessRights?.restriction_grounds

  const hasOpenAccess = url === ACCESS_TYPE_URL.OPEN

  const restricted = () => (
    <RestrictedButton>
      <div>
        <Translate component={AccessLabel} content={title} />
        {embargoDate && <Date>{dateFormat(embargoDate, { shortMonth: true })} </Date>}
      </div>
    </RestrictedButton>
  )

  const openAccess = () => <Translate component={AccessLabel} content={title} />

  const openModal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  return (
    <>
      <CustomButton onClick={openModal} color="#e0e0e0" padding="0.2em 0.9em" noMargin {...props}>
        <Inner lang={lang} title={title}>
          {hasOpenAccess ? openAccess() : restricted()}
        </Inner>
      </CustomButton>
      {/* POPUP modal */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Access Modal">
        <ModalInner>
          <DatasetInfoItem
            itemTitle={title}
            extra={
              embargoDate ? <Date>{dateFormat(embargoDate, { shortMonth: true })} </Date> : null
            }
          >
            {typeDescription && (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <div tabIndex="0">
                {<Translate component={AccessParagraph} content={typeDescription} />}
              </div>
            )}

            {restrictionGrounds?.length > 0 && (
              <>
                <Translate component="strong" content="dataset.restriction_grounds" />
                {restrictionGrounds.map(restriction => (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  <div tabIndex="0" key={restriction.url}>
                    <AccessParagraph
                      lang={getPreferredLang(restriction.pref_label)}
                      key={restriction.url}
                    >
                      {getValueTranslation(restriction.pref_label)}
                    </AccessParagraph>
                  </div>
                ))}
              </>
            )}

            {accessRights.description && (
              <>
                {
                  <Translate
                    component="strong"
                    content="dataset.access_rights_description.custom"
                  />
                }
                {
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  <div tabIndex="0">
                    <AccessParagraph lang={getPreferredLang(accessRights.description)}>
                      {getValueTranslation(accessRights.description)}
                    </AccessParagraph>
                  </div>
                }
              </>
            )}
          </DatasetInfoItem>
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
}

export default observer(AccessRights)
export const undecorated = AccessRights

const CustomButton = styled(Button)`
  margin: 0rem 0.5rem;
  border-radius: 1em;
  color: ${p => p.theme.color.dark};
`

const AccessLabel = styled.div`
display: inline:`

const AccessParagraph = styled.p``

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

const ModalInner = styled.dl`
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
