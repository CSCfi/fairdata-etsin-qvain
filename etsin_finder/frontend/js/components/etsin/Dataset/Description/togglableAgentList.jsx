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
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { LinkButton } from '@/components/etsin/general/button'

import Agent from '../Agent'
import { withStores } from '@/stores/stores'

class TogglableAgentList extends Component {
  constructor(props) {
    super(props)

    const agents = props.agents
    const agentType = props.agentType
    if (agents) {
      this.state = {
        agentType,
        firstThree: agents.slice(0, 3),
        rest: agents.slice(3),
        open: false,
      }
    } else {
      this.state = {
        open: false,
      }
    }

    this.toggleOpen = this.toggleOpen.bind(this)
  }

  toggleOpen() {
    this.setState(state => ({
      open: !state.open,
    }))
  }

  render() {
    const {
      Locale: { getPreferredLang, getValueTranslation },
    } = this.props.Stores

    if (!this.props.agents?.length) return null
    return (
      <AgentsCont>
        {this.props.agents.length > 1 ? (
          <Translate content={`dataset.${this.state.agentType}.plrl`} />
        ) : (
          <Translate content={`dataset.${this.state.agentType}.snglr`} />
        )}
        {': '}
        <InlineUl>
          {/* Show first three */}
          {this.state.firstThree.map((agent, i) => {
            if (agent.person?.name || agent.organization.pref_label) {
              return (
                <Agent
                  inline
                  lang={getPreferredLang(
                    agent.person?.name || agent.organization.pref_label
                  )}
                  key={getValueTranslation(
                    agent.person?.name || agent.organization.pref_label
                  )}
                  first={i === 0}
                  agent={agent}
                />
              )
            }
            return ''
          })}
          {/* Show the rest */}
          {this.props.agents.length > 3 &&
            this.state.open &&
            this.state.rest.map(agent => {
              if (agent.person?.name || agent.organization.pref_label) {
                return (
                  <Agent
                    inline
                    lang={getPreferredLang(
                      agent.person?.name || agent.organization.pref_label
                    )}
                    key={getValueTranslation(
                      agent.person?.name || agent.organization.pref_label
                    )}
                    agent={agent}
                  />
                )
              }
              return ''
            })}
          {/* Show Button to open rest */}{' '}
          {this.props.agents.length > 3 && (
            <AgentListLinkButton onClick={this.toggleOpen}>
              {this.state.open ? (
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
}

TogglableAgentList.defaultProps = {
  agents: undefined,
  agentType: undefined,
}

TogglableAgentList.propTypes = {
  agents: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  agentType: PropTypes.string,
  Stores: PropTypes.object.isRequired,
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

export default withStores(TogglableAgentList)
