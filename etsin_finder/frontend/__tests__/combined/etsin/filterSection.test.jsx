import React from 'react'
import { shallow } from 'enzyme'
import {
  FilterSection,
  FilterCategory,
  Section,
  FilterItems,
} from '../../../js/components/search/filterResults/filterSection'
import { PasCheckBox } from '../../../js/components/search/filterResults/PasCheckBox'
import ElasticQuery from '../../../js/stores/view/elasticquery'

const getStores = () => ({
  ElasticQuery: ElasticQuery,
})

const mockElasticQuery = ElasticQuery

jest.mock('../../../js/stores/stores', () => {
  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores: () => ({ ElasticQuery: mockElasticQuery }),
  }
})

const result1 = {
  hits: [
    {
      _index: 'metax',
      _type: 'dataset',
      _id: 'e8c85053-e5a4-4b13-a761-3d4263cb7962',
      _score: 12.766587,
      _source: {
        identifier: 'e8c85053-e5a4-4b13-a761-3d4263cb7962',
        data_catalog: {
          fi: 'Fairdata IDA-aineistot',
          sv: 'Fairdata forskningsdata',
          en: 'Fairdata IDA datasets',
        },
        data_catalog_identifier: 'urn:nbn:fi:att:data-catalog-ida',
        description: { fi: 'Kuvaus aineistoon  \nRivinvaihto  \n- bullet\n- bullet2' },
        access_rights: {
          license: [
            {
              identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
              title: {
                fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
                en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
                und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
              },
            },
            {
              identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-2.0',
              title: {
                fi: 'Creative Commons Nimeä 2.0 Yleinen (CC BY 2.0)',
                en: 'Creative Commons Attribution 2.0 Generic (CC BY 2.0)',
                und: 'Creative Commons Nimeä 2.0 Yleinen (CC BY 2.0)',
              },
            },
          ],
          access_type: {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
            pref_label: { fi: 'Embargo', en: 'Embargo', und: 'Embargo' },
          },
        },
        title: { fi: 'Testi, Qvain webinar 20190912' },
      },
      highlight: { 'title.fi.finnish': ['<em>Testi</em>, Qvain webinar 20190912'] },
    },
  ],
  total: 1,
  aggregations: {
    project_name_en: { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [] },
    file_type_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Kuva', doc_count: 1 }],
    },
    creator: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Erjan oma organisaatio', doc_count: 1 }],
    },
    data_catalog_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Fairdata IDA-aineistot', doc_count: 1 }],
    },
    infrastructure_fi: { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [] },
    project_name_fi: { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [] },
    access_type_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Embargo', doc_count: 1 }],
    },
    file_type_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Image', doc_count: 1 }],
    },
    organization_name_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'CSC - IT Center for Science Ltd', doc_count: 1 },
        { key: 'Erjan oma organisaatio', doc_count: 1 },
      ],
    },
    all_keywords_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'cat', doc_count: 1 },
        { key: 'koira', doc_count: 1 },
        { key: 'lehmä', doc_count: 1 },
      ],
    },
    all_keywords_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'kissa', doc_count: 1 },
        { key: 'koira', doc_count: 1 },
        { key: 'lehmä', doc_count: 1 },
      ],
    },
    organization_name_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'CSC – Tieteen tietotekniikan keskus Oy', doc_count: 1 },
        { key: 'Erjan oma organisaatio', doc_count: 1 },
      ],
    },
    data_catalog_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Fairdata IDA datasets', doc_count: 1 }],
    },
    infrastructure_en: { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [] },
    access_type_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{ key: 'Embargo', doc_count: 1 }],
    },
    field_of_science_en: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'Biomedicine', doc_count: 1 },
        { key: 'Environmental sciences', doc_count: 1 },
        { key: 'Nursing', doc_count: 1 },
      ],
    },
    field_of_science_fi: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: 'Biolääketieteet', doc_count: 1 },
        { key: 'Hoitotiede', doc_count: 1 },
        { key: 'Ympäristötiede', doc_count: 1 },
      ],
    },
  },
}

describe('FilterSection', () => {
  const stores = getStores()
  stores.ElasticQuery.results = result1
  const wrapper = shallow(<FilterSection aggregation="data_catalog" Stores={stores} />)
  it('should render <FilterSection />', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('should render <FilterCategory />', () => {
    expect(wrapper.find(Section).length).toBe(1)
  })
  it('should render <FilterCategory />', () => {
    expect(wrapper.find(FilterCategory).length).toBe(1)
  })
  it('should render <FilterItems />', () => {
    expect(wrapper.find(FilterItems).length).toBe(1)
  })
  it('should render <PasCheckBox />', () => {
    const wrapper = shallow(<PasCheckBox aggr="data_catalog" Stores={stores} />)
    expect(wrapper.find('#pasCheckbox').length).toBe(1)
  })
  it('should NOT render <PasCheckBox />', () => {
    const wrapper = shallow(<PasCheckBox aggr="asd" Stores={stores} />)
    expect(wrapper.find('#pasCheckbox').length).toBe(0)
  })
})
