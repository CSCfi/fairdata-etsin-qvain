import React, { useState } from 'react'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'
import { runInAction } from 'mobx'

import '../../../locale/translations'

import etsinTheme from '../../../js/styles/theme'
import PasState from '../../../js/components/qvain/views/editor/pasState'
import DescriptionField from '../../../js/components/qvain/fields/description/titleAndDescription'
import OtherIdentifierField from '../../../js/components/qvain/fields/description/otherIdentifier'
import FieldOfScienceField from '../../../js/components/qvain/fields/description/fieldOfScience'
import KeywordsField from '../../../js/components/qvain/fields/description/keywords'
import License from '../../../js/components/qvain/fields/licenses/licenses'
import AccessType from '../../../js/components/qvain/fields/licenses/accessType'
import Files from '../../../js/components/qvain/fields/files'
import FileForm from '../../../js/components/qvain/fields/files/legacy/fileForm'
import IDAFilePicker from '../../../js/components/qvain/fields/files/legacy/idaFilePicker'
import QvainStoreClass from '../../../js/stores/view/qvain'
import { Directory, File } from '../../../js/stores/view/qvain/qvain.filesv1'
import LocaleStore from '../../../js/stores/view/locale'
import EnvStore from '../../../js/stores/domain/env'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import { StoresProvider, useStores } from '../../../js/stores/stores'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

const QvainStore = new QvainStoreClass(EnvStore)

const getStores = () => {
  QvainStore.resetQvainStore()
  EnvStore.Flags.setFlag('METAX_API_V2', false)
  return {
    Qvain: QvainStore,
    Locale: LocaleStore,
    Env: EnvStore,
  }
}

// Mock Metax responses
const metaxResponses = {
  '/es/reference_data/field_of_science/_search': {
    hits: {
      hits: [
        {
          _index: 'reference_data',
          _type: 'field_of_science',
          _id: 'field_of_science_ta1',
          _score: 1.0,
          _source: {
            id: 'field_of_science_ta1',
            code: 'ta1',
            type: 'field_of_science',
            uri: 'http://www.yso.fi/onto/okm-tieteenala/ta1',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              sv: 'Naturvetenskaper',
              en: 'Natural sciences',
              fi: 'LUONNONTIETEET',
              und: 'LUONNONTIETEET',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme',
          },
        },
      ],
    },
  },
  '/es/reference_data/license/_search': {
    hits: {
      hits: [
        {
          _index: 'reference_data',
          _type: 'license',
          _id: 'license_CC0-1.0',
          _score: 1.0,
          _source: {
            id: 'license_CC0-1.0',
            code: 'CC0-1.0',
            type: 'license',
            uri: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC0-1.0',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              fi: 'Creative Commons Yleismaailmallinen (CC0 1.0) Public Domain -lausuma',
              en: 'Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
              und: 'Creative Commons Yleismaailmallinen (CC0 1.0) Public Domain -lausuma',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: ['https://creativecommons.org/publicdomain/zero/1.0/'],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/license',
          },
        },
      ],
    },
  },
  '/es/reference_data/access_type/_search': {
    hits: {
      total: 5,
      max_score: 1.0,
      hits: [
        {
          _index: 'reference_data',
          _type: 'access_type',
          _id: 'access_type_embargo',
          _score: 1.0,
          _source: {
            id: 'access_type_embargo',
            code: 'embargo',
            type: 'access_type',
            uri: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              fi: 'Embargo',
              en: 'Embargo',
              und: 'Embargo',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: ['http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
          },
        },
      ],
    },
  },
  '/es/reference_data/restriction_grounds/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 11,
      max_score: 1.0,
      hits: [
        {
          _index: 'reference_data',
          _type: 'restriction_grounds',
          _id: 'restriction_grounds_personal_interest',
          _score: 1.0,
          _source: {
            id: 'restriction_grounds_personal_interest',
            code: 'personal_interest',
            type: 'restriction_grounds',
            uri: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/personal_interest',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              fi:
                'Saatavuutta rajoitettu tietoja antaneen henkilön etuun tai suojaan perustuen tai esim. luovutussopimuksen perusteella',
              en:
                'Restricted access based on the interest or protection of the person who provided the information or, for example, on the basis of extradite',
              sv: 'Begränsad åtkomst på grund av skydd av person',
              und:
                'Saatavuutta rajoitettu tietoja antaneen henkilön etuun tai suojaan perustuen tai esim. luovutussopimuksen perusteella',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds',
          },
        },
      ],
    },
  },
  '/es/organization_data/organization/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 2439,
      max_score: 1.0,
      hits: [
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076',
          _score: 1.0,
          _source: {
            id: 'organization_10076',
            code: '10076',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
            org_csc: '2',
            parent_id: '',
            label: {
              fi: 'Aalto yliopisto',
              und: 'Aalto yliopisto',
              en: 'Aalto University',
              sv: 'Aalto universitetet',
            },
            same_as: ['http://isni.org/isni/0000000108389418'],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
      ],
    },
  },
  '/es/reference_data/file_type/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 9,
      max_score: 1.0,
      hits: [
        {
          _index: 'reference_data',
          _type: 'file_type',
          _id: 'file_type_video',
          _score: 1.0,
          _source: {
            id: 'file_type_video',
            code: 'video',
            type: 'file_type',
            uri: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/video',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              fi: 'Video',
              en: 'Video',
              und: 'Video',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/file_type',
          },
        },
      ],
    },
  },
  '/es/reference_data/use_category/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 7,
      max_score: 1.0,
      hits: [
        {
          _index: 'reference_data',
          _type: 'use_category',
          _id: 'use_category_source',
          _score: 1.0,
          _source: {
            id: 'use_category_source',
            code: 'source',
            type: 'use_category',
            uri: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/source',
            wkt: '',
            input_file_format: '',
            output_format_version: '',
            label: {
              fi: 'Lähdeaineisto',
              en: 'Source material',
              und: 'Lähdeaineisto',
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          },
        },
      ],
    },
  },
}

