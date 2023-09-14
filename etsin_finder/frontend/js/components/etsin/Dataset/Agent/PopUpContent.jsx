/* eslint-disable camelcase */
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
import PropTypes from 'prop-types'
import translate from 'counterpart'
import styled from 'styled-components'
import { faGlobe, faUniversity, faUser } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import { Info, InfoItem, InfoLink } from './Info'
import { hasExtraInfo, flatParentOrgs, getOrgKey, getRefDataKey } from './utils'

const PopupContent = ({ agent }) => {
  const { organization, person, contributor_role, contributor_type, homepage } = agent
  const name = person?.name || organization.pref_label

  let orgs = flatParentOrgs(agent)
  if (!agent.person) {
    orgs = orgs.slice(0, -1)
  }

  return (
    <PopUpContainer>
      {name && <Name lang={getDataLang(name)}>{checkDataLang(name)}</Name>}
      {organization.url?.startsWith('http') && (
        // TODO: fix screenreader reading the link url when the popup is focused. It does not read the content.
        <IdentifierLink
          href={organization.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={translate('dataset.identifier')}
        >
          <IdentifierText>{organization.url}</IdentifierText>
        </IdentifierLink>
      )}
      {!organization.url?.startsWith('http') && <IdentifierText>{organization.url}</IdentifierText>}
      {hasExtraInfo(agent) && (
        <dl>
          {orgs?.length > 0 && (
            <Info icon={faUniversity} title={`dataset.agent.parent`}>
              {orgs.map(org => (
                <InfoItem content={org.pref_label} key={getOrgKey(org)} />
              ))}
            </Info>
          )}
          {contributor_role?.map(cr => (
            <Info icon={faUser} key={getRefDataKey(cr)} title="dataset.agent.contributor_role">
              <InfoItem content={cr.pref_label} />
            </Info>
          ))}
          {contributor_type?.map(ct => (
            <Info icon={faUser} key={getRefDataKey(ct)} title="dataset.agent.contributor_type">
              <InfoItem content={ct.pref_label} />
            </Info>
          ))}
          {homepage && (
            <Info icon={faGlobe} title="dataset.agent.homepage">
              <InfoLink document={homepage} />
            </Info>
          )}
        </dl>
      )}
    </PopUpContainer>
  )
}

PopupContent.propTypes = {
  agent: PropTypes.object.isRequired,
}

const PopUpContainer = styled.div`
  min-width: 13em;
`

const Name = styled.h4`
  margin-bottom: 0;
  font-size: 1.1em;
  color: ${p => p.theme.color.dark};
  line-height: 1;
`

const IdentifierLink = styled.a`
  font-size: 0.9em;
  word-break: break-word;
  color: ${p => p.theme.color.linkColorUIV2};
`

const IdentifierText = styled.div`
  font-size: 0.9em;
  margin-bottom: 0.5em;
`

export default observer(PopupContent)
