import { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import etsinTheme from '@/styles/theme'
import { TransparentLink } from '@/components/etsin/general/button'
import PopUp from '@/components/etsin/general/popup'
import PopUpContent from './PopUpContent'
import { useStores } from '@/stores/stores'
import { hasExtraInfo, flatParentOrgs } from './utils'
import withCustomProps from '@/utils/withCustomProps'

const Agent = ({ agent, first, inline, popupAlign }) => {
  const {
    Locale: { getValueTranslationWithLang, getPreferredLang, getValueTranslation },
  } = useStores()

  const [popUpOpen, setPopupOpen] = useState(false)
  const openPopUp = () => setPopupOpen(true)
  const closePopUp = () => setPopupOpen(false)

  const name = agent.person?.name || agent.organization.pref_label

  if (!name) {
    return ''
  }

  const shouldHavePopup = hasExtraInfo(agent)

  const orgs = flatParentOrgs(agent)

  const [nameTranslation, lang] = getValueTranslationWithLang(name)
  let names
  if (agent.person) {
    names = [nameTranslation]
  } else {
    names = [...orgs.map(org => org.pref_label).map(orgName => getValueTranslation(orgName))]
  }

  return (
    <AgentListItem inline={inline}>
      {first ? '' : ' & '}
      {!shouldHavePopup ? (
        <TextWithoutPopup lang={getPreferredLang(name)}>
          {getValueTranslation(name)}
        </TextWithoutPopup>
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
  color: ${etsinTheme.color.linkColorUIV2};
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
  display: inline;
`

const AgentListItem = withCustomProps(styled.li)`
  list-style: none;
  ${p => p.inline && 'display: inline;'}
`

export default observer(Agent)
