import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'
import { useQuery, useEtsinSearchNavigate } from '@/components/etsin/general/useQuery'

import { FilterCategory, FilterItems, Section } from './filterSection'

const quoteValue = value => {
  if (value.includes(',') && !value.startsWith('"')) {
    return `"${value}"`
  }
  return value
}

const DataCatalogFilterSection = () => {
  const {
    Etsin: {
      Search: { aggregations, isLoading, getAggregationQueryName },
    },
    Locale: { getValueTranslation },
  } = useStores()

  const query = useQuery()
  const navigateSearch = useEtsinSearchNavigate()

  const catalogFilter = getAggregationQueryName('data_catalog')
  const dataServiceFilter =
    getAggregationQueryName('data_service') || 'facet_data_service'
  const items = aggregations.data_catalog?.hits?.slice() || []

  const [isOpen, setIsOpen] = useState(query.has(catalogFilter) || query.has(dataServiceFilter))

  useEffect(() => {
    if (!isLoading) {
      if (query.has(catalogFilter) || query.has(dataServiceFilter)) {
        setIsOpen(true)
      }
    }
  }, [catalogFilter, dataServiceFilter, isLoading, query])

  const itemsSort = (a, b) => {
    const valueA = quoteValue(getValueTranslation(a.value))
    const valueB = quoteValue(getValueTranslation(b.value))
    const hasA = query.has(catalogFilter, valueA) ? 1 : 0
    const hasB = query.has(catalogFilter, valueB) ? 1 : 0
    if (hasB - hasA === 0) {
      return parseInt(b.count, 10) - parseInt(a.count, 10)
    }
    return hasB - hasA
  }

  const sortedItems = items.sort(itemsSort)

  const navigateToQuery = nextQuery => {
    navigateSearch(nextQuery)
  }

  const toggleCatalog = item => {
    const nextQuery = new URLSearchParams(query)
    const catalogValue = quoteValue(getValueTranslation(item.value))
    const isActive = nextQuery.has(catalogFilter, catalogValue)

    if (isActive) {
      nextQuery.delete(catalogFilter, catalogValue)
      item.data_service?.forEach(serviceItem => {
        const serviceValue = quoteValue(getValueTranslation(serviceItem.value))
        nextQuery.delete(dataServiceFilter, serviceValue)
      })
    } else {
      nextQuery.append(catalogFilter, catalogValue)
    }

    navigateToQuery(nextQuery)
  }

  const toggleDataService = item => {
    const nextQuery = new URLSearchParams(query)
    const serviceValue = quoteValue(getValueTranslation(item.value))
    const isActive = nextQuery.has(dataServiceFilter, serviceValue)

    if (isActive) {
      nextQuery.delete(dataServiceFilter, serviceValue)
    } else {
      nextQuery.append(dataServiceFilter, serviceValue)
    }

    navigateToQuery(nextQuery)
  }

  return (
    <Section data-testid="data_catalog-facet">
      <FilterCategory
        data-testid="search-filter-data_catalog"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Translate content="search.aggregations.data_catalog.title" />
        {isLoading && <SectionSpinner data-testid="data_catalog-loading-indicator" />}
      </FilterCategory>
      <FilterItems className={isOpen ? 'open' : ''} aria-hidden={!isOpen}>
        <Translate component="ul" attributes={{ 'aria-label': 'search.aggregations.data_catalog.title' }}>
          {sortedItems.map(item => {
            const catalogValue = quoteValue(getValueTranslation(item.value))
            const isCatalogActive = query.has(catalogFilter, catalogValue)
            return (
              <li key={catalogValue}>
                <button
                  role="switch"
                  type="button"
                  disabled={isLoading}
                  tabIndex={isOpen ? '0' : '-1'}
                  className={isCatalogActive ? 'active' : undefined}
                  aria-checked={isCatalogActive}
                  onClick={() => toggleCatalog(item)}
                >
                  {!!item.data_service?.length && (
                    <CatalogExpandIcon
                      icon={isCatalogActive ? faChevronDown : faChevronRight}
                      aria-hidden="true"
                    />
                  )}
                  {`${getValueTranslation(item.value)} (${item.count})`}
                </button>
                {isCatalogActive && item.data_service?.length > 0 && (
                  <DataServiceList aria-label={`${getValueTranslation(item.value)} data services`}>
                    {item.data_service.map(serviceItem => {
                      const serviceValue = quoteValue(getValueTranslation(serviceItem.value))
                      const isServiceActive = query.has(dataServiceFilter, serviceValue)
                      return (
                        <li key={`${catalogValue}-${serviceValue}`}>
                          <button
                            role="switch"
                            type="button"
                            disabled={isLoading}
                            tabIndex={isOpen ? '0' : '-1'}
                            className={isServiceActive ? 'active' : undefined}
                            aria-checked={isServiceActive}
                            onClick={() => toggleDataService(serviceItem)}
                          >
                            {`${getValueTranslation(serviceItem.value)} (${serviceItem.count})`}
                          </button>
                        </li>
                      )
                    })}
                  </DataServiceList>
                )}
              </li>
            )
          })}
        </Translate>
      </FilterItems>
    </Section>
  )
}

const DataServiceList = styled.ul`
  margin-left: 1.2em !important;
`

const CatalogExpandIcon = styled(FontAwesomeIcon)`
  margin-right: 0.35em;
  width: 0.7em;
  height: 0.7em;
`

const SectionSpinner = styled.span`
  width: 0.9em;
  height: 0.9em;
  border: 2px solid ${p => p.theme.color.dark};
  border-right-color: transparent;
  border-radius: 50%;
  animation: filter-spinner 0.8s linear infinite;
  @keyframes filter-spinner {
    to {
      transform: rotate(360deg);
    }
  }
`

export default observer(DataCatalogFilterSection)
