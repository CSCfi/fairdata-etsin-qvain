export const entity_type_dataset = {
  id: 'b7f4d810-cc97-4da5-bf81-84c475a060eb',
  url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/dataset',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/resource_type',
  pref_label: {
    en: 'Dataset',
    fi: 'Tutkimusaineisto',
  },
}

export const relation_type_cites = {
  id: '9efe61b9-635c-4cbe-abfe-09697eb220cd',
  url: 'http://purl.org/spar/cito/cites',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/relation_type',
  pref_label: {
    en: 'Cites',
    fi: 'Viittaa',
  },
}

export const relation_a = {
  entity: {
    title: {
      en: 'Related dataset',
      fi: 'Toinen aineisto',
    },
    description: {
      en: 'This is the description of a dataset.',
      fi: 'Suomenkielinen aineiston kuvaus.',
    },
    entity_identifier: 'doi:some_dataset',
    type: entity_type_dataset,
  },
  relation_type: relation_type_cites,
}

export const other_identifier_a = {
  notation: 'https://www.example.com',
}
