const datasets = {
  title: 'Aineistot',
  search: {
    hidden: 'Haku',
    searchTitle: 'Hakusana ao. listan filtteröimiseksi',
    placeholder: 'Suodata aineiston nimen mukaan',
  },
  help: 'Muokkaa olemassa olevaa aineistoa tai luo uusi',
  createButton: 'Luo uusi aineisto',
  createNewVersion: 'Luo uusi versio',
  useAsTemplate: 'Käytä mallina',
  state: {
    draft: 'Luonnos',
    published: 'Julkaistu',
    changed: 'Julkaisemattomia muutoksia',
  },
  tableRows: {
    id: 'ID',
    title: 'Otsikko',
    version: 'Versio',
    modified: 'Muokattu',
    created: 'Luotu',
    state: 'Tila',
    actions: 'Toiminnot',
    dateFormat: {
      moments: 'Muutama hetki sitten',
      oneMinute: '1 minuutti sitten',
      minutes: 'minuuttia sitten',
      oneHour: '1 tunti sitten',
      hours: 'tuntia sitten',
      oneDay: '1 päivä sitten',
      days: 'päivää sitten',
      oneMonth: '1 kuukausi sitten',
      months: 'kuukautta sitten',
      oneYear: '1 vuosi sitten',
      years: 'vuotta sitten',
    },
  },
  moreActions: 'Lisää',
  moreVersions: {
    one: 'Näytä 1 versio lisää',
    other: 'Näytä %(count)s versiota lisää',
  },
  hideVersions: 'Piilota vanhat versiot',
  oldVersion: 'Vanha versio',
  latestVersion: 'Uusin',
  deprecated: 'Vanhentunut',
  editButton: 'Muokkaa',
  editDraftButton: 'Muokkaa luonnosta',
  deleteButton: 'Poista',
  revertButton: 'Poista muutokset',
  remove: {
    confirm: {
      published: {
        text:
          'Haluatko varmasti poistaa aineiston? Aineiston poiston jälkeen se ei enää näy Qvaimessa eikä Etsimen haku löydä sitä. Aineiston laskeutumissivua ei poisteta.',
        ok: 'Poista',
      },
      draft: {
        text: 'Haluatko varmasti poistaa luonnoksen? Luonnos poistetaan pysyvästi.',
        ok: 'Poista',
      },
      changes: {
        text: 'Haluatko varmasti poistaa aineistoon tehdyt julkaisemattomat muutokset?',
        ok: 'Poista muutokset',
      },
      cancel: 'Peruuta',
    },
  },
  goToEtsin: 'Katso Etsimessä',
  goToEtsinDraft: 'Esikatsele Etsimessä',
  openNewVersion: 'Avaa uusi versio',
  noDatasets: 'Sinulla ei ole olemassa olevia aineistoja',
  reload: 'Lataa uudelleen',
  loading: 'Lataa...',
  errorOccurred: 'Virhe tapahtui',
  tableHeader: 'Luodut aineistot',
  tabs: {
    all: 'Kaikki aineistot',
    another: 'Toinen välilehti',
  },
}

export default datasets
