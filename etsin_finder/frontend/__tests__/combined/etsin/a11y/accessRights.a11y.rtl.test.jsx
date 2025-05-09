import React from 'react'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import AccessRights from '@/components/etsin/Dataset/accessRights'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

jest.mock('@/stores/view/accessibility')
const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)
stores.Etsin.EtsinDataset.set('dataset', dataset)

describe('Etsin access rights modal', () => {
  let helper

  const renderModal = async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <AccessRights button />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )

    await userEvent.click(screen.getByRole('button'))
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('should be accessible', async () => {
    await renderModal()
    const dialog = screen.getByRole('dialog')
    const results = await axe(dialog)
    expect(results).toBeAccessible()
  })
})
