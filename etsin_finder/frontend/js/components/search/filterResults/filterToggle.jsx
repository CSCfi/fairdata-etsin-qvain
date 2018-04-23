import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ElasticQuery from 'Stores/view/elasticquery'
import { InvertedButton } from '../../general/button'

const Filter = styled.div`
  float: left;
`

const FilterOpen = styled(InvertedButton)`
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
  align-self: center;
  position: relative;
  background: ${props => (props.active ? props.theme.color.primary : 'transparent')};
  color: ${props => (props.active ? 'white' : props.theme.color.primary)};
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5em;
    right: calc(50% - 0.5em);
    display: ${props => (props.active ? 'block' : 'none')};
    width: 0.5em;
    border-top: 0.5em solid ${props => props.theme.color.primary};
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
  }
`
const Amount = styled.span`
  background-color: ${props => props.theme.color.error};
  color: white;
  height: 100%;
  display: inline-block;
  top: 0;
  left: 0;
  padding: 0.5em 1em;
  border-radius: 2px 0px 0px 2px;
  box-shadow: 0 0 0 2px ${props => props.theme.color.error};
`
const Children = styled.span`
  display: inline-block;
  padding: 0.5em 1em;
`

export default class FilterToggle extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <Filter>
        <FilterOpen {...this.props} noPadding>
          {ElasticQuery.filter.length > 0 && (
            <Amount>
              {ElasticQuery.filter.length}
              <span className="sr-only"> active</span>
            </Amount>
          )}
          <Children>{this.props.children}</Children>
        </FilterOpen>
      </Filter>
    )
  }
}

FilterToggle.propTypes = {
  children: PropTypes.node.isRequired,
}
