import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from '../button'

// return either a NavLink (moving within app) or Link (moving between sites) based on link target.

const MaybeNavLink = ({ to, ...props }) => {
  if (to.includes('://')) {
    return <Link href={to} rel="noopener noreferrer" target="_blank" {...props} />
  }
  return <CustomNavLink to={to} {...props} />
}

MaybeNavLink.propTypes = {
  to: PropTypes.string.isRequired,
}

const CustomNavLink = Link.withComponent(NavLink)

export default MaybeNavLink
