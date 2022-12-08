import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import QvainContent from '../../../../js/components/qvain/views/main/index'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import dataset from '../../../__testdata__/dataset.att'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

global.fdweRecordEvent = () => {}

jest.mock('axios')

axios.get.mockReturnValue(
  Promise.resolve({
    data: {
      hits: {
        hits: [],
      },
    },
  })
)

describe('Qvain editor', () => {
  let wrapper, helper

  beforeEach(async () => {
    await stores.Qvain.editDataset(dataset)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <QvainContent />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  })

  afterEach(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('is accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
