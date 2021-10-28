import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'

import '../../../locale/translations'
import etsinTheme from '@/styles/theme'
import Pagination from '@/components/search/pagination'
import { useStores } from '@/stores/stores'

jest.mock('@/stores/stores')

const stores = {
  ElasticQuery: {
    updatePageNum: jest.fn(),
    queryES: jest.fn(),
  },
  Accessibility: {
    announce: jest.fn(),
    resetFocus: jest.fn(),
  },
}

describe('Pagination', () => {
  let wrapper

  const render = ({ totalResults = 500, perPage = 5, currentPage = 50 } = {}) => {
    jest.resetAllMocks()
    useStores.mockReturnValue(stores)
    wrapper?.unmount()
    wrapper = mount(
      <ThemeProvider theme={etsinTheme}>
        <Pagination totalResults={totalResults} perPage={perPage} currentPage={currentPage} />
      </ThemeProvider>
    )
  }

  it('should show pagination', () => {
    render()
    wrapper
      .find('li')
      .map(v => v.text())
      .should.eql(['<', '1', '...', '48', '49', '50', '51', '52', '...', '100', '>'])
  })

  it('should use 1 as minimum current page', () => {
    render({ currentPage: -12345 })
    wrapper.find('button[aria-label="Current page 1"]').should.have.lengthOf(1)
  })

  it('should use last page as maximum current page', () => {
    render({ currentPage: 12345 })
    wrapper.find('button[aria-label="Current page 100"]').should.have.lengthOf(1)
  })

  it('should hide pagination for single page', () => {
    render({ totalResults: 5 })
    wrapper.find(Pagination).children().should.have.lengthOf(0)
  })

  it('should have aria-labels', () => {
    render()
    wrapper
      .find('button[aria-label]')
      .map(v => v.prop('aria-label'))
      .should.eql([
        'Previous page',
        'Page 1',
        'Skipped pages indicator',
        'Page 48',
        'Page 49',
        'Current page 50',
        'Page 51',
        'Page 52',
        'Skipped pages indicator',
        'Page 100',
        'Next page',
      ])
  })

  it('should change page', () => {
    render()
    wrapper.find('button[aria-label="Page 49"]').simulate('click')
    expect(stores.ElasticQuery.updatePageNum).toHaveBeenCalledWith(49)
    expect(stores.ElasticQuery.queryES).toHaveBeenCalled()
    expect(stores.Accessibility.announce).toHaveBeenCalledWith('Page 49')
    expect(stores.Accessibility.resetFocus).toHaveBeenCalled()
  })

  it('should be accessible', async () => {
    render()
    const results = await axe(wrapper.html())
    expect(results).toBeAccessible()
  })
})
