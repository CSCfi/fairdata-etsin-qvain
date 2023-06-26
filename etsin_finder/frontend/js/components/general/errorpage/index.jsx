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

import React, { useEffect } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import HeroBanner from '@/components/general/hero'
import { useStores } from '@/stores/stores'

function Error({ translation }) {
  return (
    <section className="container text-center" aria-live="polite">
      <Translate content={translation} component="h1" />
    </section>
  )
}

Error.propTypes = {
  translation: PropTypes.string,
}

Error.defaultProps = {
  translation: 'error.undefined',
}

function ErrorPage({ errors, loginRequired }) {
  const {
    Accessibility: { handleNavigation },
  } = useStores()

  useEffect(() => {
    if (loginRequired) {
      handleNavigation('loginRequired')
    } else {
      handleNavigation('error')
    }
  }, [handleNavigation, loginRequired])

  if (!errors?.length) return null

  return (
    <HeroBanner className="hero-primary hero.full">
      {errors.map(error => (
        <Error key={error.translation} translation={error.translation} />
      ))}
    </HeroBanner>
  )
}

ErrorPage.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  loginRequired: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

ErrorPage.defaultProps = {
  errors: null,
  loginRequired: false,
}

export default withRouter(ErrorPage)