jest.mock('axios')
axios.get.mockImplementation(url => {
  const path = new URL(url).pathname
  if (!metaxResponses[path]) {
    console.error(`Error: no mock response for ${path}`)
  }
  return Promise.resolve({
    data: metaxResponses[path],
  })
})

jest.mock('../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

// Unmount mounted components after each test to avoid tests affecting each other.
let wrapper
afterEach(() => {
  if (wrapper && wrapper.unmount && wrapper.length === 1) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('Qvain.PasState', () => {
  const render = (dataCatalog, preservationState) => {
    const mockPasState = {
      Qvain: {
        dataCatalog,
        preservationState,
        isPas: true,
      },
    }

    useStores.mockReturnValue(mockPasState)

    return mount(
      <ThemeProvider theme={etsinTheme}>
        <PasState />
      </ThemeProvider>
    )
  }

  it('shows pas state', () => {
    wrapper = render(DATA_CATALOG_IDENTIFIER.IDA, 80)

    expect(wrapper.find(PasState).text().includes('80:')).toBe(true)
    wrapper.unmount()

    wrapper = render(DATA_CATALOG_IDENTIFIER.PAS, 0)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(false)
    expect(wrapper.find(PasState).text().includes('0:')).toBe(true)
  })
})

describe('Qvain.Description', () => {
  const render = preservationState => {
    const stores = getStores()
    stores.Qvain.Keywords.set(['key', 'word'])
    stores.Qvain.setPreservationState(preservationState)

    const mockState = {
      Qvain: stores.Qvain,
      Locale: stores.Locale,
      Env: stores.Env,
    }

    useStores.mockReturnValue(mockState)

    return mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <DescriptionField />
            <OtherIdentifierField />
            <FieldOfScienceField />
            <KeywordsField />
          </>
        </ThemeProvider>
      </StoresProvider>
    )
  }

  it('prevents editing of description fields', () => {
    wrapper = render(80)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
    wrapper.unmount()
  })

  it('allows editing of description fields', () => {
    wrapper = render(0)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))
  })
})

describe('Qvain.RightsAndLicenses', () => {
  const render = stores => {
    stores.Qvain.Licenses.set([
      stores.Qvain.Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'other'),
    ])
    stores.Qvain.AccessType.set(
      stores.Qvain.AccessType.Model({ en: 'Embargo' }, ACCESS_TYPE_URL.EMBARGO)
    )
    return mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <License />
            <AccessType />
          </>
        </ThemeProvider>
      </StoresProvider>
    )
  }

  it('prevents editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(130)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))
  })
})

describe('Qvain.Files', () => {
  beforeEach(() => {
    useStores.mockReturnValue(getStores())
  })

  const render = stores => {
    const testfile = File({
      description: 'File',
      title: 'testfile',
      existing: false,
      file_name: 'test.pdf',
      file_path: '/test/test.pdf',
      identifier: 'test_file',
      project_identifier: 'project_y',
      file_characteristics: {
        file_format: 'text/csv',
        format_version: '',
        encoding: 'UTF-8',
        csv_has_header: true,
        csv_record_separator: 'LF',
        csv_quoting_char: '"',
      },
    })
    runInAction(() => {
      stores.Qvain.selectedProject = 'project_y'
      stores.Qvain.hierarchy = Directory(
        {
          id: 'test1',
          identifier: 'test-ident-1',
          project_identifier: 'project_y',
          directory_name: 'root',
          directories: [
            Directory(
              {
                id: 'test2',
                identifier: 'test-ident-2',
                project_identifier: 'project_y',
                directory_name: 'directory2',
                directories: [],
                files: [],
              },
              undefined,
              false,
              false
            ),
          ],
          files: [testfile],
        },
        undefined,
        false,
        true
      )
    })
    stores.Qvain.setInEdit(testfile)
    return mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <FileForm />
        </ThemeProvider>
      </StoresProvider>
    )
  }

  it('prevents editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))
  })

  it('should not render file picker for PAS datasets', () => {
    const store = getStores()
    store.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    store.Qvain.setPreservationState(0)
    store.Qvain.idaPickerOpen = true
    wrapper = shallow(<Files Stores={store} />)
    expect(wrapper.dive().find(IDAFilePicker).length).toBe(1)
    wrapper.unmount()

    store.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)
    store.Qvain.setPreservationState(80)
    wrapper = shallow(<Files Stores={store} />)
    expect(wrapper.dive().find(IDAFilePicker).length).toBe(0)
    wrapper.unmount()

    store.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.PAS)
    store.Qvain.setPreservationState(0)
    wrapper = shallow(<Files Stores={store} />)
    expect(wrapper.dive().find(IDAFilePicker).length).toBe(0)
  })
})
