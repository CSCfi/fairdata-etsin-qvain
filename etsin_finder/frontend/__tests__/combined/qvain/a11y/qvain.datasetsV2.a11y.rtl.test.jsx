import { when } from 'mobx'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { render } from '@testing-library/react'

import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import etsinTheme from '@/styles/theme'
import datasets from '../../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

let stores
const mockAdapter = new MockAdapter(axios)

jest.setTimeout(50000) // the default 5000ms timeout is not always enough here
const registerMissingHandler = failTestsWhenTranslationIsMissing()

beforeEach(() => {
  stores = buildStores()
  registerMissingHandler(stores.Locale)
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
})

mockAdapter.onGet().reply(200, datasets)

describe('DatasetsV2', () => {
  it('is accessible', async () => {
    const { container } = render(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <DatasetsV2 />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )

    // wait until datasets have been fetched
    await when(() => stores.QvainDatasets.datasetGroups.length > 0)

    const results = await axe(container, { rules: { region: { enabled: false } } })
    expect(results).toBeAccessible()
  })
})
