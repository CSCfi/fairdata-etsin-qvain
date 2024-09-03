// This is a coherent search result response for db that has 21 dataset (dataset_ida_a.data and last dataset_ida_b.data).
const aggregations = {
  data_catalog: {
    query_parameter: 'data_catalog__title',
    hits: [
      {
        value: {
          und: 'urn:nbn:fi:att:data-catalog-ida',
        },
        count: 21,
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
        count: 21,
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
        count: 21,
      },
      {
        value: {
          en: 'Kone Foundation',
        },
        count: 21,
      },
    ],
  },
  creator: {
    query_parameter: 'actors__roles__creator',
    hits: [
      {
        value: {
          fi: 'Koneen Säätiö',
        },
        count: 21,
      },
      {
        value: {
          en: 'Kone Foundation',
        },
        count: 21,
      },
    ],
  },
  field_of_science: {
    query_parameter: 'field_of_science__pref_label',
    hits: [],
  },
  keyword: {
    query_parameter: 'keyword',
    hits: [],
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

export default aggregations
