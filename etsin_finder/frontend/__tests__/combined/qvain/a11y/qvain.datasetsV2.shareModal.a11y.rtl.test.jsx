import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ReactModal from 'react-modal'
import { render, screen } from '@testing-library/react'

import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import etsinTheme from '@/styles/theme'
import datasets from '../../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import ShareModal from '@/components/qvain/views/datasetsV2/ShareModal'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

let stores

jest.setTimeout(15000) // the default 5000ms timeout is not always enough here
const registerMissingHandler = failTestsWhenTranslationIsMissing(stores)

beforeEach(() => {
  stores = buildStores()
  registerMissingHandler(stores.Locale)
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
  stores.Env.Flags.setFlag('UI.SHARE_PROJECT', true)
  stores.QvainDatasets.share.modal.open({ dataset: { identifier: 'xyz' } })
  stores.QvainDatasets.share.client.abort()
})

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, datasets)

describe('ShareModal', () => {
  let helper
  const renderModal = () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <ShareModal />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  test('invite tab should be accessible', async () => {
    stores.QvainDatasets.share.tabs.setActive('invite')
    renderModal()
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })

  test('members tab should be accessible', async () => {
    stores.QvainDatasets.share.tabs.setActive('members')
    stores.QvainDatasets.share.setUserPermissions([
      {
        uid: 'teppo',
        name: 'teppo testaaja',
        email: 'teppo@example.com',
        isProjectMember: true,
        role: 'owner',
      },
      {
        uid: 'other',
        name: 'Other Person',
        email: 'other@example.com',
        isProjectMember: false,
        role: 'editor',
      },
      {
        uid: 'longname',
        name: 'Longlong von Longlonglonglongname',
        email: 'long@example.com',
        isProjectMember: true,
      },
    ])
    renderModal()
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
