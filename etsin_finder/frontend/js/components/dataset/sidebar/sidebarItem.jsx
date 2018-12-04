import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { hasChildren } from '../../../utils/helpers'

const SidebarItem = props => {
  if (props.hideEmpty && !hasChildren(props.children)) {
    return null
  }
  return (
    <Spacer>
      {props.trans && (
        <DT className="heading4">
          <Translate content={props.trans} fallback={props.fallback} />
        </DT>
      )}
      {props.component ? (
        React.createElement(props.component, null, props.children)
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </Spacer>
  )
}

export default SidebarItem

SidebarItem.defaultProps = {
  component: '',
  hideEmpty: undefined,
  fallback: undefined,
  children: undefined,
  trans: undefined,
}

SidebarItem.propTypes = {
  component: PropTypes.string,
  hideEmpty: PropTypes.string,
  children: PropTypes.node,
  trans: PropTypes.string,
  fallback: PropTypes.string,
}

const DT = styled.dt`
  margin-bottom: 0;
`

const Spacer = styled.section`
  padding: 0 1.4em;
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    padding: 0 1.6em;
  }
  margin-bottom: 1rem;
  & > div {
    font-size: 0.92em;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`
