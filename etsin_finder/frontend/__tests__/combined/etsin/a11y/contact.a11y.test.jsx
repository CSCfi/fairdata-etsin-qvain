import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import dataset from '../../../__testdata__/dataset.att'
import Contact from '../../../../js/components/dataset/contact'
import Modal from '../../../../js/components/general/modal'

const emailInfo = {
  CONTRIBUTOR: true,
  CREATOR: true,
  CURATOR: true,
  PUBLISHER: true,
  RIGHTS_HOLDER: true,
}

describe('Etsin contact modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    wrapper = mount(
      <ThemeProvider theme={etsinTheme}>
        <main>
          <Contact datasetID={dataset.identifier} emails={emailInfo} isRems={true} />
        </main>
      </ThemeProvider>,
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
