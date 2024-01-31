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

import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { useStores } from '@/stores/stores'

import HeroBanner from '../../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import { useQuery } from './utils'
import Spinner from '../general/spinner'

const Search = () => {
  const {
    Accessibility: { handleNavigation },
    Etsin: {
      Search: { submit, isLoading },
    },
    Locale: { lang },
  } = useStores()

  const query = useQuery()
  const prevLang = useRef(lang)
  const history = useHistory()

  useEffect(() => {
    handleNavigation('datasets')

    if (lang !== prevLang.current) {
      prevLang.current = lang
      history.push('/datasets')
    }

    submit(query)
  }, [query, handleNavigation, submit, prevLang, lang, history])

  return (
    <>
      <SearchBarHeader />
      {isLoading ? <Spinner /> : <SearchPage />}
    </>
  )
}

function SearchBarHeader() {
  return (
    <HeroBanner className="hero-primary">
      <div className="container">
        <section className="text-center">
          <Translate content="home.title" component="h1" />
          <SearchBar />
        </section>
      </div>
    </HeroBanner>
  )
}

function SearchPage() {
  return (
    <div className="search-page" data-testid="search-page">
      <Results />
    </div>
  )
}

export default observer(Search)
