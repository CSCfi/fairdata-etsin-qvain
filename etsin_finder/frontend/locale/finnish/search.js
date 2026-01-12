export default {
  name: 'Haku',
  searchBar: 'Hakukenttä',
  filterSearches: {
    organization: 'Organisaatio-fasetin hakukenttä',
    creator: 'Tekijä-fasetin hakukenttä',
    fieldOfScience: 'Tieteenala-fasetin hakukenttä',
    keyword: 'Avainsana-fasetin hakukenttä',
    project: 'Projekti-fasetin hakukenttä',
  },
  placeholder: 'Anna hakusana',
  sorting: {
    sort: 'Järjestä',
    best: 'Osuvin ensin',
    bestTitle: 'Osuvin',
    dateA: 'Vanhin ensin',
    dateATitle: 'Vanhin',
    dateD: 'Viimeksi muokattu',
    dateDTitle: 'Uusin',
  },
  filter: {
    clearFilter: 'Poista rajaukset',
    filtersCleared: 'Rajaukset poistettu',
    filters: 'Rajaukset',
    filter: 'Rajaa',
    SRactive: 'päällä',
    show: 'Lisää',
    hide: 'Vähemmän',
  },
  pagination: {
    prev: 'Edellinen sivu',
    next: 'Seuraava sivu',
    skipped: 'Ylihypätyt sivut',
    page: 'sivu',
    currentpage: 'nykyinen sivu',
    pagination: 'Paginaatio',
    changepage: 'Sivu %(value)s',
  },
  noResults: {
    searchterm: 'Haullesi - <strong>%(search)s</strong> - ei löytynyt yhtään osumaa.',
    nosearchterm: 'Haullesi ei löytynyt yhtään osumaa.',
  },
  aggregations: {
    access_type: {
      title: 'Saatavuus',
    },
    organization: {
      title: 'Organisaatio',
    },
    creator: {
      title: 'Tekijä',
    },
    field_of_science: {
      title: 'Tieteenala',
    },
    keyword: {
      title: 'Avainsana',
    },
    infrastructure: {
      title: 'Tutkimusinfra',
    },
    project: {
      title: 'Projekti',
    },
    file_type: {
      title: 'Tiedostotyyppi',
    },
    data_catalog: {
      title: 'Datakatalogi',
    },
    temporal: {
      title: 'Ajanjakso',
      button: 'Hae',
      placeholder: 'vuosi',
      start: 'Alkaen',
      end: 'Päättyen',
      validationErrors: {
        startGtEnd: 'Ajanjakson alkamisvuosi ei voi olla myöhemmin kuin päättymisvuosi',
        invalidStart: 'Annettu alkuajankohta on virheellinen (anna vuosiluku muodossa VVVV)',
        invalidEnd: 'Annettu päättymisajankohta on virheellinen (anna vuosiluku muodossa VVVV)',
      },
    },
  },
  facetSearchPlaceholder: 'Rajaa listaa hakusanalla',
}
