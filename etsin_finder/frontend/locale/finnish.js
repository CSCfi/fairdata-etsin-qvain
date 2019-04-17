/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

const finnish = {
  changepage: 'Siirryit sivulle: %(page)s',
  dataset: {
    access_permission: 'Hae käyttölupaa',
    access_locked: 'Rajattu käyttöoikeus',
    access_open: 'Avoin',
    access_rights: 'Saatavuus',
    catalog_publisher: 'Katalogin julkaisija',
    citation: 'Sitaatti',
    citation_formats: 'Näytä lisää sitaattiehdotuksia',
    contact: {
      access: 'Aineiston käyttöoikeuteen liittyvissä kyselyissä ota yhteyttä kuraattoriin.',
      contact: 'Ota yhteyttä',
      email: {
        error: { required: 'Sähköposti vaaditaan!', invalid: 'Virhe sähköpostissa' },
        name: 'Sähköposti',
        placeholder: 'Anna sähköposti',
      },
      error: 'Virhe viestin lähetyksessä!',
      errorInternal: 'Internal server error! Please contact our support',
      message: {
        error: {
          required: 'Viesti vaaditaan!',
          max: 'Viestin maksimi pituus on 1000 merkkiä',
        },
        name: 'Viesti',
        placeholder: 'Syötä viesti',
      },
      recipient: {
        error: { required: 'Vastaanottaja vaaditaan!' },
        placeholder: 'Valitse vastaanottaja',
        name: 'Vastaanottaja',
      },
      send: 'Lähetä viesti',
      subject: {
        error: { required: 'Aihe vaaditaan!' },
        name: 'Aihe',
        placeholder: 'Anna aihe',
      },
      success: 'Viestin lähettäminen onnistui!',
    },
    contributor: {
      plrl: 'Muut tekijät',
      snglr: 'Muu tekijä',
    },
    copyToClipboard: 'Kopioi leikepöydälle',
    creator: {
      plrl: 'Tekijät',
      snglr: 'Tekijä',
    },
    curator: 'Kuraattori',
    dl: {
      root: 'juuri',
      breadcrumbs: 'Leivänmurut',
      category: 'Kategoria',
      dirContent: 'Kansion sisältö',
      download: 'Lataa',
      downloadAll: 'Lataa kaikki',
      downloading: 'Ladataan...',
      fileAmount: '%(amount)s objektia',
      close_modal: 'Sulje info',
      info_header: 'Tiedoston muut tiedot',
      loading: 'Ladataan kansiota',
      loaded: 'Kansio latautunut',
      file_types: {
        both: 'tiedostot ja kansiot',
        directory: 'Kansio',
        file: 'tiedosto',
      },
      files: 'Tiedostot',
      info: 'Tietoja',
      info_about: 'aineistosta: %(file)s',
      item: 'aineisto %(item)s',
      name: 'Nimi',
      size: 'Koko',
      remote: 'Remote aineistot',
      checksum: 'Checksum',
      id: 'ID',
      title: 'Otsikko',
      type: 'Tyyppi',
      go_to_original: 'Siirry sivulle',
      sliced: 'Joitain tiedostoja ei näytetä tässä näkymässä tiedostojen suuren lukumäärän vuoksi'
    },
    events_idn: {
      events: {
        title: 'Tapahtumat',
        event: 'Tapahtuma',
        who: 'Kuka',
        when: 'Milloin',
        event_title: 'Otsikko',
        description: 'Kuvaus',
      },
      other_idn: 'Muut tunnisteet',
      relations: {
        title: 'Relaatiot',
        type: 'Tyyppi',
        name: 'Otsikko',
        idn: 'Tunniste',
      },
    },
    doi: 'DOI',
    field_of_science: 'Tieteenala',
    funder: 'Rahoittaja',
    goBack: 'Palaa takaisin',
    identifier: 'Tunniste',
    infrastructure: 'Infrastruktuuri',
    issued: 'Julkaisupäivämäärä',
    modified: 'Aineston muokkauspäivämäärä',
    harvested: 'Haravoitu',
    cumulative: 'Kumulatiivinen',
    keywords: 'Avainsanat',
    license: 'Lisenssi',
    loading: 'Ladataan aineistoa',
    go_to_original: 'Siirry alkuperäiseen',
    permanent_link: 'Pysyvä linkki tälle sivulle',
    project: {
      project: 'Projekti',
      name: 'Nimi',
      identifier: 'Tunniste',
      sourceOrg: 'Organisaatiot',
      funding: 'Rahoitus',
      has_funder_identifier: 'Rahoittajan tunniste',
      funder: 'Rahoittaja',
      funder_type: 'Rahoitustyyppi',
      homepage: 'Projektin kotisivut',
      homepageUrl: 'Linkki',
      homepageDescr: 'Kuvaus'
    },
    publisher: 'Julkaisija',
    rights_holder: 'Oikeuksienhaltija',
    spatial_coverage: 'Maantieteellinen kattavuus',
    temporal_coverage: 'Ajallinen kattavuus',
    tags: 'Aineiston tägit',
    version: { number: 'Versio %(number)s', old: '(Vanha)' },
    agent: {
      contributor_role: 'Rooli',
      contributor_type: 'Tyyppi',
      member_of: 'Jäsen',
      is_part_of: 'Jäsen',
      homepage: 'Kotisivu',
    },
    language: 'Kieli',
  },
  error: {
    notFound:
      'Olemme pahoillamme, nyt sattui häiriötilanne. Ole hyvä ja yritä hetken päästä uudelleen.',
    notLoaded: 'Hups! Sivua ei löytynyt.',
    undefined: 'Hups! Tapahtui virhe.',
  },
  general: {
    showMore: 'Näytä lisää',
    showLess: 'Näytä vähemmän',
    description: 'Kuvaus',
    notice: {
      SRhide: 'hide notice',
    },
    state: {
      changedLang: 'Kieli vaihdettu kieleen: %(lang)s',
      inactiveLogout: 'Istunto aikakatkaistu. Sinut kirjattiin ulos.',
    },
    pageTitles: {
      data: 'Data',
      idnAndEvents: 'Tunnisteet ja tapahtumat',
      maps: 'Kartat',
      dataset: 'Aineisto',
      datasets: 'Aineistot',
      home: 'Koti',
      error: 'Virhe',
    },
    language: {
      toggleLabel: 'Vaihda kieltä',
    },
  },
  home: {
    title: 'Etsi aineistoa',
    title1: 'Mikä Etsin on?',
    title2: 'Miten saan aineistot käyttööni?',
    para1:
      'Etsimen avulla voit etsiä tutkimusaineistoja ja niiden metatietoja Fairdata-palveluista. Kopioimme myös metatietoja muista lähteistä, tällä hetkellä Tietoarkistosta, Kielipankista ja SYKEstä.',
    para2:
      'Julkaistut aineistojen kuvailutiedot ovat kaikille avoimia. Aineiston omistaja päättää, miten ja kuka pääsee käsiksi itse tutkimusaineistoon. Etsin on riippumaton itse aineiston tallennuspaikasta. Aineistoja voi kuvailla <a href="https://qvain.fairdata.fi">Qvain-palvelussa.</a><br><br>Lue lisää Fairdata-palveluista <a href="https://fairdata.fi">Fairdata.fi-sivuilta.</a>',
    key: {
      dataset: 'aineistoa',
      keywords: 'asiasanaa',
      fos: 'tieteenalaa',
      research: 'tutkimusprojektia',
    },
  },
  nav: {
    login: 'Kirjaudu',
    logout: 'Kirjaudu ulos',
    logoutNotice:
      'Kirjauduit ulos onnistuneesti. Sulje selain kirjautuaksesi ulos myös HAKA-palvelusta',
    data: 'Data',
    dataset: 'Aineisto',
    datasets: 'Aineistot',
    events: 'Tunnisteet ja tapahtumat',
    help: 'Ohjeet',
    home: 'Koti',
    organizations: 'Organisaatiot',
    addDataset: 'Lisää aineisto',
  },
  results: {
    resultsFor: 'Tulokset haulle: ',
    amount: {
      plrl: '%(amount)s hakutulosta',
      snglr: '%(amount)s hakutulos',
    },
  },
  search: {
    name: 'Haku',
    placeholder: 'Anna hakusana',
    sorting: {
      sort: 'Järjestä',
      best: 'Osuvin ensin',
      bestTitle: 'Osuvin',
      dateA: 'Vanhin ensin',
      dateATitle: 'Vanhin',
      dateD: 'Viimeksi muokattu',
      dateDTitle: 'Uusin'
    },
    filter: {
      clearFilter: 'Poista rajaukset',
      filtersCleared: 'Rajaukset poistettu',
      filters: 'Rajaukset',
      filter: 'Rajaa',
      SRactive: 'päällä',
      show: 'Lisää',
      hide: 'Vähemmän'
    },
    pagination: {
      prev: 'Edellinen sivu',
      next: 'Seuraava sivu',
      SRskipped: 'Ylihypätyt sivut',
      SRpage: 'sivu',
      SRcurrentpage: 'nykyinen sivu',
      SRpagination: 'Paginaatio',
      changepage: 'Sivu %(value)s',
    },
    noResults: {
      searchterm: 'Haullesi - <strong>%(search)s</strong> - ei löytynyt yhtään osumaa.',
      nosearchterm: 'Haullesi ei löytynyt yhtään osumaa.',
    },
  },
  qvain: {
    title: 'Julkaise tiedosto',
    general: {
      langEnglish: 'Englanti',
      langFinnish: 'Suomi'
    },
    description: {
      title: 'Kuvaus',
      description: {
        langEn: 'ENGLANTI',
        langFi: 'SUOMI',
        title: {
          label: 'Otsikko',
          placeholderFi: 'Otsikko (Suomi)',
          placeholderEn: 'Otsikko (Englanti)'
        },
        description: {
          label: 'Kuvaus',
          placeholderFi: 'Kuvaus (Suomi)',
          placeholderEn: 'Kuvaus (Englanti)'
        },
        instructions: 'Vain yksi kielivalinta on pakollinen'
      },
      otherIdentifiers: {
        title: 'Muut tunnisteet',
        instructions: 'Metadatan tunniste luodaan automaattisesti mutta jos on jo OLEMASSA OLEVA tunniste, syötä se tähän.',
        addButton: '+ Lisää uusi'
      },
      fieldOfScience: {
        title: 'Tutkimusala',
        placeholder: 'Valitse vaihtoehto'
      },
      keywords: {
        title: 'Avainsanat',
        placeholder: 'Esim. taloustiede'
      }
    },
    rightsAndLicenses: {
      title: 'Oikeudet ja lisenssit',
      accessType: {
        title: 'Pääsyoikeus',
        placeholder: 'Valitse vaihtoehto'
      },
      license: {
        title: 'Lisenssi',
        placeholder: 'Valitse vaihtoehto'
      }
    },
    participants: {
      title: 'Toimijat',
      add: {
        title: 'Toimijat',
        help: 'Tekijä (1+) ja julkaisija (max 1) roolit ovat pakollisia. Huomioi että yksittäisellä toimijalla voi olla useampi rooli.',
        radio: {
          person: 'Luonnollinen henkilö',
          organization: 'Organisaatio'
        },
        checkbox: {
          creator: 'Tekijä',
          publisher: 'Julkaisija',
          curator: 'Kuraattori'
        },
        name: {
          placeholder: {
            organization: 'Nimi',
            person: 'Etu- ja sukunimi'
          },
          label: 'Nimi'
        },
        email: {
          placeholder: 'Sähköposti',
          label: 'Sähköposti'
        },
        identifier: {
          label: 'Tunniste',
          placeholder: 'Tunniste'
        },
        organization: {
          label: {
            person: 'Organisaatio',
            organization: 'Emo-organisaatio'
          },
          placeholder: 'Esim. Helsingin yliopisto'
        },
        save: {
          label: 'Tallenna'
        },
        cancel: {
          label: 'Peruuta'
        }
      },
      added: {
        title: 'Lisätyt toimijat',
        noneAddedNotice: 'Toimijoita ei olla lisätty'
      }
    }
  },
  slogan: 'Tutkimustenhaku palvelu',
  stc: 'Siirry sivun pääsisältöön',
  tombstone: {
    info: 'Aineisto on joko vanhentunut tai poistettu',
  },
}

export default finnish
