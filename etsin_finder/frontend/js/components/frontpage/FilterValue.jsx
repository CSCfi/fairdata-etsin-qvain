import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

const FilterValue = ({ loaded, tooltip, label, value, to, onClick }) => {
  if (!loaded) {
    return (
      <Value>
        <H1Skeleton />
        <PSkeleton />
      </Value>
    )
  }

  return (
    <Value>
      <Translate component={FiltersLink} to={to} attributes={{ title: tooltip }} onClick={onClick}>
        <h1>{value}</h1>
        <Translate component="p" content={label} />
      </Translate>
    </Value>
  )
}

FilterValue.propTypes = {
  loaded: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func,
}

FilterValue.defaultProps = {
  onClick: undefined,
}

const H1Skeleton = styled.div`
  display: block;
  width: 4.2em;
  height: 28px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 7px;
  background-color: transparent;
  border-radius: 3px;
`

const PSkeleton = styled.div`
  display: block;
  width: 4.8em;
  height: 15px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 5px;
  background-color: transparent;
  border-radius: 3px;
`

export const ValueList = styled.ul`
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
`

const Value = styled.li`
  text-align: center;
  h1 {
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
  }
  &:nth-of-type(4) {
    display: none;
  }
  &:nth-of-type(3) {
    display: none;
  }
  @media (min-width: ${p => p.theme.breakpoints.sm}) {
    &:nth-of-type(4) {
      display: initial;
    }
  }
  @media (min-width: ${p => p.theme.breakpoints.xs}) {
    &:nth-of-type(3) {
      display: initial;
    }
  }
`

const FiltersLink = styled(Link)`
  font-size: 0.975em;
  &:active {
    transition: 0.1s ease;
    box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.7) inset;
  }
  &:hover {
    text-decoration: none;
    color: ${p => p.theme.color.primaryDark};
  }
`

export default observer(FilterValue)
