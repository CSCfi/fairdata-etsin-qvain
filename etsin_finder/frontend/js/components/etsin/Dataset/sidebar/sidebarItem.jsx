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
      <DD lineAfter={props.lineAfter}>{props.children}</DD>
    </>
  )
}

export default SidebarItem

SidebarItem.defaultProps = {
  fallback: undefined,
  children: undefined,
  trans: undefined,
  lineAfter: false,
}

SidebarItem.propTypes = {
  children: PropTypes.node,
  trans: PropTypes.string,
  fallback: PropTypes.string,
  lineAfter: PropTypes.bool,
}

const DT = styled.dt`
  margin-bottom: 0;
  padding: 0 1.5rem;
`

const DD = styled.dd`
  margin-bottom: 1rem;
  padding: 0 1.5rem;
  ${p =>
    p.lineAfter &&
    `
    border-bottom: 1px solid ${p.theme.color.lightgray};
    padding-bottom: 1.25rem;
    margin-bottom: 1.25rem;
  `}
`
