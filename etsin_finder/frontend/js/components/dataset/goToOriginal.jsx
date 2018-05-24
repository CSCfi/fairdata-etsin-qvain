import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import { Link } from '../general/button'
import idnToLink from '../../utils/idnToLink'

export default function GoToOriginal({ idn }) {
  const link = idnToLink(idn)
  if (link) {
    return (
      <Link margin="0em 0em 0.7em 0em" width="100%" color="primary" href={link} title={link}>
        <Translate content="dataset.go_to_original" />
      </Link>
    )
  }
  return null
}

GoToOriginal.propTypes = {
  idn: PropTypes.string.isRequired,
}
