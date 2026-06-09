import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { useQuery, useEtsinSearchNavigate } from '@/components/etsin/general/useQuery'

import HeroBanner from '../../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import { useLocation } from 'react-router'

const Search = () => {
  const {
    Accessibility: { handleNavigation },
    Etsin: {
      Search: { submit },
    },
    Locale: { lang },
  } = useStores()

  const query = useQuery()
  const prevLang = useRef(lang)
  const navigateSearch = useEtsinSearchNavigate()

  useEffect(() => {
    handleNavigation('datasets')

    if (lang !== prevLang.current) {
      prevLang.current = lang
      navigateSearch(new URLSearchParams())
    }

    submit(query)
  }, [query, handleNavigation, submit, prevLang, lang, navigateSearch])

  return (
    <div>
      <SearchBarHeader />
      <SearchPage />
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
  const {
    Accessibility: { setPreviousLocation },
  } = useStores()

  const { pathname, search } = useLocation()

  // Save the state defined by the query so that it is preserved when
  // returning from the dataset view.
  //
  // location.pathname example: "/datasets" or "/" (LUMI-AIF portal),
  // location.search example: "?facet_access_type=Open&search=kat&page=1",
  useEffect(() => {
    // pathname is always at least "/datasets" or "/" and search is always 
    // defined (at minimum an empty string):
    setPreviousLocation(pathname + search)
  }, [setPreviousLocation, pathname, search])

  return (
    <div className="search-page" data-testid="search-page">
      <Results />
    </div>
  )
}

export default observer(Search)
