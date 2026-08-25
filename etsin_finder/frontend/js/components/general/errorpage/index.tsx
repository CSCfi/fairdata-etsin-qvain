import { useEffect } from 'react'
import PropTypes from 'prop-types'

import HeroBanner from '@/components/general/hero'
import { useStores } from '@/stores/stores'
import type { StringTranslationKey } from '@/stores/view/locale'

type ErrorProps = {
  translation: StringTranslationKey
}

function ErrorSection({ translation = 'error.undefined' }: Readonly<ErrorProps>) {
  const {
    Locale: { translate },
  } = useStores()
  return (
    <section className="container text-center" aria-live="polite">
      <h1>{translate(translation)}</h1>
    </section>
  )
}

type ErrorPageProps = {
  errors: ErrorProps[]
  loginRequired: boolean
}

function ErrorPage({ errors, loginRequired = false }: Readonly<ErrorPageProps>) {
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
        <ErrorSection key={error.translation} translation={error.translation} />
      ))}
    </HeroBanner>
  )
}

ErrorPage.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  loginRequired: PropTypes.bool,
}

ErrorPage.defaultProps = {
  errors: null,
  loginRequired: false,
}

export default ErrorPage
