export const organization_kone = {
  id: 'c3ae0bec-444f-4ef3-adc9-c4d814ff9d7c',
  pref_label: {
    en: 'Kone Foundation',
    fi: 'Koneen Säätiö',
    sv: 'Koneen säätiö',
    und: 'Koneen Säätiö',
  },
  url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/02135371',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
  email: null,
  homepage: null,
  external_identifier: null,
}

export const custom_organization_a = {
  id: 'aedcdcdb-68a9-4400-8b4e-60ca908f24ea',
  pref_label: { en: 'Test org' },
  url: null,
  homepage: null,
  email: 'test@test.org',
  external_identifier: 'https://test.org',
}

export const custom_suborganization_a = {
  id: 'bf5ad8e7-04d7-40ca-94dd-5a05d4748c57',
  pref_label: { en: 'Test dept' },
  url: null,
  email: null,
  homepage: null,
  parent: custom_organization_a,
  external_identifier: null,
}
