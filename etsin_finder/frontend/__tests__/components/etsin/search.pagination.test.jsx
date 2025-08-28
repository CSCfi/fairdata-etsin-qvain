import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { runInAction } from 'mobx'

import { buildStores } from '@/stores'
import etsinTheme from '@/styles/theme'
import Pagination from '@/components/etsin/Search/pagination'
import { StoresProvider } from '@/stores/stores'

describe('Pagination', () => {
  const stores = buildStores()

  const renderPagination = ({ totalResults = 500, perPage = 5, currentPage = 50 } = {}) => {
    jest.resetAllMocks()
    runInAction(() => {
      stores.Accessibility.announce = jest.fn()
      stores.Accessibility.resetFocus = jest.fn()

      stores.Etsin.Search.res = {
        count: totalResults,
      }
      stores.Etsin.Search.currentPage = currentPage
      stores.Etsin.Search.itemsPerPage = perPage
    })

    return render(
      <MemoryRouter initialEntries={['/datasets?page=50']}>
        <StoresProvider store={stores}>
          <ThemeProvider theme={etsinTheme}>
            <Pagination />
          </ThemeProvider>
        </StoresProvider>
      </MemoryRouter>
    )
  }

  it('should show pagination', () => {
    renderPagination()
    screen
      .getAllByRole('listitem')
      .map(v => v.textContent)
      .should.eql(['<', '1', '...', '48', '49', '50', '51', '52', '...', '100', '>'])
  })

  it('should use 1 as minimum current page', () => {
    renderPagination({ currentPage: -12345 })
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument()
    expect(screen.queryByLabelText('Current page 1')).not.toBeInTheDocument()
  })

  it('should use last page as maximum current page', () => {
    renderPagination({ currentPage: 12345 })
    expect(screen.getByLabelText('Page 100')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 97')).toBeInTheDocument()
    expect(screen.queryByLabelText('Current page 100')).not.toBeInTheDocument()
  })

  it('should hide pagination for single page', () => {
    const { container } = renderPagination({ totalResults: 5, currentPage: 1 })
    expect(container.children).toHaveLength(0)
  })

  it('should have aria-labels', () => {
    renderPagination()
    screen
      .getAllByRole('button')
      .map(v => v.getAttribute('aria-label'))
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

  it('should change page', async () => {
    renderPagination()
    await userEvent.click(screen.getByLabelText('Page 49'))
    expect(stores.Accessibility.announce).toHaveBeenCalledWith('Page 49')
    expect(stores.Accessibility.resetFocus).toHaveBeenCalled()
  })

  it('should be accessible', async () => {
    const { container } = renderPagination()
    const results = await axe(container)
    expect(results).toBeAccessible()
  })
})
