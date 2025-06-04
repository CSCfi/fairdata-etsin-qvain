
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { LinkButton } from '@/components/etsin/general/button'

import Agent from '../Agent'
import { useStores } from '@/stores/stores'
import { useState } from 'react'

const TogglableAgentList = props => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()
  const [open, setOpen] = useState(false)

  const agents = props.agents
  const agentType = props.agentType
  let firstThree, rest
  if (agents) {
    firstThree = agents.slice(0, 3)
    rest = agents.slice(3)
  }

  const toggleOpen = () => {
    setOpen(!open)
  }

  if (!agents?.length) return null

  return (
    <AgentsCont>
      {agents.length > 1 ? (
        <Translate content={`dataset.${agentType}.plrl`} />
      ) : (
        <Translate content={`dataset.${agentType}.snglr`} />
      )}
      {': '}
      <InlineUl>
        {/* Show first three */}
        {firstThree.map((agent, i) => {
          if (agent.person?.name || agent.organization.pref_label) {
            return (
              <Agent
                inline
                lang={getPreferredLang(agent.person?.name || agent.organization.pref_label)}
                key={getValueTranslation(agent.person?.name || agent.organization.pref_label)}
                first={i === 0}
                agent={agent}
              />
            )
          }
          return ''
        })}
        {/* Show the rest */}
        {agents.length > 3 &&
          open &&
          rest.map(agent => {
            if (agent.person?.name || agent.organization.pref_label) {
              return (
                <Agent
                  inline
                  lang={getPreferredLang(agent.person?.name || agent.organization.pref_label)}
                  key={getValueTranslation(agent.person?.name || agent.organization.pref_label)}
                  agent={agent}
                />
              )
            }
            return ''
          })}
        {/* Show Button to open rest */}{' '}
        {agents.length > 3 && (
          <AgentListLinkButton onClick={toggleOpen}>
            {open ? (
              <Translate content="general.showLess" />
            ) : (
              <Translate content="general.showMore" />
            )}
          </AgentListLinkButton>
        )}
      </InlineUl>
    </AgentsCont>
  )
}

TogglableAgentList.defaultProps = {
  agents: undefined,
  agentType: undefined,
}

TogglableAgentList.propTypes = {
  agents: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  agentType: PropTypes.string,
}

const AgentsCont = styled.div`
  margin-bottom: 0;
`

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`

const AgentListLinkButton = styled(LinkButton)`
  color: ${p => p.theme.color.linkColorUIV2};
  text-decoration: underline;
`

export default TogglableAgentList
