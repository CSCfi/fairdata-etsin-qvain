import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import Unsupported from '@/components/qvain/views/DatasetEditorV2/Unsupported'
import theme from '@/styles/theme'
import { useStores } from '@/stores/stores'
import { buildStores } from '@/stores'

import '../../../locale/translations'
import maximalDataset from '../../__testdata__/qvain.maximalDataset'

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, '')

jest.mock('@/stores/stores')

beforeEach(() => {
  jest.resetAllMocks()
})

const render = async unsupported => {
  let Stores = buildStores()
  const Qvain = Stores.Qvain
  await Qvain.editDataset(maximalDataset)
  useStores.mockReturnValue({
    ...Stores,
    Qvain: {
      ...Qvain,
      unsupported: unsupported,
    },
  })

  return mount(
    <ThemeProvider theme={theme}>
      <Unsupported />
    </ThemeProvider>
  )
}

describe('Unsupported', () => {
  test('unsupported fields', async () => {
    const expectedFields = [
      ['field.subfield', 'value_of_subfield'],
      ['other_field.subfield', 'other_value'],
    ]
    const wrapper = await render(expectedFields)
    wrapper.find('button').simulate('click', {})
    const fields = wrapper
      .find('ul')
      .find('li')
      .map(v => v.text().split(': '))
    expect(fields).toEqual(expectedFields)
  })

  test('no unsupported fields', async () => {
    const expectedFields = []
    const wrapper = await render(expectedFields)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})

test('it should list unsupported fields in dataset', () => {
  const Stores = buildStores()
  const Qvain = Stores.Qvain
  Qvain.editDataset(maximalDataset)
  expect(Qvain.unsupported).toEqual([
    ['access_rights.access_url', ''],
    ['access_rights.access_url.description', ''],
    [
      'access_rights.access_url.description.en',
      'Description of the link. For example to be used as hover text.',
    ],
    ['access_rights.access_url.identifier', 'https://access.url.com/landing'],
    ['access_rights.access_url.title', ''],
    ['access_rights.access_url.title.en', 'A name given to the document'],
    ['access_rights.description', ''],
    ['access_rights.description.en', 'Free account of the rights'],
    ['contributor.0.contributor_role', ''],
    ['contributor.0.contributor_role.0', ''],
    [
      'contributor.0.contributor_role.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_role/code/funding_acquisition',
    ],
    ['contributor.0.member_of.telephone', ''],
    ['contributor.0.member_of.telephone.0', '+358501231235'],
    ['contributor.0.telephone', ''],
    ['contributor.0.telephone.0', '+358501231122'],
    ['contributor.1.contributor_type', ''],
    ['contributor.1.contributor_type.0', ''],
    [
      'contributor.1.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/ProjectLeader',
    ],
    ['contributor.1.member_of.telephone', ''],
    ['contributor.1.member_of.telephone.0', '+23423423'],
    ['contributor.1.telephone', ''],
    ['contributor.1.telephone.0', '+358501231133'],
    ['creator.0.contributor_role', ''],
    ['creator.0.contributor_role.0', ''],
    [
      'creator.0.contributor_role.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_role/code/conceptualization',
    ],
    ['curator.0.contributor_type', ''],
    ['curator.0.contributor_type.0', ''],
    [
      'curator.0.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Distributor',
    ],
    ['curator.0.contributor_type.1', ''],
    [
      'curator.0.contributor_type.1.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Sponsor',
    ],
    ['is_output_of.0.has_funding_agency.0.telephone', ''],
    ['is_output_of.0.has_funding_agency.0.telephone.0', '+358501232233'],
    ['is_output_of.0.source_organization.0.contributor_type', ''],
    ['is_output_of.0.source_organization.0.contributor_type.0', ''],
    [
      'is_output_of.0.source_organization.0.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/HostingInstitution',
    ],
    ['is_output_of.0.source_organization.0.telephone', ''],
    ['is_output_of.0.source_organization.0.telephone.0', '+358501231235'],
    ['modified', '2014-01-17T08:19:58Z'],
    [
      'other_identifier.0.local_identifier_type',
      'Local identifier type defines use of the identifier in given context',
    ],
    ['other_identifier.0.provider', ''],
    ['other_identifier.0.provider.@type', 'Organization'],
    ['other_identifier.0.provider.contributor_type', ''],
    ['other_identifier.0.provider.contributor_type.0', ''],
    [
      'other_identifier.0.provider.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/ContactPerson',
    ],
    ['other_identifier.0.provider.email', 'info@csc.fi'],
    [
      'other_identifier.0.provider.identifier',
      'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
    ],
    ['other_identifier.0.provider.name', ''],
    ['other_identifier.0.provider.name.en', 'Org in ref data'],
    ['other_identifier.0.provider.name.fi', 'Organisaatio'],
    ['other_identifier.0.provider.telephone', ''],
    ['other_identifier.0.provider.telephone.0', '+358501231235'],
    [
      'other_identifier.1.local_identifier_type',
      'Local identifier type defines use of the identifier in given context',
    ],
    ['other_identifier.1.provider', ''],
    ['other_identifier.1.provider.@type', 'Organization'],
    ['other_identifier.1.provider.contributor_type', ''],
    ['other_identifier.1.provider.contributor_type.0', ''],
    [
      'other_identifier.1.provider.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataCollector',
    ],
    ['other_identifier.1.provider.email', 'info@csc.fi'],
    [
      'other_identifier.1.provider.identifier',
      'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
    ],
    ['other_identifier.1.provider.name', ''],
    ['other_identifier.1.provider.name.en', 'Mysterious Organization'],
    ['other_identifier.1.provider.name.fi', 'Organisaatio'],
    ['other_identifier.1.provider.telephone', ''],
    ['other_identifier.1.provider.telephone.0', '+358501231235'],
    ['provenance.0.used_entity.0.description.sv', 'Beskrivning'],
    ['provenance.0.used_entity.0.title.sv', 'Titel'],
    ['provenance.0.variable', ''],
    ['provenance.0.variable.0', ''],
    ['provenance.0.variable.0.concept', ''],
    ['provenance.0.variable.0.concept.definition', ''],
    [
      'provenance.0.variable.0.concept.definition.en',
      'A statement or formal explanation of the meaning of a concept.',
    ],
    ['provenance.0.variable.0.concept.identifier', 'variableconceptidentifier'],
    ['provenance.0.variable.0.concept.in_scheme', 'http://uri.of.filetype.concept/scheme'],
    ['provenance.0.variable.0.concept.pref_label', ''],
    ['provenance.0.variable.0.concept.pref_label.en', 'pref label'],
    ['provenance.0.variable.0.description', ''],
    ['provenance.0.variable.0.description.en', 'Description'],
    ['provenance.0.variable.0.pref_label', ''],
    ['provenance.0.variable.0.pref_label.en', 'Preferred label'],
    ['provenance.0.variable.0.representation', 'http://uri.of.filetype.concept/scheme'],
    ['provenance.0.variable.0.universe', ''],
    ['provenance.0.variable.0.universe.definition', ''],
    [
      'provenance.0.variable.0.universe.definition.en',
      'A statement or formal explanation of the meaning of a concept.',
    ],
    ['provenance.0.variable.0.universe.identifier', 'universeconceptidentifier'],
    ['provenance.0.variable.0.universe.in_scheme', 'http://uri.of.filetype.concept/scheme'],
    ['provenance.0.variable.0.universe.pref_label', ''],
    ['provenance.0.variable.0.universe.pref_label.en', 'pref label'],
    ['provenance.0.was_associated_with.0.contributor_type', ''],
    ['provenance.0.was_associated_with.0.contributor_type.0', ''],
    [
      'provenance.0.was_associated_with.0.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataCurator',
    ],
    ['provenance.0.was_associated_with.0.telephone', ''],
    ['provenance.0.was_associated_with.0.telephone.0', '+358501231235'],
    ['provenance.1.preservation_event', ''],
    [
      'provenance.1.preservation_event.identifier',
      'http://uri.suomi.fi/codelist/fairdata/preservation_event/code/upd',
    ],
    ['publisher.contributor_type', ''],
    ['publisher.contributor_type.0', ''],
    [
      'publisher.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Distributor',
    ],
    ['publisher.homepage.identifier', 'http://www.publisher.fi/'],
    ['publisher.homepage.title', ''],
    ['publisher.homepage.title.en', 'Publisher website'],
    ['publisher.homepage.title.fi', 'Julkaisijan kotisivu'],
    ['publisher.is_part_of.homepage.identifier', 'http://www.publisher_parent.fi/'],
    ['publisher.is_part_of.homepage.title', ''],
    ['publisher.is_part_of.homepage.title.en', 'Publisher parent website'],
    ['publisher.is_part_of.homepage.title.fi', 'Julkaisijan yläorganisaation kotisivu'],
    ['publisher.is_part_of.telephone', ''],
    ['publisher.is_part_of.telephone.0', '+234234'],
    ['publisher.telephone', ''],
    ['publisher.telephone.0', '+358501231235'],
    ['rights_holder.0.contributor_type', ''],
    ['rights_holder.0.contributor_type.0', ''],
    [
      'rights_holder.0.contributor_type.0.identifier',
      'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataManager',
    ],
    ['rights_holder.0.telephone', ''],
    ['rights_holder.0.telephone.0', '+358501231235'],

    ['temporal.1.temporal_coverage', '2011-2030'],
    ['title.sw', 'Kichwa kwa kiswahili'],
    ['value', 0.111],
    ['version_info', '0.1.2'],
    ['version_notes', ''],
    ['version_notes.0', 'This version contains changes to x and y.'],
  ])
})
