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
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SearchBar from '../search/searchBar'
import HeroBanner from '../general/hero'
import KeyValues from './keyValues'
import { useStores, withStores } from '../../stores/stores'

const FrontPage = () => {
  const {
    Accessibility,
    Matomo: { recordEvent },
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation('home')

    recordEvent('HOME')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="search-page">
      <HeroBanner className="hero-primary">
        <div className="container">
          <section className="text-center">
            <h1>
              <Translate content="home.title" />
            </h1>
            <SearchBar />
          </section>
        </div>
      </HeroBanner>
      <div className="container">
        <div className="regular-row">
          <TextHolder>
            <KeyValues />
            <article>
              <section>
                <Translate content="home.title1" component="h2" />
                <Translate content="home.para1" component="p" unsafe />
              </section>
              <section>
                <Translate content="home.title2" component="h2" />
                <Translate content="home.para2" component="p" unsafe />
              </section>
            </article>
          </TextHolder>
        </div>
      </div>
    </div>
  )
}

FrontPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

const TextHolder = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  p {
    white-space: pre-line;
  }
`
export default withStores(FrontPage)
