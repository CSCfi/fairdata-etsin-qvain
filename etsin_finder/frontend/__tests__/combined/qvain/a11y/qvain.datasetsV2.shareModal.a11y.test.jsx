import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ReactModal from 'react-modal'

import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import ShareModal from '@/components/qvain/views/datasetsV2/ShareModal'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

let stores

jest.setTimeout(15000) // the default 5000ms timeout is not always enough here

beforeEach(() => {
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
  stores.Env.Flags.setFlag('UI.SHARE_PROJECT', true)
  stores.QvainDatasetsV2.share.modal.open({ dataset: { identifier: 'xyz' } })
  stores.QvainDatasetsV2.share.client.abort()
})

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, datasets)

describe('ShareModal', () => {
  let wrapper, helper
  beforeEach(() => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <ShareModal />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  })

  afterEach(() => {
    document.body.removeChild(helper)
    wrapper?.unmount?.()
  })

  test('invite tab should be accessible', async () => {
    stores.QvainDatasetsV2.share.tabs.setActive('invite')
    wrapper.update()
    const results = await axe(helper)
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })

  test('members tab should be accessible', async () => {
    stores.QvainDatasetsV2.share.tabs.setActive('members')
    stores.QvainDatasetsV2.share.setUserPermissions([
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
    wrapper.update()
    const results = await axe(helper)
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
