const datasets = {
  title: 'Aineistot',
  search: {
    hidden: 'Haku',
    label: 'Haku',
    searchTitle: 'Hakusana ao. listan filtteröimiseksi',
    placeholder: 'Suodata aineiston nimen mukaan',
    searchTitleShort: 'Etsi aineistoja',
  },
  sort: {
    label: 'Järjestys:',
    title: 'Otsikko',
    status: 'Tila',
    owner: 'Omistaja',
    dateCreated: 'Luotu',
  },
  help: 'Muokkaa olemassa olevaa aineistoa tai luo uusi',
  createButton: 'Luo uusi aineistokuvailu',
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
    edit: 'Muokkaa',
    share: 'Jaa',
    preview: 'Katsele',
    owner: 'Omistaja',
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
  owner: {
    me: 'Minä',
    project: 'Projekti',
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
  actions: {
    edit: 'Muokkaa',
    editDraft: 'Muokkaa luonnosta',
    goToEtsin: 'Katso Etsimessä',
    goToEtsinDraft: 'Esikatsele Etsimessä',
    share: 'Muokkaajat',
    createNewVersion: 'Luo uusi versio',
    useAsTemplate: 'Käytä mallina',
    revert: 'Poista muutokset',
    delete: 'Poista',
  },
  shortActions: {
    edit: 'Muokkaa',
    editDraft: 'Muokkaa',
    goToEtsin: 'Katsele',
    goToEtsinDraft: 'Katsele',
    share: 'Muokkaajat',
  },
  remove: {
    confirm: {
      published: {
        text: 'Haluatko varmasti poistaa aineiston? Aineiston poiston jälkeen se ei enää näy Qvaimessa eikä Etsimen haku löydä sitä. Aineiston laskeutumissivua ei poisteta.',
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
  openNewVersion: 'Avaa uusi versio',
  noDatasets: 'Sinulla ei ole olemassa olevia aineistoja.',
  noMatchingDatasets: 'Hakua vastaavia aineistoja ei löytynyt.',
  reload: 'Lataa uudelleen',
  loading: 'Lataa...',
  errorOccurred: 'Virhe tapahtui',
  tableHeader: 'Luodut aineistot',
  tabs: {
    all: 'Kaikki aineistot',
  },
  share: {
    title: 'Jaa metadatan muokkausoikeuksia',
    tabs: {
      invite: 'Kutsu',
      members: 'Jäsenet',
    },
    errors: {
      loadingPermissions: 'Tietojen hakeminen epäonnistui. Ole hyvä ja yritä uudestaan.',
    },
    invite: {
      users: {
        label: 'Käyttäjät',
        placeholder: 'Lisää käyttäjiä',
        help: 'Etsi käyttäjiä nimen, käyttäjätunnuksen tai sähköpostin perusteella.',
        empty: 'Käyttäjiä ei löytynyt.',
        searchError: 'Käyttäjien hakemisessa tapahtui virhe.',
        searching: 'Haetaan...',
      },
      roles: {
        editor: 'Muokkaaja',
      },
      message: {
        label: 'Viesti',
        placeholder: 'Kirjoita kutsuun viesti.',
      },
      button: 'Kutsu',
      confirm: {
        warning: 'Kutsua ei ole vielä lähetetty. Perutaanko kutsun lähetys?',
        confirm: 'Kyllä, unohda kutsu',
        cancel: 'Ei, jatka muokkausta',
      },
      results: {
        success: 'Muokkausoikeus jaettu käyttäjille',
        fail: 'Muokkausoikeuksien jakaminen epäonnistui käyttäjille',
        close: 'Sulje',
      },
    },
    members: {
      roles: {
        owner: 'Omistaja',
        creator: 'Luoja',
        editor: 'Muokkaaja',
      },
      remove: 'Poista',
      labels: {
        permissions: 'Jäsenet',
        projectMembers: 'Projektin %(project)s jäsenet',
      },
      updateError: 'Käyttöoikeuksien päivityksessä tapahtui virhe. Yritä uudelleen.',
      projectHelp:
        'Projektin jäsenille myönnetään muokkausoikeudet automaattisesti. Projektin jäseniä voi muuttaa My CSC:n kautta.',
      projectHelpLabel: 'Info',
    },
    remove: {
      warning: 'Olet poistamassa aineiston muokkausoikeudet käyttäjältä %(user)s. Oletko varma?',
      loseAccessWarning:
        'Et voi enää muokata aineistoa tämän toiminnon jälkeen. Valitse ruutu vahvistaaksesi.',
      confirm: 'Poista',
      cancel: 'Peruuta',
    },
  },
  previousVersions: {
    label: 'Edelliset versiot',
    show: 'Näytä edelliset versiot',
    hide: 'Piilota edelliset versiot',
  },
}

export default datasets
