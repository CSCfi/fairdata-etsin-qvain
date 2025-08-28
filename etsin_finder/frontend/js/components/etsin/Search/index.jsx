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

import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { useNavigate } from 'react-router'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { useQuery } from '@/components/etsin/general/useQuery'

import HeroBanner from '../../general/hero'
import SearchBar from './searchBar'
import Results from './results'
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
  const navigate = useNavigate()

  useEffect(() => {
    handleNavigation('datasets')

    if (lang !== prevLang.current) {
      prevLang.current = lang
      navigate('/datasets')
    }

    submit(query)
  }, [query, handleNavigation, submit, prevLang, lang, navigate])

  return (
    <div>
      <SearchBarHeader />
      {isLoading ? <Spinner /> : <SearchPage />}
    </div>
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
