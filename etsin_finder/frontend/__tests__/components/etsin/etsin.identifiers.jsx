import React from 'react'
import '@testing-library/jest-dom'
import { Provider } from 'mobx-react'
import { render, screen, cleanup } from '@testing-library/react'
import Identifiers from '@/components/etsin/Dataset/events/identifiers'
import { ThemeProvider } from 'styled-components'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '../../../js/stores/stores'
import { buildStores } from '../../../js/stores'

describe('Identifiers', () => {
  afterEach(cleanup)

  const renderIdentifierWithProps = (props, debug = false) => {
    const stores = buildStores()
    const rendered = render(
      <StoresProvider store={stores}>
        <Provider>
          <ThemeProvider theme={etsinTheme}>
            <Identifiers {...props} />
          </ThemeProvider>
        </Provider>
      </StoresProvider>
    )
    if (debug) screen.debug()
    return rendered
  }

  it('renders an identifier', () => {
    const { getByTestId, getByText } = renderIdentifierWithProps({
      title: 'foo',
      identifiers: ['bar'],
    })

    expect(getByTestId('other-identifier-bar')).toHaveTextContent('bar')
  })

  it('renders an identifier as link', () => {
    const url = 'url:https://test.com'
    const doi = 'doi:bar'
    const reportronic = 'url:reportronic.fi/baz'
    const urn = 'urn:nbn:fi:https://hello.world.fi'

    const { getByTestId, getByText } = renderIdentifierWithProps({
      title: 'foo',
      identifiers: [url, doi, reportronic, urn],
    })

    expect(getByTestId(`other-identifier-link-${url}`)).toHaveTextContent(url)
    expect(getByTestId(`other-identifier-link-${doi}`)).toHaveTextContent(doi)
    expect(getByTestId(`other-identifier-link-${reportronic}`)).toHaveTextContent(reportronic)
    expect(getByTestId(`other-identifier-link-${urn}`)).toHaveTextContent(urn)
  })
})
