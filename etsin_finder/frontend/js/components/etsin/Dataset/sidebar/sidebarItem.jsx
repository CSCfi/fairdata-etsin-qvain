import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { hasChildren } from '@/utils/helpers'

const SidebarItem = props => {
  if (!hasChildren(props.children)) {
    return null
  }
  return (
    <>
      {props.trans && (
        <DT className="heading4">
          <Translate content={props.trans} fallback={props.fallback} />
        </DT>
      )}
      <DD>{props.children}</DD>
    </>
  )
}

export default SidebarItem

SidebarItem.defaultProps = {
  fallback: undefined,
  children: undefined,
  trans: undefined,
}

SidebarItem.propTypes = {
  children: PropTypes.node,
  trans: PropTypes.string,
  fallback: PropTypes.string,
}

const DT = styled.dt`
  font-size: 1.12em;
  color: black;
  margin-bottom: 0;
  padding: 1rem 1.5rem 0.5rem;
`

const DD = styled.dd`
  color: black;
  padding: 0 1.5rem;

  a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`
