import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { hasChildren } from '@/utils/helpers'

const SidebarArea = ({ children }) => hasChildren(children) && <Area>{children}</Area>

export default SidebarArea

SidebarArea.propTypes = {
  children: PropTypes.node,
}

SidebarArea.defaultProps = {
  children: undefined,
}

const Area = styled.dl`
  background-color: ${p => p.theme.color.bgGreen};
  padding-bottom: 1.25em;
`
