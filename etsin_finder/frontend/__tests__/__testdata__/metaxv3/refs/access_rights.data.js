export const license_a = {
  custom_url: null,
  description: null,
  id: '20fe1678-9e2f-4be1-a2fb-13e5f2940de0',
  url: 'http://uri.suomi.fi/codelist/fairdata/license/code/other-open',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/license',
  pref_label: { en: 'Other (Open)', fi: 'Muu (Avoin)' },
}

export const license_b = {
  custom_url: 'https://creativecommons.org/licenses/by/4.0/',
  description: null,
  id: '5d1a9124-2a69-47f6-b2ee-7b6df54fed1a',
  url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/license',
  pref_label: {
    en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
  },
}

export const access_type_open = {
  id: '6b475ced-86e6-44e3-985d-ab2c040638af',
  url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
  pref_label: { en: 'Open', fi: 'Avoin' },
}

export const access_type_embargo = {
  url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
  pref_label: { en: 'Embargo', fi: 'Embargo' },
}

export const access_type_permit = {
  url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
  pref_label: { en: 'Requires permission', fi: 'Vaatii luvan' },
}

export const restriction_grounds_research = {
  id: '6cedbc74-0b3a-41f1-91ae-fd1f4cbcbe1c',
  url: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/research',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds',
  pref_label: {
    en: 'Restriced access for research based on contract',
    fi: 'Saatavuutta rajoitettu sopimuksen perusteella vain tutkimuskäyttöön',
    sv: 'Begränsad åtkomst på bas av kontrakt ändast för forskningsändamål',
  },
}

export const access_rights_open_a = {
  id: '55f2ff9b-68f2-4895-88b9-ca7f9ff750fc',
  description: null,
  license: [license_a, license_b],
  access_type: access_type_open,
  show_file_metadata: true,
}

export const access_rights_embargo = {
  id: '55f2ff9b-68f2-4895-88b9-ca7f9ff750fc',
  description: null,
  license: [license_a, license_b],
  access_type: access_type_embargo,
  restriction_grounds: [restriction_grounds_research],
  available: '2023-12-24',
  show_file_metadata: true,
}
