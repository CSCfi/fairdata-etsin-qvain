export const use_category_source = {
  id: '2e64a205-f20b-4157-ad2a-e4f899b71681',
  url: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/source',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
  pref_label: {
    en: 'Source material',
    fi: 'Lähdeaineisto',
  },
}

export const file_type_av = {
  id: '0487cd2a-b54e-4117-a20c-940587e90b6c',
  url: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/audiovisual',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/file_type',
  pref_label: {
    en: 'Audiovisual',
    fi: 'Audiovisuaalinen',
  },
}

export const remote_resource_a = {
  title: {
    en: 'Dataset Remote Resource',
  },
  description: {
    en: 'Description of resource',
  },
  access_url: 'https://access.url',
  download_url: 'https://download.url',
  use_category: use_category_source,
  file_type: file_type_av,
  checksum: 'md5:f00f',
  mediatype: 'text/csv',
}
