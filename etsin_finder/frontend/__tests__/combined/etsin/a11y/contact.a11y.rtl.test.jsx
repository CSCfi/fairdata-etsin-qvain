import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import Contact from '@/components/etsin/Dataset/contact'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const emailInfo = {
  CONTRIBUTOR: true,
  CREATOR: true,
  CURATOR: true,
  PUBLISHER: true,
  RIGHTS_HOLDER: true,
}

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

describe('Etsin contact modal', () => {
  let helper

  const renderModal = async () => {
    const stores = buildStores()
    registerMissingTranslationHandler(stores.Locale)
    stores.Etsin.EtsinDataset.set('dataset', dataset)
    stores.Etsin.EtsinDataset.set('emails', emailInfo)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    render(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <Contact datasetID={dataset.identifier} emails={emailInfo} isRems />
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
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible()
  })
})
