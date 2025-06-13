import '@testing-library/jest-dom'
import { Provider } from 'mobx-react'
import { render, screen, cleanup } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import Identifiers from '@/components/etsin/Dataset/events/identifiers'
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
    // eslint-disable-next-line testing-library/no-debugging-utils
    if (debug) screen.debug()
    return rendered
  }

  it('renders an identifier', () => {
    renderIdentifierWithProps({
      title: 'foo',
      identifiers: ['bar'],
    })

    expect(screen.getByTestId('other-identifier-bar')).toHaveTextContent('bar')
  })

  it('renders an identifier as link', () => {
    const url = 'url:https://test.com'
    const doi = 'doi:bar'
    const reportronic = 'url:reportronic.fi/baz'
    const urn = 'urn:nbn:fi:https://hello.world.fi'

    renderIdentifierWithProps({
      title: 'foo',
      identifiers: [url, doi, reportronic, urn],
    })

    expect(screen.getByTestId(`other-identifier-link-${url}`)).toHaveTextContent(url)
    expect(screen.getByTestId(`other-identifier-link-${doi}`)).toHaveTextContent(doi)
    expect(screen.getByTestId(`other-identifier-link-${reportronic}`)).toHaveTextContent(
      reportronic
    )
    expect(screen.getByTestId(`other-identifier-link-${urn}`)).toHaveTextContent(urn)
  })
})
