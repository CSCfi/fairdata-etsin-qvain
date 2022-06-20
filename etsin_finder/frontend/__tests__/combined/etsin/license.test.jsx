import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import translate from 'counterpart'

import '../../../locale/translations'
import etsinTheme from '@/styles/theme'
import License from '@/components/dataset/sidebar/special/license'
import { LICENSE_URL } from '../../../js/utils/constants'
import { buildStores } from '../../../js/stores'
import { StoresProvider } from '../../../js/stores/stores'

const otherLicense = {
  title: { en: 'Other' },
  identifier: LICENSE_URL.OTHER,
}

const licenseWithDescription = {
  title: { en: 'Some license' },
  description: { en: 'This is some license' },
  license: 'https://example.com/license_access_url',
  identifier: 'https://example.com/license',
}

const licenseWithoutDescription = {
  title: { en: 'Another license' },
  license: 'https://example.com/license_access_url',
  identifier: 'https://example.com/license',
}

describe('License', () => {
  let wrapper
  const render = licenseData => {
    const stores = buildStores()
    wrapper = mount(
      <ThemeProvider theme={etsinTheme}>
        <StoresProvider store={stores}>
          <License data={licenseData} />
        </StoresProvider>
      </ThemeProvider>
    )
  }

  const openPopUp = () => {
    const nodes = wrapper.find('[aria-haspopup="dialog"]').hostNodes()
    if (nodes.length === 0) {
      return false
    }
    nodes.simulate('click')
    return true
  }

  const getTexts = () => {
    return wrapper
      .leafHostNodes()
      .map(v => v.text())
      .filter(v => v)
  }

  const getPopUpTexts = () => {
    return wrapper
      .findByRole('dialog')
      .leafHostNodes()
      .map(v => v.text())
      .filter(v => v)
  }

  afterEach(() => {
    wrapper?.unmount?.()
  })

  it('shows info text for "Other" license', () => {
    render(otherLicense)
    getTexts().should.eql(['Other', 'Additional information'])
    wrapper.find('a').should.have.lengthOf(0)
    openPopUp().should.be.true
    getPopUpTexts().should.eql(['Other', translate('dataset.otherLicense')])
  })

  it('shows popup for license with description', () => {
    render(licenseWithDescription)
    getTexts().should.eql(['Some license', 'Additional information'])
    wrapper.find('a').prop('href').should.eql('https://example.com/license_access_url')
    openPopUp().should.be.true
    getPopUpTexts().should.eql([
      'Some license',
      'This is some license',
      'https://example.com/license_access_url',
    ])
  })

  it('does not show popup for license without description', () => {
    render(licenseWithoutDescription)
    getTexts().should.eql(['Another license'])
    wrapper.find('a').prop('href').should.eql('https://example.com/license_access_url')
    openPopUp().should.be.false
    getPopUpTexts().should.eql([])
  })
})
