import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import dataset from '../../../__testdata__/dataset.att'
import AccessRights from '../../../../js/components/dataset/accessRights'
import Modal from '../../../../js/components/general/modal'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

jest.mock('../../../../js/stores/view/accessibility')
const stores = buildStores()

describe('Etsin access rights modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <AccessRights button access_rights={dataset.research_dataset.access_rights} />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
    wrapper.find('button').simulate('click')
  })

  afterAll(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('should be open', async () => {
    expect(wrapper.find(Modal).prop('isOpen')).toBe(true)
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
