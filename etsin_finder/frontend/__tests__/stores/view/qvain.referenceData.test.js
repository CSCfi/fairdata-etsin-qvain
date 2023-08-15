import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { buildStores } from '@/stores'

const mockAdapter = new MockAdapter(axios)
const mockV2 = (url, search) => {
  // mock v2 reference data url
  mockAdapter.reset()
  const obj = {
    hits: {
      hits: [
        {
          _source: {
            _id: 1,
            uri: 'uri',
            label: {
              fi: 'fi_label',
              en: 'en_label',
            },
            parent_ids: [2, 3],
          },
        },
      ],
    },
  }

  if (search) {
    mockAdapter.onGet(url + `?size=100&q=*${search}*`).reply(200, obj)
  } else {
    mockAdapter.onGet(url + '?size=1000').reply(200, obj)
  }
}

const mockV3 = (url, search) => {
  // mock v3 reference data url
  mockAdapter.reset()
  const objs = [
    {
      id: 1,
      url: 'uri',
      pref_label: {
        fi: 'fi_label',
        en: 'en_label',
      },
      broader: [2, 3],
    },
  ]
  if (search) {
    mockAdapter
      .onGet(url + `?pagination=true&limit=100&pref_label=${search}`)
      .reply(200, { results: objs })
  } else {
    mockAdapter.onGet(url + '?pagination=false').reply(200, objs)
  }
}

let Stores
beforeEach(() => {
  Stores = buildStores()
  Stores.Env.setMetaxV3Host('metaxv3host', 443)
})

const searchText = 'string'

describe.each([
  [
    'field_of_science',
    'https://metax.fairdata.fi/es/reference_data/field_of_science/_search',
    'https://metaxv3host:443/v3/reference-data/fields-of-science',
    [
      {
        id: 1,
        label: { en: 'en_label', fi: 'fi_label' },
        parents: [2, 3],
        value: `uri`,
      },
    ],
  ],
  [
    'file_format_version',
    'https://metax.fairdata.fi/es/reference_data/file_format_version/_search',
    'https://metaxv3host:443/v3/reference-data/file-format-version',
    [
      {
        id: 1,
        label: { en: 'en_label', fi: 'fi_label' },
        parents: [2, 3],
        value: `uri`,
        fileFormat: undefined,
        formatVersion: undefined,
      },
    ],
  ],
])('get reference data for %s', (type, v2Url, v3Url, expectedOptions) => {
  test(`v2 getOptions`, async () => {
    mockV2(v2Url)
    const options = await Stores.Qvain.ReferenceData.getOptions(type)
    expect(options).to.eql(expectedOptions)
  })

  test(`v3 getOptions`, async () => {
    mockV3(v3Url)
    Stores.Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
    const options = await Stores.Qvain.ReferenceData.getOptions(type)
    expect(options).to.eql(expectedOptions)
  })

  test(`v2 getOptions with search`, async () => {
    mockV2(v2Url, searchText)
    const options = await Stores.Qvain.ReferenceData.getOptions(type, { searchText: searchText })
    expect(options).to.eql(expectedOptions)
  })

  test(`v3 getOptions with search`, async () => {
    mockV3(v3Url, searchText)
    Stores.Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
    const options = await Stores.Qvain.ReferenceData.getOptions(type, { searchText: searchText })
    expect(options).to.eql(expectedOptions)
  })

  test(`getLocalizedOptions`, async () => {
    mockV2(v2Url)
    const options = await Stores.Qvain.ReferenceData.getLocalizedOptions(type)
    expect(options).to.eql({
      en: expectedOptions.map(opt => ({ label: opt.label.en, value: opt.value })),
      fi: expectedOptions.map(opt => ({ label: opt.label.fi, value: opt.value })),
    })
  })
})
