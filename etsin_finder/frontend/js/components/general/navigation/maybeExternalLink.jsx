import styled from 'styled-components'
import { NavLink } from 'react-router'
import PropTypes from 'prop-types'
import { Link } from '../button'

// return either a NavLink (moving within app) or Link (moving between sites) based on link target.

const MaybeExternalLink = ({ to, ...props }) => {
  if (to.includes('://')) {
    return <Link href={to} rel="noopener noreferrer" target="_blank" {...props} />
  }
  return <CustomNavLink to={to} {...props} />
}

MaybeExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
}

const CustomNavLink = styled(Link).attrs({ as: NavLink })``

export default MaybeExternalLink
