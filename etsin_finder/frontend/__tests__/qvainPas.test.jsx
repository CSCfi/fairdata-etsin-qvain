import React from 'react';
import { shallow, mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'

import '../locale/translations'

import etsinTheme from '../js/styles/theme'
import PasState from '../js/components/qvain/pasState'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import License from '../js/components/qvain/licenses/licenses'
import AccessType from '../js/components/qvain/licenses/accessType'
import Actors from '../js/components/qvain/actors'
import Files from '../js/components/qvain/files'
import FileForm from '../js/components/qvain/files/ida/forms/fileForm'
import DirectoryForm from '../js/components/qvain/files/ida/forms/directoryForm'
import IDAFilePicker from '../js/components/qvain/files/ida'
import {
  DeleteButton
} from '../js/components/qvain/general/buttons'
import {
  File,
  Directory,
  Project
} from '../js/stores/view/qvain.files.items'
import QvainStore, {
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor
} from '../js/stores/view/qvain'
import { Actor } from '../js/stores/view/qvain.actors'
import LocaleStore from '../js/stores/view/language'
import EnvStore from '../js/stores/domain/env'
import { AccessTypeURLs, DataCatalogIdentifiers, EntityType, Role, } from '../js/components/qvain/utils/constants'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true
})

const getStores = () => {
  QvainStore.resetQvainStore()
  QvainStore.setMetaxApiV2(true)
  return {
    Qvain: QvainStore,
    Locale: LocaleStore,
    Env: EnvStore
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
              und: 'LUONNONTIETEET'
            },
            parent_ids: [],
            child_ids: [
            ],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme'
          }
        }
      ]
    }
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
              und: 'Creative Commons Yleismaailmallinen (CC0 1.0) Public Domain -lausuma'
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [
              'https://creativecommons.org/publicdomain/zero/1.0/'
            ],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/license'
          }
        }
      ]
    }
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
              und: 'Embargo'
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [
              'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
            ],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type'
          }
        }
      ]
    }
  },
  '/es/reference_data/restriction_grounds/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0
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
              fi: 'Saatavuutta rajoitettu tietoja antaneen henkilön etuun tai suojaan perustuen tai esim. luovutussopimuksen perusteella',
              en: 'Restricted access based on the interest or protection of the person who provided the information or, for example, on the basis of extradite',
              sv: 'Begränsad åtkomst på grund av skydd av person',
              und: 'Saatavuutta rajoitettu tietoja antaneen henkilön etuun tai suojaan perustuen tai esim. luovutussopimuksen perusteella'
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds'
          }
        }
      ]
    }
  },
  '/es/organization_data/organization/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0
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
              sv: 'Aalto universitetet'
            },
            same_as: [
              'http://isni.org/isni/0000000108389418'
            ],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization'
          }
        }
      ]
    }
  },
  '/es/reference_data/file_type/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0
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
              und: 'Video'
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/file_type'
          }
        }
      ]
    },
  },
  '/es/reference_data/use_category/_search': {
    took: 0,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0
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
              und: 'Lähdeaineisto'
            },
            parent_ids: [],
            child_ids: [],
            has_children: false,
            same_as: [],
            internal_code: '',
            scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category'
          }
        }
      ]
    }
  }
}

jest.mock('axios')
axios.get.mockImplementation((url) => {
  const path = new URL(url).pathname
  if (!metaxResponses[path]) {
    console.error(`Error: no mock response for ${path}`)
  }
  return Promise.resolve({
    data: metaxResponses[path]
  })
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
  const render = stores => {
    stores.Qvain.setKeywordsArray(['key', 'word'])
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <PasState />
        </ThemeProvider>
      </Provider>
    )
  }

  it('shows pas state', () => {
    const stores = getStores()
    stores.Qvain.dataCatalog = DataCatalogIdentifiers.IDA
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(true)
    wrapper.unmount()

    stores.Qvain.dataCatalog = DataCatalogIdentifiers.PAS
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(false)
    expect(wrapper.find(PasState).text().includes('0:')).toBe(true)
  })
})


describe('Qvain.Description', () => {
  const render = stores => {
    stores.Qvain.setKeywordsArray(['key', 'word'])
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <DescriptionField />
            <OtherIdentifierField />
            <FieldOfScienceField />
            <KeywordsField />
          </>
        </ThemeProvider>
      </Provider>
    )
  }

  it('prevents editing of description fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
    wrapper.unmount()

    // Keyword delete buttons should not be rendered
    expect(wrapper.find('FontAwesomeIcon.delete-keyword').length).toBe(0)
  })

  it('allows editing of description fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(0)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(4)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    // Keyword delete buttons should be rendered
    expect(wrapper.find('FontAwesomeIcon.delete-keyword').length).toBe(2)
  })
})

describe('Qvain.RightsAndLicenses', () => {
  const render = stores => {
    stores.Qvain.setLicense(LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)', }, 'other'))
    stores.Qvain.setAccessType(AccessTypeConstructor(undefined, AccessTypeURLs.EMBARGO))
    return mount(
      <Provider Stores={stores}>
        <>
          <License />
          <AccessType />
        </>
      </Provider>
    )
  }

  it('prevents editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, license url, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(5)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of rights and license fields', () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(130)

    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    // Expect inputs: license, license url, access type, restriction grounds, embargo expires
    expect(inputs.length).toBe(5)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))
  })
})


describe('Qvain.Files', () => {
  const render = (stores, editDirectory) => {
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
      }
    })
    const testDirectory = Directory(
      {
        id: 'test2',
        identifier: 'test-ident-2',
        project_identifier: 'project_y',
        directory_name: 'directory2',
        directories: [],
        files: []
      },
      undefined,
      false,
      false
    )
    stores.Qvain.Files.selectedProject = 'project_y'
    stores.Qvain.Files.root = Project(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directories: [testDirectory],
        files: [
          testfile
        ]
      },
      undefined,
      false,
      true
    )
    let Form
    if (editDirectory) {
      stores.Qvain.Files.setInEdit(testDirectory)
      Form = DirectoryForm
    } else {
      stores.Qvain.Files.setInEdit(testfile)
      Form = FileForm
    }
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <Form />
        </ThemeProvider>
      </Provider>
    )
  }

  it('prevents editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')

    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })

  it('prevents editing of directory fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(2)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })


  it('allows editing of directory fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(100)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(2)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })
})
