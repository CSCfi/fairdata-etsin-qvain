import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { mount } from 'enzyme'
import createHistory from 'history/createBrowserHistory'
import { MemoryRouter } from 'react-router-dom'

import FilterItem from '../js/components/search/filterResults/filterItem'
import ElasticQuery from '../js/stores/view/elasticquery'

const history = createHistory()

describe('FilterItem', () => {
  ElasticQuery.updateSearch('Helsinki', history)
  const facet = {
    item: { key: 'Pirkko Suihkonen', doc_count: 92 },
    aggregationName: 'Creator',
    termName: 'creator_name.keyword',
  }
  describe('Filter not active', () => {
    const filterItem = mount(
      <MemoryRouter>
        <FilterItem
          key={facet.item.key}
          item={facet.item}
          aggregationName={facet.aggregationName}
          term={facet.termName}
          history={history}
          tabIndex="1"
        />
      </MemoryRouter>
    )
    it('should contain button', () => {
      expect(
        filterItem
          .children()
          .children()
          .children()
          .children()
          .children()
          .children()
          .type()
      ).toEqual('button')
    })
    it('should contain key and doc_count', () => {
      expect(filterItem.text()).toEqual('Pirkko Suihkonen (92)')
    })
    it('should not be active', () => {
      expect(
        filterItem
          .children()
          .children()
          .children()
          .children()
          .children()
          .children()
          .props().className
      ).toEqual(undefined)
    })
  })
  describe('Filter currently active', () => {
    ElasticQuery.updateFilter(facet.termName, facet.item.key, history)
    const filterItem = mount(
      <MemoryRouter>
        <FilterItem
          key={facet.item.key}
          item={facet.item}
          aggregationName={facet.aggregationName}
          term={facet.termName}
          history={history}
          tabIndex="1"
        />
      </MemoryRouter>
    )
    it('should be active', () => {
      expect(
        filterItem
          .children()
          .children()
          .children()
          .children()
          .children()
          .children()
          .props().className
      ).toEqual('active')
    })
  })
})
