import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe, toHaveNoViolations } from 'jest-axe'
import ReactModal from 'react-modal'

global.Promise = require('bluebird')

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import Info from '../../../../js/components/dataset/data/info'
import Modal from '../../../../js/components/general/modal'

jest.mock('../../../../js/stores/view/accessibility')
expect.extend(toHaveNoViolations)

const infoProps = {
  name: 'File',
  id: '1234xyz',
  title: 'I am a file',
  size: '1024 kB',
  category: 'Documentation',
  type: 'File type',
  open: true,
  closeModal: () => {},
  description: 'This is a file that contains something.',
  checksum: {
    algorithm: 'MD5',
    value: 'ef572f8aa76577941510698116759262',
  },
  accessUrl: { description: 'Access here', id: 'https://access.url' },
  downloadUrl: { description: 'Download here', id: 'https://download.url' },
  allowDownload: true,
  headerContent: 'dataset.dl.info',
}

describe('Etsin file info modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <Info {...infoProps} />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
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
    expect(results).toHaveNoViolations()
  })
})
