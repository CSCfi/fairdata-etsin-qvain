import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Agent from '@/components/etsin/Dataset/Agent'

const stores = buildStores()

const personAgent = {
  person: {
    name: 'Mauno Majava',
    url: 'maunon_identifieri',
    homepage: {
      url: 'https://www.example.com',
      description: { fi: 'Näillä sivuilla on kaikenlaista.' },
      title: { fi: 'Maailman parhaat kotskasivut' },
    },
    organization: {
      pref_label: { en: 'Organization subsub' },
      parent: {
        pref_label: { en: 'Organization sub' },
        parent: { pref_label: { en: 'Organization' } },
      },
    },
  },
}

const orgAgent = {
  person: {
    name: { en: 'Some organization' },
    homepage: {
      url: 'https://www.example.com',
      description: { fi: 'Näillä sivuilla on kaikenlaista.' },
      title: { fi: 'Maailman parhaat kotskasivut' },
    },
  },
  organization: {
    pref_label: { en: 'Organization subsub' },
    url: 'https://orcid.org/jotain',
    parent: {
      pref_label: { en: 'Organization sub' },
      parent: { pref_label: { en: 'Organization' } },
    },
  },
}

const render = agent => {
  return mount(
    <ThemeProvider theme={etsinTheme}>
      <StoresProvider store={stores}>
        <Agent agent={agent} />
      </StoresProvider>
    </ThemeProvider>
  )
}

const getEntries = wrapper =>
  wrapper.find('dt').map(dt => {
    return {
      key: dt.prop('aria-label'),
      value: dt
        .closest('div')
        .find('dd')
        .leafHostNodes()
        .map(v => v.text()),
    }
  })

describe('Agent', () => {
  describe('Person', () => {
    let wrapper
    beforeEach(() => {
      wrapper = render(personAgent)
    })

    it('should render person pref_label', () => {
      wrapper.find('a[children="Mauno Majava"]').hostNodes().should.have.lengthOf(1)
    })

    it('should render person tooltip', () => {
      wrapper.find('a[children="Mauno Majava"]').hostNodes().simulate('click')
      wrapper.findByRole('tooltip').findByRole('heading').text().should.eql('Mauno Majava')
    })
  })

  describe('Organization', () => {
    let wrapper
    beforeEach(() => {
      wrapper = render(orgAgent)
    })

    it('should render organization pref_label', () => {
      wrapper.find(`a[children="Some organization"]`).hostNodes().should.have.lengthOf(1)
    })

    it('should render organization tooltip', () => {
      wrapper.find(`a[children="Some organization"]`).hostNodes().simulate('click')
      wrapper
        .findByRole('tooltip')
        .hostNodes()
        .findByRole('heading')
        .text()
        .should.eql('Some organization')

      wrapper.find('a[href="https://orcid.org/jotain"]').should.have.lengthOf(1)

      const entries = getEntries(wrapper.findByRole('tooltip').find('dl'))
      entries.should.eql([
        { key: 'Is part of', value: ['Organization', 'Organization sub', 'Organization subsub'] },
      ])
    })
  })
})
