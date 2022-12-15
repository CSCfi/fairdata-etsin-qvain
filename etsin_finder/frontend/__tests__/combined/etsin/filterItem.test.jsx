import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import FilterItem from '../../../js/components/search/filterResults/filterItem'
import { buildStores } from '../../../js/stores'

const mockStores = buildStores()

// Syncing history with store
const browserHistory = createBrowserHistory()
mockStores.Env.history.syncWithHistory(browserHistory)

jest.mock('../../../js/stores/stores', () => ({
  withStores: Component => props => <Component Stores={mockStores} {...props} />,
}))

describe('FilterItem', () => {
  mockStores.ElasticQuery.updateSearch('Helsinki')

  const facet = {
    item: { key: 'Pirkko Suihkonen', doc_count: 92 },
    aggregationName: 'Creator',
    termName: 'creator_name.keyword',
    title: { en: 'Actor', fi: 'Toimija' },
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
          sectionTitleEn={facet.title.en}
        />
      </MemoryRouter>
    )

    it('should contain key and doc_count', () => {
      expect(filterItem.text()).toEqual('Pirkko Suihkonen (92)')
    })

    it('should have button that is not active', () => {
      const activeButton = filterItem.findWhere(
        elem => elem.props().type === 'button' && elem.props().className === undefined
      )

      expect(activeButton.exists()).toBe(true)
    })
  })

  describe('Filter currently active', () => {
    mockStores.ElasticQuery.updateFilter(facet.termName, facet.item.key)

    const filterItem = mount(
      <MemoryRouter>
        <FilterItem
          key={facet.item.key}
          item={facet.item}
          aggregationName={facet.aggregationName}
          term={facet.termName}
          tabIndex="1"
          sectionTitleEn={facet.title.en}
        />
      </MemoryRouter>
    )

    it('should be active', () => {
      const activeButton = filterItem.findWhere(
        elem => elem.props().type === 'button' && elem.props().className === 'active'
      )

      expect(activeButton.exists()).toBe(true)
    })
  })
})
