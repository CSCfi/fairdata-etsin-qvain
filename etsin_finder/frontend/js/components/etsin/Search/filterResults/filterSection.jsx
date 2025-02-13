import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mix } from 'polished'
import Translate from '@/utils/Translate'

import { TransparentLink } from '@/components/general/button'
import { useStores } from '@/stores/stores'

import FilterItem from './filterItem'
import { useQuery } from '@/components/etsin/general/useQuery'

const FilterSection = ({ filterName, onlyCurrentLanguage }) => {
  const {
    Etsin: {
      // isLoading will trigger update even though it is not strictly used here
      Search: { getAggregation, getAggregationQueryName, isLoading },
    },
    Locale: { getValueTranslation, lang },
  } = useStores()

  const query = useQuery()

  // sort activated items first
  const itemsSort = (a, b) => {
    const hasA = query.has(filter, getValueTranslation(a.value)) ? 1 : 0
    const hasB = query.has(filter, getValueTranslation(b.value)) ? 1 : 0
    if (hasB - hasA === 0) {
      // both activated or neither activated, sort descending
      return parseInt(b.count, 10) - parseInt(a.count, 10)
    }
    return hasB - hasA // sort activated first
  }

  const titleName = `search.aggregations.${filterName}.title`
  const filter = getAggregationQueryName(filterName)
  const items = getAggregation(filterName).slice().sort(itemsSort) || []
  let shownItems = items
  if (onlyCurrentLanguage) {
    shownItems = shownItems.filter(i => i.value[lang] || i.value.und)
  }
  const displayShowMoreButton = shownItems?.length > 10

  const [isOpen, setIsOpen] = useState(query.has(filter))
  const [showMoreItems, setShowMoreItems] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      const f = getAggregationQueryName(filterName)
      if (query.has(f)) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
  }, [setIsOpen, query, filterName, isLoading, getAggregationQueryName])

  const toggleSection = () => {
    setIsOpen(!isOpen)
  }

  if (displayShowMoreButton) {
    shownItems = showMoreItems ? shownItems : shownItems.slice(0, 9)
  }

  return (
    <Section>
      <Translate
        data-testid={`search-filter-${filterName}`}
        component={FilterCategory}
        onClick={toggleSection}
        aria-expanded={isOpen}
        content={`search.aggregations.${filterName}.title`}
      />
      <FilterItems className={isOpen ? 'open' : ''} aria-hidden={!isOpen}>
        <Translate component="ul" attributes={{ 'aria-label': titleName }}>
          {shownItems.map(item => (
            <FilterItem
              key={getValueTranslation(item.value)}
              filter={filter}
              item={item}
              tabIndex={isOpen ? '0' : '-1'}
            />
          ))}
        </Translate>
        {displayShowMoreButton && (
          <div>
            <hr />
            <ShowHide onClick={() => setShowMoreItems(!showMoreItems)}>
              <FontAwesomeIcon icon={showMoreItems ? faAngleDoubleUp : faAngleDoubleDown} />
              <ShowHideBtn>
                <Translate content={showMoreItems ? 'search.filter.hide' : 'search.filter.show'} />
              </ShowHideBtn>
            </ShowHide>
          </div>
        )}
      </FilterItems>
    </Section>
  )
}

FilterSection.propTypes = {
  filterName: PropTypes.string.isRequired,
  onlyCurrentLanguage: PropTypes.bool,
}

FilterSection.defaultProps = {
  // Enable to ignore items that don't have a translation in current language or "und" language
  onlyCurrentLanguage: false,
}

export default observer(FilterSection)

const ShowHide = styled.span`
  cursor: pointer;
`

const ShowHideBtn = styled(TransparentLink)`
  display: inline;
  margin-left: 8px;
`

export const Section = styled.li`
  margin-bottom: 4px;
`

// TODO: Better filter styles and animation
export const FilterCategory = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.theme.color.dark};
  border-radius: 0;
  width: 100%;
  text-align: left;
  border: 2px solid ${p => p.theme.color.lightgray};
  border-bottom: none;
  padding: 1em 1.5em;
  background-color: ${p => p.theme.color.lightgray};
  font-weight: 700;
  transition: all 0.3s ease;
  margin: 0;
  svg {
    pointer-events: none;
    height: 0.7em;
    display: flex;
    align-items: center;
  }
  &:focus,
  &:hover {
    background-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
    border-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
  }
  &:focus + .filter-items,
  &:hover + .filter-items {
    border-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
  }
`

export const FilterItems = styled.div`
  padding: 0em 1em;
  max-height: 0px;
  overflow: hidden;
  transition: all 0.3s ease;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
    li {
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      button:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      button.active {
        background: ${p => p.theme.color.primary};
        color: ${p => p.theme.color.white};
      }
    }
  }
  &.open {
    max-height: 100%;
    padding: 1em 1em;
    li {
      max-height: 140px;
    }
  }
  button {
    background: transparent;
    border: none;
    padding: 0.3em 0.8em;
    border-radius: 0.7em;
    margin: 0 0 5px 0;
    color: ${p => p.theme.color.dark};
    text-align: left;
    &:focus {
      color: ${p => p.theme.color.primary};
      text-decoration: underline;
    }
  }
`
