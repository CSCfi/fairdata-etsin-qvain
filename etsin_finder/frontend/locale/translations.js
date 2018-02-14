import counterpart from 'counterpart'

counterpart.registerTranslations('en', {
  addDataset: 'Add dataset',
  stc: 'Skip to content',
  dataset: {
    access_locked: 'Restricted Access',
    access_open: 'Open Access',
    access_rights: 'Access rights statement',
    contributor: {
      plrl: 'Contributors',
      snglr: 'Contributor',
    },
    creator: {
      plrl: 'Creators',
      snglr: 'Creator',
    },
    curator: 'Curator',
    dl: {
      download: 'Download',
      downloadAll: 'Download all',
      files: 'Files',
      fileAmount: '%(amount)s files',
      name: 'Name',
      size: 'Size',
      breadcrumbs: 'Breadcrumbs',
      file_types: {
        directory: 'Folder',
        file: 'file',
      },
      dirContent: 'Folder content',
      category: 'Category',
      info: 'Info',
      info_about: 'about object: %(file)s',
      item: 'item %(item)s',
    },
    doi: 'DOI',
    field_of_science: 'Field of science',
    funder: 'Funder',
    infrastructure: 'Infrastructure',
    keywords: 'Keywords',
    license: 'License',
    permanent_link: 'Permanent link to this page',
    project: 'Project',
    publisher: 'Publisher',
    spatial_coverage: 'Spatial Coverage',
    temporal_coverage: 'Temporal Coverage',
  },
  changepage: 'Navigated to page: %(page)s',
  error: {
    notFound: "Couldn't find metadata for given id",
  },
  home: {
    title: 'Search datasets',
  },
  nav: {
    datasets: 'Datasets',
    help: 'Help & About',
    home: 'Home',
    organizations: 'Organizations',
  },
  search: {
    sorting: {
      best: 'Best Match',
      dateD: 'Date descending',
      dateA: 'Date ascending',
    },
  },
  results: {
    amount: {
      plrl: '%(amount)s results',
      snglr: '%(amount)s result',
    },
  },
  slogan: 'Research data finder',
})

counterpart.registerTranslations('fi', {
  addDataset: 'Lisää aineisto',
  stc: 'Siirry sivun pääsisältöön',
  dataset: {
    access_locked: 'Rajattu käyttöoikeus',
    access_open: 'Avoin',
    access_rights: 'Saatavuus',
    contributor: {
      plrl: 'Muut tekijät',
      snglr: 'Muu tekijä',
    },
    creator: {
      plrl: 'Tekijät',
      snglr: 'Tekijä',
    },
    curator: 'Hoivaaja',
    dl: {
      download: 'Lataa',
      files: 'Tiedostot',
      name: 'Nimi',
      size: 'Koko',
      downloadAll: 'Lataa kaikki',
      fileAmount: '%(amount)s tiedostoa',
      breadcrumbs: 'Leivänmurut',
      file_types: {
        directory: 'Kansio',
        file: 'tiedosto',
      },
      dirContent: 'Kansion sisältö',
      category: 'Kategoria',
      info: 'Tietoja',
      info_about: 'aineistosta: %(file)s',
      item: 'aineisto %(item)s',
    },
    doi: 'DOI',
    field_of_science: 'Tieteenala',
    funder: 'Rahoittaja',
    infrastructure: 'Infrastruktuuri',
    keywords: 'Keywords',
    license: 'Lisenssi',
    permanent_link: 'Pysyvä linkki tälle sivulle',
    project: 'Projekti',
    publisher: 'Julkaisija',
    spatial_coverage: 'Maantieteellinen kattavuus',
    temporal_coverage: 'Ajallinen kattavuus',
  },
  error: {
    notFound: 'Annetulle id:lle ei löytynyt metadataa',
  },
  home: {
    title: 'Etsi aineistoa',
  },
  nav: {
    datasets: 'Aineistot',
    help: 'Ohjeet & Info',
    home: 'Koti',
    organizations: 'Organisaatiot',
  },
  search: {
    sorting: {
      best: 'Osuvimmat ensin',
      dateD: 'Uusin ensin',
      dateA: 'Vanhin ensin',
    },
  },
  results: {
    amount: {
      plrl: '%(amount)s hakutulosta',
      snglr: '%(amount)s hakutulos',
    },
  },
  slogan: 'Tutkimustenhaku palvelu',
})
