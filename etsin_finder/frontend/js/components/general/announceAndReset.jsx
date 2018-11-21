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
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

const AnnounceAndReset = (props) => (
  <div className="sr-only" title={props.Stores.Accessibility.navText} tabIndex="-1" ref={props.Stores.Accessibility.focusableElement} />
)

export default inject('Stores')(observer(AnnounceAndReset))

AnnounceAndReset.propTypes = {
  Stores: PropTypes.shape({
    Accessibility: PropTypes.shape({
      navText: PropTypes.string.isRequired,
      focusableElement: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
}
