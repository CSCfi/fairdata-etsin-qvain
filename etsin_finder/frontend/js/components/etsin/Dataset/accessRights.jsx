import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import styled from 'styled-components'

import Modal from '@/components/general/modal'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { useStores } from '@/utils/stores'
import Translate from '@/utils/Translate'
import Button from '../general/button'
import DatasetInfoItem from './DatasetInfoItem'
import withCustomProps from '@/utils/withCustomProps'

function AccessRights({ button = false, ...props }) {
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

  const applicationInstructions = getValueTranslation(
    accessRights.data_access_application_instructions
  )
  const terms = getValueTranslation(accessRights.data_access_terms)

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
      <CustomButton
        onClick={openModal}
        color="#e0e0e0"
        padding="0.2em 0.9em"
        noMargin
        button={button}
        {...props}
      >
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
            {typeDescription && <Translate component={AccessParagraph} content={typeDescription} />}

            {restrictionGrounds?.length > 0 && (
              <>
                <Translate component="strong" content="dataset.restriction_grounds" />
                {restrictionGrounds.map(restriction => (
                  <AccessParagraph
                    lang={getPreferredLang(restriction.pref_label)}
                    key={restriction.url}
                  >
                    {getValueTranslation(restriction.pref_label)}
                  </AccessParagraph>
                ))}
              </>
            )}

            {accessRights.description && (
              <>
                <Translate component="strong" content="dataset.access_rights_description.custom" />
                <AccessParagraph lang={getPreferredLang(accessRights.description)}>
                  {getValueTranslation(accessRights.description)}
                </AccessParagraph>
              </>
            )}

            {applicationInstructions && (
              <>
                <Translate component="strong" content="dataset.application_instructions" />
                <AccessParagraph lang={getPreferredLang(applicationInstructions)}>
                  {getValueTranslation(applicationInstructions)}
                </AccessParagraph>
              </>
            )}

            {terms && (
              <>
                <Translate component="strong" content="dataset.data_access_terms" />
                <AccessParagraph lang={getPreferredLang(terms)}>
                  {getValueTranslation(terms)}
                </AccessParagraph>
              </>
            )}
          </DatasetInfoItem>
        </ModalInner>
      </Modal>
    </>
  )
}

AccessRights.propTypes = {
  button: PropTypes.bool,
}

export default observer(AccessRights)
export const undecorated = AccessRights

const CustomButton = withCustomProps(styled(Button))`
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
