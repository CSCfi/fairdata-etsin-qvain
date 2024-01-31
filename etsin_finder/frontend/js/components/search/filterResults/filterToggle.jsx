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
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { InvertedButton } from '../../general/button'
import { useStores } from '@/stores/stores'

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
  background-color: ${props => props.theme.color.errorDark};
  color: white;
  height: 100%;
  display: inline-block;
  top: 0;
  left: 0;
  padding: 0.5em 1em;
  border-radius: 2px 0px 0px 2px;
  box-shadow: 0 0 0 2px ${props => props.theme.color.errorDark};
`
const Children = styled.span`
  display: inline-block;
  padding: 0.5em 1em;
`

const FilterToggle = props => {
  const { ElasticQuery } = useStores()
  return (
    <Filter>
      <FilterOpen {...props} noPadding>
        {ElasticQuery.filter.length > 0 && (
          <Amount>
            {ElasticQuery.filter.length}
            <span className="sr-only">
              <Translate content="search.filter.SRactive" />
            </span>
          </Amount>
        )}
        <Children>{props.children}</Children>
      </FilterOpen>
    </Filter>
  )
}

FilterToggle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FilterToggle
