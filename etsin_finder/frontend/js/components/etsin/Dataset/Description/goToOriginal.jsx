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
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import { Link } from '@/components/etsin/general/button'
import idnToLink from '@/utils/idnToLink'

export default function GoToOriginal({ idn }) {
  const link = idnToLink(idn)
  if (link) {
    return (
      <Link margin="0em 0em 0.7em 0em" width="100%" color="primary" href={link} title={link} target="_blank">
        <Translate content="dataset.go_to_original" />
      </Link>
    )
  }
  return null
}

GoToOriginal.propTypes = {
  idn: PropTypes.string.isRequired,
}
