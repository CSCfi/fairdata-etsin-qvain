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

import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { ACCESS_TYPE_URL } from '@/utils/constants'
import { useStores } from '@/stores/stores'
import accessRights from './accessRights.base'

export const accessRightsBool = ar => ar?.access_type?.url === ACCESS_TYPE_URL.OPEN

function AccessRights(props) {
  const {
    Locale: { getValueTranslation, getPreferredLang, dateFormat, translate },
  } = useStores()

  const title = props.accessRights?.access_type?.pref_label || {
    en: 'Restricted Access',
    fi: 'Rajoitettu käyttöoikeus',
  }
  const url = props.accessRights?.access_type?.url || ''
  const id = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === url) || ''
  const description = translate(
    `dataset.access_rights_description.${id !== undefined ? id.toLowerCase() : ''}`
  )
  const embargoDate = props.accessRights?.available

  const restricted = () => (
    <>
      <RestrictedButton>
        <div>
          <AccessLabel lang={getPreferredLang(title)}>{getValueTranslation(title)}</AccessLabel>
          {embargoDate && <Date>{dateFormat(embargoDate, { shortMonth: true })} </Date>}
        </div>
      </RestrictedButton>
    </>
  )

  const openAccess = () => (
    <>
      <AccessLabel lang={getPreferredLang(title)}>{getValueTranslation(title)}</AccessLabel>
    </>
  )

  if (!accessRights) return null
  // display only main info on results list
  return (
    <Access {...props}>
      <Inner title={getValueTranslation(description)} lang={getPreferredLang(description)}>
        {accessRightsBool(accessRights) ? openAccess() : restricted()}
      </Inner>
    </Access>
  )
}

export default observer(AccessRights)
export const undecorated = AccessRights

const Access = styled.div`
  padding: 0.2em 0.9em;
  background-color: ${p => p.theme.color.lightgray};
  border-radius: 1em;
`

const AccessLabel = styled.div`
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

const Date = styled.span`
  font-size: 12px;
  display: block;
`

const RestrictedButton = styled.div`
  display: flex;
  align-items: center;
`

AccessRights.defaultProps = {}

AccessRights.propTypes = {
  accessRights: PropTypes.shape({
    access_type: PropTypes.shape({
      pref_label: PropTypes.shape({
        en: PropTypes.string,
        fi: PropTypes.string,
        und: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    available: PropTypes.bool.isRequired,
  }).isRequired,
}
