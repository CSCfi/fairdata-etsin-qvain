export const remsApplicationData = {
  licenses: [
    {
      id: 4,
      licensetype: 'text',
      localizations: {
        en: {
          textcontent: 'Terms here',
          title: 'Terms for data access',
        },
        fi: {
          textcontent: 'Ehdot tässä',
          title: 'Käyttöluvan ehdot',
        },
      },
      is_data_access_terms: true,
    },
    {
      id: 1,
      licensetype: 'link',
      localizations: {
        en: {
          textcontent: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          title: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        },
        fi: {
          textcontent: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          title: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
        },
      },
      is_data_access_terms: false,
    },
    {
      id: 5,
      licensetype: 'link',
      localizations: {
        en: {
          textcontent: 'https://license.url',
          title: 'License name',
        },
        fi: {
          textcontent: 'https://license.url',
          title: 'Lisenssin nimi',
        },
      },
      is_data_access_terms: false,
    },
  ],
  forms: [],
}