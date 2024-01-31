// This is a coherent search result response for db that has exactly one dataset (datasetA.data).
import dataset from '../datasets/dataset_ida_a.data'

export const aggregations = {
  data_catalog: {
    query_parameter: 'data_catalog__title',
    hits: [
      {
        value: {
          und: 'urn:nbn:fi:att:data-catalog-ida',
        },
        count: 1,
      },
    ],
  },
  access_type: {
    query_parameter: 'access_rights__access_type__pref_label',
    hits: [
      {
        value: {
          fi: 'Avoin',
        },
        count: 1,
      },
      {
        value: {
          en: 'Open',
        },
        count: 1,
      },
    ],
  },
  organization: {
    query_parameter: 'actors__organization__pref_label',
    hits: [
      {
        value: {
          fi: 'Koneen Säätiö',
        },
        count: 1,
      },
      {
        value: {
          en: 'Kone Foundation',
        },
        count: 1,
      },
      {
        value: {
          en: 'Test org',
        },
        count: 1,
      },
    ],
  },
  creator: {
    query_parameter: 'actors__roles__creator',
    hits: [
      {
        value: {
          en: 'Test org',
        },
        count: 1,
      },
    ],
  },
  field_of_science: {
    query_parameter: 'field_of_science__pref_label',
    hits: [
      {
        value: {
          fi: 'Tietojenkäsittely ja informaatiotieteet',
        },
        count: 1,
      },
      {
        value: {
          en: 'Computer and information sciences',
        },
        count: 1,
      },
    ],
  },
  keyword: {
    query_parameter: 'keyword',
    hits: [
      {
        value: {
          und: 'test',
        },
        count: 1,
      },
      {
        value: {
          und: 'software development',
        },
        count: 1,
      },
      {
        value: {
          und: 'web-development',
        },
        count: 1,
      },
      {
        value: {
          und: 'testi',
        },
        count: 1,
      },
      {
        value: {
          und: 'ohjelmistokehitys',
        },
        count: 1,
      },
      {
        value: {
          und: 'web-kehitys',
        },
        count: 1,
      },
    ],
  },
  infrastructure: {
    query_parameter: 'infrastructure__pref_label',
    hits: [],
  },
  file_type: {
    query_parameter: 'file_type',
    hits: [],
  },
  project: {
    query_parameter: 'projects__title',
    hits: [],
  },
}

export default { results: [dataset], aggregations, count: 1 }
