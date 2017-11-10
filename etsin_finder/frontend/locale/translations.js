import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  slogan: 'Research data finder',
  addDataset: 'Add dataset',
  nav: {
    datasets: 'Datasets',
    home: 'Home',
    organizations: 'Organizations',
    help: 'Help & About',
  },
  home: {
    title: 'Search datasets',
  },
  dataset: {
    dl: {
      files: 'Files',
      name: 'Name',
      size: 'Size',
      download: 'Download',
    },
    creator: { snglr: 'Creator', plrl: 'Creators' },
    contributor: { snglr: 'Contributor', plrl: 'Contributors' },
    publisher: 'Publisher',
    doi: 'DOI',
    project: 'Project',
    field_of_science: 'Field of science',
    keywords: 'Keywords',
    spatial_coverage: 'Spatial Coverage',
    temporal_coverage: 'Temporal Coverage',
    license: 'License',
    access_rights: 'Access rights statement',
    funder: 'Funder',
    curator: 'Curator',
    infrastructure: 'Infrastructure',
    permanent_link: 'Permanent link to this page',
  },
  error: {
    notFound: "Couldn't find metadata for given id",
  },
});

counterpart.registerTranslations('fi', {
  slogan: 'Tutkimustenhaku palvelu',
  addDataset: 'Lisää aineisto',
  nav: {
    datasets: 'Aineistot',
    home: 'Koti',
    organizations: 'Organisaatiot',
    help: 'Ohjeet & Info',
  },
  home: {
    title: 'Etsi aineistoa',
  },
  dataset: {
    dl: {
      files: 'Tiedostot',
      name: 'Nimi',
      size: 'Koko',
      download: 'Lataa',
    },
    creator: { snglr: 'Tekijä', plrl: 'Tekijät' },
    contributor: { snglr: 'Muu tekijä', plrl: 'Muut tekijät' },
    publisher: 'Julkaisija',
    doi: 'DOI',
    project: 'Projekti',
    field_of_science: 'Tieteenala',
    keywords: 'Keywords',
    spatial_coverage: 'Maantieteellinen kattavuus',
    temporal_coverage: 'Ajallinen kattavuus',
    license: 'Lisenssi',
    access_rights: 'Saatavuus',
    funder: 'Rahoittaja',
    curator: 'Hoivaaja',
    infrastructure: 'Infrastruktuuri',
    permanent_link: 'Pysyvä linkki tälle sivulle',
  },
  error: {
    notFound: 'Annetulle id:lle ei löytynyt metadataa',
  },
});
