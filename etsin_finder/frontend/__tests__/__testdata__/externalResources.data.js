import dataset from './dataset.att'

const clone = v => JSON.parse(JSON.stringify(v))

export const baseResource = {
  title: 'A Resource',
  use_category: {
    in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
    identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
    pref_label: {
      en: 'Documentation',
      fi: 'Dokumentaatio',
      und: 'Dokumentaatio',
    },
  },
}

export const bothUrlsResource = {
  ...clone(baseResource),
  title: 'Resource with both urls',
  access_url: {
    identifier: 'https://access.url',
  },
  download_url: {
    identifier: 'https://download.url',
  },
}

export const accessUrlResource = {
  ...clone(baseResource),
  title: 'Resource with access url',
  access_url: {
    identifier: 'https://access.url',
  },
}

export const anotherAccessUrlResource = {
  ...clone(baseResource),
  title: 'Resource with another access url',
  access_url: {
    identifier: 'https://another-access.url',
  },
}

export const downloadUrlResource = {
  ...clone(baseResource),
  title: 'Resource with download url',
  download_url: {
    identifier: 'https://download.url',
  },
  use_category: {
    in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
    identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
    pref_label: {
      en: 'Outcome',
      fi: 'Lopputulos',
      und: 'Outcome',
    },
  },
}

export const noUrlResource = {
  ...clone(baseResource),
}

export const datasetWithResources = resources =>
  Object.freeze({
    ...clone(dataset),
    research_dataset: {
      ...clone(dataset.research_dataset),
      remote_resources: resources,
    },
  })
