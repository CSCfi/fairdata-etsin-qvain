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
import checkDataLang from '../../../utils/checkDataLang'
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
          {console.log(this.props[this.state.mode])}
          {/* Show first three */}
          {this.state.firstThree.map((agent, i) => (
            <Agent key={checkDataLang(agent.name)} first={i === 0} agent={agent} />
          ))}
          {/* Show the rest */}
          {this.props[this.state.mode].length > 3 &&
            this.state.open &&
            this.state.rest.map(agent => (
              <Agent key={checkDataLang(agent.name)} agent={agent} />
            ))}
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
