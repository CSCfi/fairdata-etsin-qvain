{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2021 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

import { useStores } from '@/stores/stores'

import getPages from './getPages'
import { useQuery } from '../utils'

const Pagination = () => {
  const {
    Accessibility,
    Etsin: {
      Search: { currentPage, pageCount },
    },
  } = useStores()
  const pages = getPages({
    pageCount,
    currentPage,
  })

  const query = useQuery()
  const history = useHistory()

  const changePage = (event, value) => {
    query.set('page', value)
    Accessibility.announce(translate('search.pagination.changepage', { value }))
    Accessibility.resetFocus()
    history.push(`/datasets?${query.toString()}`)
  }

  const getItemPage = item => {
    if (item.toString().startsWith('...')) {
      return undefined
    }
    if (item === '<') {
      return currentPage - 1
    }
    if (item === '>') {
      return currentPage + 1
    }
    return item
  }

  const getItemLabel = (item, currentStr) => {
    if (item === '...') {
      return 'search.pagination.skipped'
    }
    if (item === '<') {
      return 'search.pagination.prev'
    }
    if (item === '>') {
      return 'search.pagination.next'
    }

    return `search.pagination.${currentStr}page`
  }

  const getItemKey = (item, index) => {
    if (item === '...') {
      return `pagination-skip-${index}`
    }
    return `pagination-${item}`
  }

  const renderItem = (item, index) => {
    const currentStr = item === currentPage ? 'current' : ''
    const restStr = item === '...' ? 'pagination-rest' : ''
    const className = [currentStr, restStr].filter(v => v).join(' ')
    const page = getItemPage(item)
    const onClick = page && (e => changePage(e, page))

    return (
      <li key={getItemKey(item, index)}>
        <Translate
          component={PaginationButton}
          className={className}
          onClick={onClick}
          attributes={{ 'aria-label': getItemLabel(item, currentStr) }}
          with={{ page }}
        >
          {item}
        </Translate>
      </li>
    )
  }

  if (pages.length <= 1) {
    return null
  }

  return (
    <PaginationContainer className="col-lg-12" aria-labelledby="pagination-label">
      <Translate
        content="search.pagination.pagination"
        className="pagination-label sr-only"
        aria-hidden
        id="pagination-label"
      />
      <ul>{pages.map(renderItem)}</ul>
    </PaginationContainer>
  )
}

const PaginationItem = styled.span.attrs(() => ({
  size: '40px',
}))`
  cursor: pointer;
  display: block;
  text-align: center;
  margin: 0.2em 0.2em;
  background-color: ${props => props.theme.color.lightgray};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size};
  line-height: ${props => props.size};
  color: black;
  padding: 0;
  border: 0;
  &.current {
    cursor: initial;
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.pagination-rest {
    cursor: initial;
    background-color: transparent;
    width: ${props => props.size};
    height: ${props => props.size};
    border-radius: ${props => props.size};
    line-height: ${props => props.size};
  }
`

const PaginationButton = PaginationItem.withComponent('button')

const PaginationContainer = styled.nav`
  margin-top: 1em;
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  ul {
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
    flex-wrap: wrap;
  }
`

export default observer(Pagination)
