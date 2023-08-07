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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { TransparentLink } from '@/components/etsin/general/button'
import PopUp from '@/components/etsin/general/popup'
import PopUpContent from './PopUpContent'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import { useStores } from '@/stores/stores'
import { hasExtraInfo, flatParentOrgs } from './utils'

const Agent = ({ agent, first, inline, popupAlign }) => {
  const {
    Locale: { getValueTranslationWithLang, getValueTranslation },
  } = useStores()

  const [popUpOpen, setPopupOpen] = useState(false)
  const openPopUp = () => setPopupOpen(true)
  const closePopUp = () => setPopupOpen(false)

  const { name } = agent
  if (!name) {
    return ''
  }

  const shouldHavePopup = agent.identifier || hasExtraInfo(agent)

  const orgs = flatParentOrgs(agent)

  const [nameTranslation, lang] = getValueTranslationWithLang(name)
  let names
  if (agent.is_part_of) {
    names = [
      ...orgs.map(org => org.name).map(orgName => getValueTranslation(orgName)),
      nameTranslation,
    ]
  } else {
    names = [nameTranslation]
  }

  return (
    <AgentListItem inline={inline}>
      {first ? '' : ' & '}
      {!shouldHavePopup ? (
        <TextWithoutPopup lang={getDataLang(name)}>{checkDataLang(name)}</TextWithoutPopup>
      ) : (
        <PopUp
          isOpen={popUpOpen}
          onRequestClose={closePopUp}
          align={popupAlign}
          popUp={<PopUpContent agent={agent} />}
          role="tooltip"
        >
          <InlineTransparentLink
            noMargin
            noPadding
            href="#0"
            onClick={popUpOpen ? closePopUp : openPopUp}
            lang={lang}
          >
            {names.join(', ')}
          </InlineTransparentLink>
        </PopUp>
      )}
    </AgentListItem>
  )
}

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
`

Agent.defaultProps = {
  first: false,
  popupAlign: 'left',
  inline: false,
}

Agent.propTypes = {
  first: PropTypes.bool,
  inline: PropTypes.bool,
  agent: PropTypes.object.isRequired,
  popupAlign: PropTypes.oneOf(['left', 'left-fit-content', 'right', 'center', 'sidebar']),
}

const TextWithoutPopup = styled.span`
  color: ${p => p.theme.color.dark};
  display: inline;
`

const AgentListItem = styled.li`
  list-style: none;
  ${p => p.inline && 'display: inline;'}
`

export default observer(Agent)
