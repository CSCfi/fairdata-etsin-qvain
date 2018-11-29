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
import Translate from 'react-translate-component'
import styled from 'styled-components'

import Agent from './agent'
import GetLang from '../../general/getLang'
import { LinkButton } from '../../general/button'

export default class Agents extends Component {
  constructor(props) {
    super(props)

    const mode = typeof props.creator === 'object' ? 'creator' : 'contributor'
    if (this.props[mode]) {
      this.state = {
        mode,
        firstThree: this.props[mode].slice(0, 3),
        rest: this.props[mode].slice(3),
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
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    return this.props[this.state.mode] ? (
      <AgentsCont>
        {this.props[this.state.mode].length > 1 ? (
          <Translate content={`dataset.${this.state.mode}.plrl`} />
        ) : (
          <Translate content={`dataset.${this.state.mode}.snglr`} />
        )}
        {': '}
        <InlineUl>
          {/* Show first three */}
          {this.state.firstThree.map((agent, i) => {
            if (agent.name) {
              return (
                <GetLang
                  content={agent.name}
                  render={data => <Agent key={data.translation} first={i === 0} agent={agent} />}
                />
              )
            }
            return ''
          })}
          {/* Show the rest */}
          {this.props[this.state.mode].length > 3 &&
            this.state.open &&
            this.state.rest.map(agent => {
              if (agent.name) {
                return (
                  <GetLang
                    content="agent.name"
                    render={data => <Agent lang={data.lang} key={data.translation} agent={agent} />}
                  />
                )
              }
              return ''
            })}
          {/* Show Button to open rest */}{' '}
          {this.props[this.state.mode].length > 3 && (
            <LinkButton onClick={this.toggleOpen}>
              [{' '}
              {this.state.open ? (
                <Translate content="general.showLess" />
              ) : (
                <Translate content="general.showMore" />
              )}{' '}
              ]
            </LinkButton>
          )}
        </InlineUl>
      </AgentsCont>
    ) : null
  }
}

Agents.defaultProps = {
  creator: undefined,
}

Agents.propTypes = {
  creator: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

const AgentsCont = styled.div`
  margin-bottom: 0;
`

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`
