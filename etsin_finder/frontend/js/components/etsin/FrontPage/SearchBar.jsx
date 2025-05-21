import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'
import useQuery from '@/components/etsin/general/useQuery'
import { Input } from '@/components/etsin/general/Input'

import { useStores, withStores } from '@/stores/stores'
import ErrorBoundary from '@/components/general/errorBoundary'

const SearchBar = () => {
  const {
    Matomo,
    Etsin: {
      Search: { setTerm, term },
    },
  } = useStores()

  const query = useQuery()
  const search = query.get('search')
  const history = useHistory()

  useEffect(() => {
    Matomo.recordEvent(`SEARCH / ${search}`)
    setTerm(search || '')
  }, [search, setTerm, Matomo])

  const handleSubmit = e => {
    e.preventDefault()
    query.set('search', term)
    query.set('page', 1)
    history.push(`/datasets?${query.toString()}`)
  }

  return (
    <ErrorBoundary>
      <form onSubmit={e => handleSubmit(e)} role="search">
        <SearchContainer>
          <SearchInner>
            <Translate
              component="label"
              content="search.name"
              htmlFor="searchBarInput"
              className="sr-only"
            />
            <IconContainer>
              <CustomFontAwesomeIcon
                onClick={handleSubmit}
                icon={faSearch}
                title="Search"
                transform="shrink-4"
              />
            </IconContainer>
            <Translate
              component={Input}
              id="searchBarInput"
              attributes={{ placeholder: 'search.placeholder' }}
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
          </SearchInner>
        </SearchContainer>
      </form>
    </ErrorBoundary>
  )
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
`

const IconContainer = styled.div`
  height: 100%;
  padding: 0.25rem;
  position: absolute;
  right: 0px;
  padding-bottom: 0.8em;
  display: flex;
  align-items: center;
`

const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 2.4rem;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
  transition: 0.1s ease;
  &:active {
    transform: scale(0.9);
  }
`

const SearchInner = styled.div`
  max-width: 800px;
  width: 100%;
  position: relative;
  display: flex;
  input {
    width: 100%;
    padding: 0.8em 1.5em;
    padding-right: 30px;
    border: 0;
    border-radius: 0.3em;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    color: ${props => props.theme.color.gray};
    font-size: 1em;
    letter-spacing: 1px;
    &::placeholder {
      color: ${props => props.theme.color.dark};
      font-style: italic;
    }
  }
`
export default withStores(observer(SearchBar))
