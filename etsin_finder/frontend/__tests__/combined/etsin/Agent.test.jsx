import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Agent from '@/components/dataset/Agent'

const stores = buildStores()

const personAgent = {
  name: 'Mauno Majava',
  identifier: 'maunon_identifieri',
  contributor_role: [{ pref_label: { en: 'First role' } }, { pref_label: { fi: 'Toinen rooli' } }],
  contributor_type: [{ pref_label: { en: 'contributor type label' } }],
  homepage: {
    identifier: 'https://www.example.com',
    description: { fi: 'Näillä sivuilla on kaikenlaista.' },
    title: { fi: 'Maailman parhaat kotskasivut' },
  },
  member_of: {
    name: { en: 'Organization subsub' },
    is_part_of: { name: { en: 'Organization sub' }, is_part_of: { name: { en: 'Organization' } } },
  },
}

const orgAgent = {
  name: { en: 'Some organization' },
  identifier: 'https://orcid.org/jotain',
  contributor_role: [{ pref_label: { en: 'First role' } }, { pref_label: { fi: 'Toinen rooli' } }],
  contributor_type: [{ pref_label: { en: 'contributor type label' } }],
  homepage: {
    identifier: 'https://www.example.com',
    description: { fi: 'Näillä sivuilla on kaikenlaista.' },
    title: { fi: 'Maailman parhaat kotskasivut' },
  },
  is_part_of: {
    name: { en: 'Organization subsub' },
    is_part_of: { name: { en: 'Organization sub' }, is_part_of: { name: { en: 'Organization' } } },
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

    it('should render person name', () => {
      wrapper.find('a[children="Mauno Majava"]').hostNodes().should.have.lengthOf(1)
    })

    it('should render person tooltip', () => {
      wrapper.find('a[children="Mauno Majava"]').hostNodes().simulate('click')
      wrapper.findByRole('tooltip').findByRole('heading').text().should.eql('Mauno Majava')

      wrapper.find('[children="maunon_identifieri"]').hostNodes().should.have.lengthOf(1)

      const entries = getEntries(wrapper.findByRole('tooltip').find('dl'))
      entries.should.eql([
        {
          key: 'Member of',
          value: ['Organization', 'Organization sub', 'Organization subsub'],
        },
        { key: 'Contributor role', value: ['First role'] },
        { key: 'Contributor role', value: ['Toinen rooli'] },
        { key: 'Contributor type', value: ['contributor type label'] },
        { key: 'Homepage', value: ['Maailman parhaat kotskasivut'] },
      ])
    })
  })

  describe('Organization', () => {
    let wrapper
    beforeEach(() => {
      wrapper = render(orgAgent)
    })

    const organizationFullName =
      'Organization, Organization sub, Organization subsub, Some organization'

    it('should render organization name', () => {
      wrapper.find(`a[children="${organizationFullName}"]`).hostNodes().should.have.lengthOf(1)
    })

    it('should render organization tooltip', () => {
      wrapper.find(`a[children="${organizationFullName}"]`).hostNodes().simulate('click')
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
        { key: 'Contributor role', value: ['First role'] },
        { key: 'Contributor role', value: ['Toinen rooli'] },
        { key: 'Contributor type', value: ['contributor type label'] },
        { key: 'Homepage', value: ['Maailman parhaat kotskasivut'] },
      ])
    })
  })
})
