import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { syncHistoryWithStore } from 'mobx-react-router'

import FilterItem from '../../../js/components/search/filterResults/filterItem'
import ElasticQuery from '../../../js/stores/view/elasticquery'
import env from '../../../js/stores/domain/env'

// Syncing history with store
const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, env.history)

describe('FilterItem', () => {
  ElasticQuery.updateSearch('Helsinki')
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
          tabIndex="1"
        />
      </MemoryRouter>
    )
    it('should contain button', () => {
      expect(filterItem.children().children().children().children().type()).toEqual('button')
    })
    it('should contain key and doc_count', () => {
      expect(filterItem.text()).toEqual('Pirkko Suihkonen (92)')
    })
    it('should not be active', () => {
      expect(filterItem.children().children().children().children().props().className).toEqual(
        undefined
      )
    })
  })
  describe('Filter currently active', () => {
    ElasticQuery.updateFilter(facet.termName, facet.item.key)
    const filterItem = mount(
      <MemoryRouter>
        <FilterItem
          key={facet.item.key}
          item={facet.item}
          aggregationName={facet.aggregationName}
          term={facet.termName}
          tabIndex="1"
        />
      </MemoryRouter>
    )
    it('should be active', () => {
      expect(filterItem.children().children().children().children().props().className).toEqual(
        'active'
      )
    })
  })
})
