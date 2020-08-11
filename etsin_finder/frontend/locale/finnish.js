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
    access_login: 'Käyttöluvan hakeminen vaatii sisään kirjautumisen',
    access_unavailable: 'Ei käytettävissä',
    access_denied: 'Hakemus evätty',
    access_draft: 'Hakemus luonnos vaiheessa',
    access_request_sent: 'Käyttölupaa haettu',
    access_granted: 'Käyttölupa myönnetty',
    access_rights_description: {
      none: '',
      open: 'Kuka tahansa voi ladata datan.',
      login: 'Käyttäjän pitää olla sisään kirjautunut ladatakseen datan.',
      embargo: 'Datan voi ladata vasta, kun embargo-pvm on ohitettu.',
      permit:
        'Datan voi ladata ainoastaan hakemalla erillisen luvan lataamista varten. Luvan hakeminen vaatii kirjautumisen.',
      restricted: 'Data ei ladattavissa.',
    },
    access_permission: 'Hae käyttölupaa',
    access_locked: 'Rajattu käyttöoikeus',
    access_open: 'Avoin',
    access_rights: 'Saatavuus',
    catalog_publisher: 'Katalogin julkaisija',
    citation: 'Sitaatti / Lähdeviite',
    citation_formats: 'Näytä lisää sitaattiehdotuksia',
    citationNoDateIssued: 'Julkaisupäivämäärää ei määritelty',
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
    data_location: 'Mene haravoituun sijaintiin',
    datasetAsFile: {
      open: 'Lataa aineiston metatieto',
      infoText:
        'Datacite without validation: Aineisto näytetään Datacite -formaatissa, mutta ilman pakollisten kenttien validointia. Aineisto ei sellaisenaan välttämättä täytä Dataciten vaatimuksia.',
    },
    draftInfo: {
      draft: 'Tämä aineisto on luonnos ja näkyy ainoastaan aineiston luojalle.',
      changes: 'Tämä on esikatselu julkaisemattomista muutoksista aineistoon ja näkyy ainoastaan aineiston luojalle.',
    },
    draftIdentifierInfo: 'Tunniste luodaan aineiston julkaisun yhteydessä.',
    dl: {
      root: 'juuri',
      breadcrumbs: 'Leivänmurut',
      category: 'Kategoria',
      dirContent: 'Kansion sisältö',
      download: 'Lataa',
      downloadFailed: 'Lataus epäonnistui',
      downloadAll: 'Lataa kaikki',
      downloadItem: 'Lataa %(name)s',
      downloading: 'Ladataan...',
      fileAmount: '%(amount)s objektia',
      close_modal: 'Sulje info',
      customMetadata: 'Metatiedot',
      info_header: 'Tiedoston muut tiedot',
      loading: 'Ladataan kansiota',
      loaded: 'Kansio latautunut',
      fileCount: {
        one: '1 tiedosto',
        other: '%(count)s tiedostoa'
      },
      file_types: {
        both: 'tiedostot ja kansiot',
        directory: 'Kansio',
        file: 'tiedosto',
      },
      files: 'Tiedostot',
      info: 'Tietoja',
      info_about: 'aineistosta: %(file)s',
      infoHeaders: {
        file: 'Tiedoston tiedot',
        directory: 'Kansion tiedot',
      },
      infoModalButton: {
        directory: {
          general: 'Kansion %(name)s tiedot',
          custom: 'Kansion %(name)s tiedot ja metatiedot',
        },
        file: {
          general: 'Tiedoston %(name)s tiedot',
          custom: 'Tiedoston %(name)s tiedot ja metatiedot',
        },
      },
      item: 'aineisto %(item)s',
      name: 'Nimi',
      size: 'Koko',
      remote: 'Ulkoinen lähde',
      checksum: 'Checksum',
      id: 'ID',
      title: 'Otsikko',
      type: 'Tyyppi',
      go_to_original: 'Siirry sivulle',
      sliced: 'Joitain tiedostoja ei näytetä tässä näkymässä tiedostojen suuren lukumäärän vuoksi',
      cumulativeDatasetLabel: 'Huom: Aineisto on kasvava',
      cumulativeDatasetTooltip: {
        header: 'Kasvava aineisto',
        info:
          'Tämä on karttuva aineisto, johon mahdollisesti vielä lisätään tiedostoja. Huomio tämä kun käytät aineistoa tai viittaat siihen (esim. ajallinen kattavuus hyvä mainita). Aineistosta ei kuitenkaan voi poistaa tai muuttaa olemassa olevia tiedostoja.',
      },
    },
    events_idn: {
      deleted_versions: {
        title: 'Poistetut Versiot',
        date: 'Poistumispäivämäärä',
        version: 'Versio',
        link_to_dataset: 'Linkki aineistoon',
      },
      events: {
        title: 'Tapahtumat',
        event: 'Tapahtuma',
        who: 'Kuka',
        when: 'Milloin',
        event_title: 'Otsikko',
        description: 'Kuvaus',
        deletionEvent: 'Aineiston poistaminen',
        deletionOfDatasetVersion: 'Poistettu aineistoversio: ',
      },
      other_idn: 'Muut tunnisteet',
      origin_identifier: 'Alkuperäisen aineiston tunniste',
      relations: {
        title: 'Relaatiot',
        type: 'Tyyppi',
        name: 'Otsikko',
        idn: 'Tunniste',
      },
    },
    map: {
      geographic_name: 'Maantieteellinen nimi',
      full_address: 'Kokonainen osoite',
      alt: 'Korkeus (m)',
    },
    doi: 'DOI',
    field_of_science: 'Tieteenala',
    funder: 'Rahoittaja',
    goBack: 'Palaa takaisin',
    identifier: 'Tunniste',
    infrastructure: 'Infrastruktuuri',
    issued: 'Julkaisupäivämäärä',
    modified: 'Aineiston muokkauspäivämäärä',
    harvested: 'Haravoitu',
    cumulative: 'Kumulatiivinen',
    keywords: 'Avainsanat',
    subjectHeading: 'Asiasanat',
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
      homepageDescr: 'Kuvaus',
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
    storedInPas: 'Tämä aineisto on pitkäaikaissäilytyksessä.',
    pasDatasetVersionExists: 'Aineisto on myös pitkäaikaissäilytyksessä: ',
    originalDatasetVersionExists: 'Aineistosta on olemassa käyttökopio: ',
    linkToPasDataset: 'Siirry pitkäaikaissäilytyksessä olevaan versioon tästä',
    linkToOriginalDataset: 'Käyttökopioon pääset tästä',
    enteringPas: 'Menemässä PAS:iin',
    dataInPasDatasetsCanNotBeDownloaded: 'PAS-aineistojen dataa ei voida ladata',
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
    cookies: {
      accept: 'Hyväksy evästeet',
      infoText: 'Käyttämällä Fairdata-palveluja hyväksyt evästiden käytön. Käytämme evästeitä palvelun kehittömiseen ja käyttökokemuksen parantamiseen.',
      link: 'Fairdata-palvelujen tietosuoja.',
    }
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
    includePas: 'Ota mukaan Fairdata PAS -datasetit',
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
    addDataset: 'Lisää/muokkaa aineistoja',
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
    saveDraft: 'Tallenna Luonnos',
    submit: 'Julkaise Aineisto',
    edit: 'Päivitä Aineisto',
    consent:
      'Käyttämällä Qvain Light -työkalua käyttäjä vakuuttaa, että hän on saanut suostumuksen muiden henkilöiden henkilötietojen lisäämiseen kuvailutietoihin ja ilmoittanut heille miten he voivat saada henkilötietonsa poistettua palvelusta. Käyttämällä Qvain Light-työkalua käyttäjä hyväksyy <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">käyttöehdot</a>.',
    submitStatus: {
      success: 'Aineisto julkaistu!',
      draftSuccess: 'Luonnos tallennettu!',
      fail: 'Jotain meni pieleen...',
      editFilesSuccess: 'Uusi aineistoversio luotu!',
      editMetadataSuccess: 'Aineiston päivitys onnistui!',
    },
    pasInfo: {
      stateInfo: 'Tämä on PAS-aineisto. Aineiston tila on "%(state)s: %(description)s".',
      editable: 'Voit muuttaa kuvauksia muttet lisätä tai poistaa tiedostoja.',
      readonly: 'Voit katsoa kuvauksia muttet tehdä muutoksia.',
    },
    pasState: {
      0: 'Odottaa tarkastusta',
      10: 'Rikastaa',
      20: 'Tarkastaa',
      30: 'Rikastus katkesi',
      40: 'Korjaa metatietoja',
      50: 'Tarkastus katkesi',
      60: 'Tarkastaa taas',
      70: 'Odottaa siirtoa',
      75: 'Metadata vahvistettu',
      80: 'Siirto aloitettu',
      90: 'Paketoi',
      100: 'Paketointi katkesi',
      110: 'Siirtää',
      120: 'OK – säilytyksessä',
      130: 'Siirto katkesi',
      140: 'Saatavilla',
    },
    useDoiHeader: 'DOI-tunnisteen luominen',
    useDoiContent:
      'Olet pyytänyt aineistollesi pysyväksi tunnisteeksi DOIn URN-tunnisteen sijaan. DOI vaatii, että julkaisupäivämäärä ja julkaisija on määritelty. DOI-tunniste rekisteröidään DataCite-palvelun tietokantaan, eikä toimintoa voi peruuttaa. Oletko varma?',
    useDoiAffirmative: 'Kyllä',
    useDoiNegative: 'Ei',
    unsuccessfullLogin: 'Kirjautuminen epäonnistui.',
    notCSCUser1:
      'Varmistakaa että teillä on voimassaoleva CSC tunnus. Jos yritit kirjautua sisään ulkoisella tunnuksella (kuten Haka) niin saatat saada tämän ' +
      'virheilmoituksen, jos tilit eivät ole linkitetty. Linkityksen voi tehdä',
    notCSCUserLink: ' CSC asiakas porttaalissa',
    notCSCUser2: ' Voit rekisteröityä Hakatunuksella tai ilman.',
    notLoggedIn: 'Kirjaudu sisään CSC -tililläsi käyttääksesi Qvain-light palvelua.',
    titleCreate: 'Lisää uusi aineisto',
    titleEdit: 'Muokkaa aineistoa',
    titleLoading: 'Ladataan aineistoa',
    titleLoadingFailed: 'Aineiston Lataus Epäonnistui',
    error: {
      permission: 'Oikeusvirhe aineiston latauksessa',
      missing: 'Aineistoa ei löydy',
      default: 'Virhe ladattaessa aineistoa',
    },
    backLink: ' Takaisin aineistolistaan',
    common: {
      save: 'Tallenna',
      cancel: 'Peruuta',
    },
    confirmClose: {
      warning: 'Sinulla on tallentamattomia muutoksia. Perutaanko muutokset?',
      confirm: 'Kyllä, peru muutokset',
      cancel: 'Ei, jatka muokkausta',
    },
    select: {
      placeholder: 'Valitse vaihtoehto',
    },
    datasets: {
      title: 'Aineistot',
      search: {
        hidden: 'Haku',
        searchTitle: 'Hakusana ao. listan filtteröimiseksi',
        placeholder: 'Suodata aineiston nimen mukaan',
      },
      help: 'Muokkaa olemassa olevaa aineistoa tai luo uusi',
      createButton: 'Lisää uusi aineisto',
      createNewVersion: 'Luo uusi versio',
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
          minutes: ' minuuttia sitten',
          oneHour: '1 tunti sitten',
          hours: ' tuntia sitten',
          oneDay: '1 päivä sitten',
          days: ' päivää sitten',
          oneMonth: '1 kuukausi sitten',
          months: ' kuukautta sitten',
          oneYear: '1 vuosi sitten',
          years: ' vuotta sitten',
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
          cancel: 'Peruuta'
        }
      },
      goToEtsin: 'Katso Etsimessä',
      goToEtsinDraft: 'Esikatsele Etsimessä',
      openNewVersion: 'Avaa uusi versio',
      noDatasets: 'Sinulla ei ole olemassa olevia aineistoja',
      reload: 'Lataa uudelleen',
      loading: 'Lataa...',
      errorOccurred: 'Virhe tapahtui',
      tableHeader: 'Luodut aineistot',
    },
    description: {
      title: 'Kuvaus',
      infoTitle: 'Kuvaus info',
      infoText:
        'Anna aineistolle kuvaava ja yksilöivä nimi. Kirjoita myös kuvaus mahdollisimman tarkasti. Kerro miten aineisto on syntynyt, mihin tarkoitukseen, miten se rakentuu ja miten sitä on käsitelty. Kerro myös sisällöstä, mahdollisista puutteista ja rajauksista.',
      fieldHelpTexts: {
        requiredForAll: 'Pakollinen kenttä kaikille aineistoille',
        requiredToPublish: 'Pakollinen kenttä julkaistaville aineistoille',
      },
      description: {
        langEn: 'ENGLANTI',
        langFi: 'SUOMI',
        title: {
          label: 'Otsikko',
          placeholderFi: 'Otsikko (Suomi)',
          placeholderEn: 'Otsikko (Englanti)',
        },
        description: {
          label: 'Kuvaus',
          placeholderFi: 'Kuvaus (Suomi)',
          placeholderEn: 'Kuvaus (Englanti)',
        },
        instructions: 'Vain yksi kielivalinta on pakollinen',
      },
      issuedDate: {
        title: 'Julkaisupäivämäärä',
        infoText: 'Lähteen muodollinen julkaisupäivämäärä. Ei vaikuta aineston näkyvyyteen. Jos kenttä jätetään tyhjäksi, käytetään nykyistä päivämäärää.',
        instructions: '',
        placeholder: 'Päivämäärä',
      },
      otherIdentifiers: {
        title: 'Muut tunnisteet',
        infoText:
          'Jos aineistollasi on jo tunniste (tai useita), yleensä esim. DOI, anna ne tässä. Olemassaolevien tunnisteiden lisäksi aineisto saa tallennusvaiheessa pysyvän tunnisteen, joka tulee resolvoitumaan Etsimen laskeutumissivulle.',
        instructions:
          'Metadatan tunniste luodaan automaattisesti mutta jos on jo OLEMASSA OLEVA tunniste, syötä se tähän.',
        addButton: 'Lisää tunniste',
        alreadyAdded: 'Tunniste on jo lisätty',
      },
      fieldOfScience: {
        title: 'Tieteenala',
        infoText:
          'Valitse tieteenala. Alasvetovalikkosa on Opetus- ja Kulttuuriministeriön mukainen luokitus tieteenaloille.',
        placeholder: 'Valitse vaihtoehto',
        addButton: 'Lisää tieteenala',
        help: 'Voit lisätä useita tieteenaloja.',
      },
      datasetLanguage: {
        title: 'Aineiston kieli',
        infoText: 'Valitse aineistossa käytetyt kielet.',
        placeholder: 'Hae kieliä kirjoittamalla',
        noResults: 'Ei hakutuloksia',
        addButton: 'Lisää kieli',
        help: 'Voit lisätä useita kieliä.'
      },
      keywords: {
        title: 'Avainsanat',
        infoText:
          'Vapaat hakusanat aineistollesi. Vaikuttaa aineistosi löytymiseen Etsimen haussa. Käytä mahdollisimman tarkkoja termejä. Tässä kentässä ei ole automaattista käännöstä eri kielille.',
        placeholder: 'Esim. taloustiede',
        addButton: 'Lisää avainsanoja',
        help:
          'Voit lisätä useamman avainsanan erottamalla ne pilkulla (,). Aineistolla on oltava vähintään yksi avainsana.',
      },
      error: {
        title: 'Otsikko on pakollinen ainakin yhdellä kielellä.',
        description: 'Kuvaus on pakollinen ainakin yhdellä kielellä.',
      },
    },
    rightsAndLicenses: {
      title: 'Oikeudet ja lisenssit',
      infoTitle: 'Oikeudet ja lisenssit info',
      accessType: {
        title: 'Pääsyoikeus',
        infoText:
          'Tällä kentällä määrittelet, miten aineiston (tiedostot) saa käyttöönsä. Tämä kenttä ei vaikuta siihen, miten tämä kuvailu näkyy. Kuvailu näkyy aina automaattisesti Etsimessä julkaisun jälkeen. Jos valitset jotain muuta kuin Avoin (Open), myös syy, miksi tiedostojen latausta on rajoitettu (Restricition Grounds) on pakollinen tieto. Jos valitse "Embargo", määrittele myös embargon expiroitumisajankohta.',
        placeholder: 'Valitse vaihtoehto',
        permitInfo:
          'Aineiston omistaja (alkuperäinen kuvailun tekijä) pystyy oletuksena hyväksymään aineiston datan käyttöön liittyvät käyttölupahakemukset. Käyttölupatoimintoa kehitetään, ja jossain vaiheessa tullaan lisäämään mahdollisuus myös muiden ko. organisaation edustajien päästä, joko omistajan lisäksi tai sijaan, hyväksymään käyttölupahakemuksia. Valitsemalla pääsyoikeudeksi "Vaatii luvan hakemista" / "Requires permission" käyttäjä sitoutuu näihin muutoksiin.',
      },
      embargoDate: {
        label: 'Embargo loppumispäivämäärä',
        placeholder: 'Päivämäärä',
        help: 'Oletuksena embargo ei lopu jollei päivämäärää aseteta.',
      },
      restrictionGrounds: {
        title: 'Saatavuutta rajoitettu',
        placeholder: 'Valitse vaihtoehto',
        text: 'Jos pääsyoikeus tyyppi ei ole Avoin, valitse rajoituksen syy.',
      },
      license: {
        title: 'Lisenssi',
        infoText:
          'Lisenssi on tärkeä osa aineiston kuvailua. Lisenssillä määrittelet, miten aineistoa voi käyttää. Oletuksena on valittuna suositeltu CC BY 4.0. Jos haluat alasvetovalikosta valinnan sijaan määrittää lisenssin URL -osoitteen itse, valitse alasvetovalikosta "Muu (URL)", minkä jälkeen pääset kirjoittamaan URL-osoitteen.',
        placeholder: 'Valitse vaihtoehto',
        other: {
          label: 'URL',
          help: 'Anna osoite lisenssille.',
        },
      },
    },
    actors: {
      title: 'Toimijat',
      infoTitle: 'Toimijat info',
      addButton: 'Lisää uusi toimija',
      infoText:
        'Tutkimukseen tai aineiston tekemiseen osallistuneet henkilöt ja organisaatiot. Voit määrittää tekijät (pakollinen), Julkaisijan, Kuraattorit, Oikeuksienhaltijat sekä Muut tekijät. Valitse ensin, onko kyseessä henkilö vai organisaatio. Määritä sen jälkeen, missä roolissa ko. toimija osallistui tutkimukseen (voit valita useita), ja määritä sen jälkeen tarvittavat tiedot. Jos kyseessä on henkilö, on organisaatiotieto pakollinen tieto. Jo annettuja tietoja pääset muuttamaan klikkaamalla tallennetun toimijan kohdalla kynä -ikonia.',
      errors: {
        loadingReferencesFailed: 'Referenssiorganisaatioiden latauksessa tapahtui virhe.',
      },
      add: {
        title: 'Toimijat',
        action: {
          create: 'Lisää toimija',
          edit: 'Muokkaa toimijaa',
        },
        groups: {
          type: 'Toimijan tyyppi',
          roles: 'Roolit',
          info: 'Tiedot',
        },
        help:
          'Aineistolla on oltava ainakin yksi tekijä. Huomioi että yksittäisellä toimijalla voi olla useampi rooli.',
        radio: {
          person: 'Luonnollinen henkilö',
          organization: 'Organisaatio',
        },
        checkbox: {
          creator: 'Tekijä',
          publisher: 'Julkaisija',
          curator: 'Kuraattori',
          rights_holder: 'Oikeuksienhaltija',
          contributor: 'Muu tekijä',
        },
        name: {
          placeholder: {
            organization: 'Nimi',
            person: 'Etu- ja sukunimi',
          },
          label: 'Nimi',
        },
        email: {
          placeholder: 'Sähköposti',
          label: 'Sähköposti',
        },
        identifier: {
          label: 'Tunniste',
          placeholder: 'esim. http://orcid.org',
        },
        organization: {
          label: 'Organisaatio',
          placeholder: 'Esim. Helsingin yliopisto',
          placeholderChild: '+ Lisää osasto tai yksikkö',
          loading: 'Ladataan organisaatioita...',
          labels: {
            name: 'Organisaation nimi',
            email: 'Organisaation sähköposti',
            identifier: 'Organisaation tunniste',
          },
          options: {
            create: 'Lisää uusi organisaatio',
            dataset: 'Aineiston organisaatiot',
            presets: 'Organisaatiot',
          },
        },
        save: {
          label: 'Lisää toimija',
        },
        cancel: {
          label: 'Peruuta',
        },
        newOrganization: {
          label: 'Lisää',
        },
      },
      added: {
        title: 'Lisätyt toimijat',
        noneAddedNotice: 'Toimijoita ei ole lisätty.',
      },
    },
    validationMessages: {
      title: {
        string: 'Otsikon tulisi olla arvoltaan merkkijono.',
        max: 'Otsikko on liian pitkä.',
        required: 'Otsikko on pakollinen vähintään yhdellä kielellä.',
      },
      description: {
        string: 'Kuvaus tulisi olla arvoltaan merkkijono.',
        max: 'Kuvaus on liian pitkä.',
        required: 'Kuvaus on pakollinen vähintään yhdellä kielellä.',
      },
      issuedDate: {
        requiredIfUseDoi:
          'Julkaisupäivämäärä on pakollinen kenttä jos haluat käyttää DOI -tunnistetta.',
      },
      otherIdentifiers: {
        string: 'Tunnisteet tulisivat olla arvoltaan merkkijonoja.',
        url: 'Tunnisteet täytyy olla valideja URL:eja',
        max: 'Tunniste on liian pitkä.',
        min: 'Tunnisteen pitää olla vähintään 10 merkkiä pitkä.',
      },
      fieldOfScience: {},
      keywords: {
        string: 'Avainsanat tulisi olla arvoltaan merkkijonoja.',
        max: 'Avainsana on liian pitkä.',
        required: 'Vähintään yksi avainsana on pakollinen.',
      },
      actors: {
        type: {
          mixed: '',
          oneOf: 'Toimijan tyyppi pitää olla joko "Luonnollinen henkilö" tai "Organisaatio".',
          required: 'Toimijan tyyppi on pakollinen.',
        },
        roles: {
          mixed: '',
          oneOf:
            'Roolin kuuluisi olla "Tekijä", "Julkasija", "Kuraattori", "Oikeuksienhaltija" tai "Muut tekijät".',
          required: 'Tekijän rooli on pakollinen.',
        },
        name: {
          string: 'Nimi pitää olla arvoltaan merkkijono.',
          max: 'Nimi on liian pitkä.',
          required: 'Nimi on pakollinen kenttä.',
        },
        email: {
          string: 'Sähköposti pitää olla arvoltaan merkkijono.',
          max: 'Sähköposti on liian pikä.',
          email: 'Lisää validi sähköposti.',
          nullable: '',
        },
        identifier: {
          string: '',
          max: 'Tunniste on liian pitkä.',
          nullable: '',
        },
        organization: {
          mixed: '',
          object: 'Valitun organisaation tulee olla olio.',
          name: 'Organisaation nimen tulee olla merkkijono.',
          required: 'Organisaatio on pakollinen kenttä.',
        },
        requiredActors: {
          atLeastOneActor: 'Aineistoon on lisättävä vähintään yksi toimija.',
          mandatoryActors:
            'Toimijat: Aineistolla on oltava ainakin yksi tekijä. Huomioi: yksittäisellä toimijalla voi olla useampi rooli.',
          publisherIfDOI: 'Toimijat: DOI-ainestoon on lisättävä julkaisija.',
        },
      },
      accessType: {
        string: 'Pääsyoikeus tulisi olla arvoltaan merkkijono.',
        url: 'Virhe pääsyoikeuden referenssiarvossa.',
        required: 'Pääsyoikeus on pakollimen kenttä.',
      },
      restrictionGrounds: {
        string: 'Kentän arvo tulisi olla merkkijono.',
        url: 'Virhe satavuutta rajoitettu-kentän referenssiarvossa.',
        required: 'Saatavuutta rajoitettu on pakollinen kenttä jos pääsyoikeus ei ole "Avoin".',
      },
      license: {
        requiredIfIDA: 'Lisenssi on pakollinen kenttä kun tiedoston lähde on IDA.',
        otherUrl: {
          string: 'Lisenssin URL pitää olla merkkijono.',
          url: 'Lisenssin URL pitää olla oikeanlainen URL.',
          required: 'Lisenssin URL on pakollinen kenttä.',
        },
      },
      files: {
        dataCatalog: {
          required: 'Tiedoston lähde on pakollinen kenttä.',
        },
        file: {
          title: {
            required: 'Tiedoston otsikko on pakollinen kenttä.',
          },
          description: {
            required: 'Tiedoston kuvaus on pakollinen kenttä.',
          },
          useCategory: {
            required: 'Tiedoston käyttökategoria on pakollinen kenttä.',
          },
        },
        directory: {
          title: {
            required: 'Hakemiston otsikko on pakollinen kenttä.',
          },
          useCategory: {
            required: 'Hakemiston käyttökategoria on pakollinen kenttä.',
          },
        },
      },
      externalResources: {
        title: {
          required: 'Ulkoisen aineiston otsikko on pakollinen kenttä.',
        },
        useCategory: {
          required: 'Ulkoisen aineiston käyttökategoria on pakollinen kenttä.',
        },
        accessUrl: {
          validFormat: 'Ulkoisen aineiston sivun URL pitää olla oikeassa URL-formaatissa.',
        },
        downloadUrl: {
          validFormat: 'Ulkoisen aineiston latauslinkin URL pitää olla oikeassa URL-formaatissa.',
        },
      },
    },
    files: {
      title: 'Tiedostot',
      infoTitle: 'Tiedostot info',
      infoText: 'Lisää texti',
      deletedLabel: 'Poistettu',
      error: {
        title: 'Virhe ladattaessa tiedostoja',
        retry: 'Yritä uudelleen',
      },
      dataCatalog: {
        label: 'Tiedoston lähde',
        infoText:
          'Ennenkuin pääset linkittämään tiedostoja aineistoosi, sinun tulee valita, linkitätkö tiedostoja IDAsta vai annatko ulkopuolisen palvelun URL-osoitteet, joista tiedostot löytyvät.',
        explanation:
          'Valitse "IDA", jos tiedostot on tallennettu Fairdata IDA -palveluun. Valitse "Ulkoinen lähde" jos tiedostot sijaitsevat muualla.',
        doiSelection:
          'Haluan aineistolleni DOI-tunnisteen (digital object identifier) URN-tunnisteen sijaan.',
        doiSelectedHelp:
          'Aineistolle luodaan julkaisun yhteydessä DOI-tunniste, joka rekisteröidään DataCite-palvelun tietokantaan, eikä toimintoa voi peruuttaa.',
        placeholder: 'Valitse vaihtoehto',
        ida: 'IDA',
        att: 'Ulkoinen lähde',
        pas: 'PAS',
      },
      cumulativeState: {
        label: 'Kasvava aineisto',
        radio: {
          no:
            'Ei. (Uusia tiedostoja tai kansioita ei voi lisätä ilman, että aineistosta syntyy uusi versio.)',
          yes:
            'Kyllä. (Tiedostoja tai kansioita tullaan lisäämään aineistoon. Lisäys ei aiheuta uuden version syntymistä.)',
          note:
            'Huom! Julkaistua aineistoa ei voi muuttaa kasvavaksi ilman, että syntyy uusi versio. Kasvavan aineiston muuttaminen ei-kasvavaksi on sen sijaan sallittua.',
        },
        enabled: {
          state: 'Tämä aineisto on julkaistu kasvavana aineistona.',
          explanation:
            'Kasvavaan aineistoon lisätään dataa säännöllisesti. Jos aineistoon ei enää lisätä dataa, se kannattaa muuttaa ei-kasvavaksi.',
          button: 'Muuta ei-kasvavaksi',
          note:
            'Huom! Jos muutat kasvavan aineiston ei-kasvavaksi, et voi enää muuttaa sitä takaisin ilman, että syntyisi uusi versio.',
          confirm:
            'Oletko varma, että haluat muuttaa kasvavan aineiston ei-kasvavaksi? Muutos ei aiheuta uuden version syntymistä, mutta jos aineisto myöhemmin vaihdetaan takaisin kasvavaksi, syntyy automaattisesti uusi versio.',
          cancel: 'Peruuta',
        },
        disabled: {
          state: 'Aineisto on julkaistu tavallisena, ei-kasvavana aineistona.',
          explanation:
            'Jos aineistoon lisätään tiedostoja tai hakemistoja, siitä syntyy automaattisesti uusi versio.',
          button: 'Muuta kasvavaksi',
          note:
            'Huom! Jos muutat tavallisen aineiston kasvavaksi aineistoksi, siitä tehdään automaattisesti uusi versio. Vanha versio jää tavalliseksi, ja uudesta tulee kasvava aineisto.',
          confirm:
            'Oletko varma, että haluat tehdä aineistosta kasvavan? Muutos aiheuttaa uuden version syntymisen ja uu. Uudella versiolla on aina uusi tunniste.',
          cancel: 'Peruuta',
        },
        modalHeader: 'Muuta aineiston kasvavuutta',
        closeButton: 'Sulje',
        changes: 'Aineistoon tehdyt muutokset on tallennettava ennen tämän asetuksen muuttamista.',
      },
      responses: {
        fail: 'Jotain meni pieleen...',
        changeComplete: 'Toiminto suoritettu.',
        versionCreated: 'Aineistosta on luotu uusi versio tunnisteella %(identifier)s.',
        openNewVersion: 'Avaa uusi versio',
      },
      addItemsModal: {
        allSelected: 'Kaikki projektin tiedostot ja hakemistot ovat jo aineistossa.',
        title: 'Lisää tiedostoja projektista',
        buttons: {
          save: 'Lisää tiedostot',
          close: 'Sulje',
        },
        versionInfo:
          'Tiedostojen tai hakemistojen lisääminen tai poistaminen synnyttää julkaistusta aineistosta uuden version kun muutokset julkaistaan. Vanha versio pysyy muuttumattomana ja siihen lisätään "vanha"-tagi.',
      },
      refreshModal: {
        header: 'Päivitä kansion tiedostot',
        noncumulative:
          'Mikäli kansioon on lisätty uusia tiedostoja, toiminto lisää ne aineistoon ja luo siitä uuden version.',
        cumulative:
          'Toiminto lisää kansioon lisätyt tiedostot aineistoon. Muutos näkyy välittömästi aineiston julkaistussa versiossa.',
        changes: 'Aineistoon tehdyt muutokset on tallennettava ensin.',
        buttons: {
          show: 'Päivitä kansion tiedostot',
          ok: 'Päivitä',
          cancel: 'Peruuta',
          close: 'Sulje',
        },
      },
      fixDeprecatedModal: {
        statusText:
          'Aineisto on vanhentunut. Jotkin aineiston tiedostot eivät ole enää saatavilla.',
        header: 'Korjaa vanhentunut aineisto',
        help:
          'Tämä toiminto korjaa aineiston poistamalla siitä kaikki tiedostot ja hakemistot jotka eivät ole enää saatavilla. Aineistosta tehdään uusi versio.',
        changes: 'Aineistoon tehdyt muutokset on tallennettava ennen tätä toimintoa.',
        buttons: {
          show: 'Korjaa vanhentunut aineisto',
          ok: 'Korjaa aineisto',
          cancel: 'Peruuta',
          close: 'Sulje',
        },
      },
      metadataModal: {
        header: 'Muokkaa PAS-metadataa',
        help:
          'Datan tallentaminen päivittää tiedoston metadatan riippumatta siitä onko se aineistossa.',
        csvOptions: 'CSV-määritykset',
        fields: {
          fileFormat: 'Tiedostomuoto',
          formatVersion: 'Tiedostomuodon versio',
          encoding: 'Merkistökoodaus',
          csvDelimiter: 'Sarake-erotin',
          csvRecordSeparator: 'Rivierotin',
          csvQuotingChar: 'Lainausmerkki',
          csvHasHeader: 'Sisältää otsikkorivin',
        },
        errors: {
          formatVersionRequired: 'Versio puuttuu tai on epäkelpo valitulle tiedostomuodolle.',
          formatVersionNotAllowed: 'Valitulle tiedostomuodolle ei voi asettaa versiota.',
          loadingFileFormats: 'Tiedostomuotolistan hakeminen epäonnistui.',
        },
        buttons: {
          show: 'Muokkaa PAS-metadataa',
          close: 'Sulje',
          save: 'Tallenna muutokset',
          hideError: 'Jatka muokkausta',
        },
        options: {
          delimiter: {
            tab: 'Tab',
            space: 'Välilyönti',
            semicolon: 'Puolipiste ;',
            comma: 'Pilkku ,',
            colon: 'Kaksoispiste :',
            dot: 'Piste .',
            pipe: 'Pystyviiva |',
          },
          header: {
            false: 'Ei',
            true: 'Kyllä',
          },
        },
        placeholders: {
          noOptions: 'Ei vaihtoehtoja saatavilla',
          selectOption: 'Valitse yksi',
          csvQuotingChar: 'Kirjoita merkki',
        },
      },
      help:
        'Aineistoon kuuluvat tiedostot. Aineistoon voi kuulua vain joko IDAssa olevia tiedostoja tai ulkopuolisia tiedostoja. Tiedostojen metadata ei ole osa aineistojen metadataa, joten muista tallentaa muutokset jotka teet tiedostojen metadataan.',
      ida: {
        title: 'Fairdata IDA tiedostot',
        infoText:
          'Jos linkität IDA-tiedostoja, sinun tulee ensin valita IDA-projekti, minkä jälkeen näet ko. projektiin kuuluvat tiedostot ja hakemistot. Kun olet valinnut haluamasi projektin, sivu listaa sinulle ko. projektin sisältämät jäädytetyt hakemistot ja tiedostot. Valitse listasta ne hakemistot ja tiedostot, jotka haluat liittää aineistoosi. Jos liität hakemistot, KAIKKI sen alla olevat tiedostot liitetään aineistoon (älä siinä tapauksessa valitse hakemiston alta enää yksittäisiä tiedostoja).',
        help: 'Jos sinulla on tiedostoja Fairdata IDA:ssa, voit liittää ne tässä:',
        button: {
          label: 'Liitä tiedostoja Fairdata IDA:sta',
        },
      },
      projectSelect: {
        placeholder: 'Valitse projekti',
        loadError: 'Projektin hakemistojen lataus epäonnistui, virhe: ',
        loadErrorNoFiles:
          'Tiedostoja ei löytynyt. Jos haluat saada tiedostot näkyviin, tarkista että olet jäädyttänyt kyseessä olevat tiedostot IDA:ssa.',
      },
      selected: {
        title: 'Valitut tiedostot',
        readonlyTitle: 'Valitut tiedostot projektista %(project)s',
        none: 'Tiedostoja tai hakemistoja ei ole vielä valittu.',
        newTag: 'Lisätään',
        removeTag: 'Poistetaan',
        hideRemoved: 'Piilota poistettavat',
        buttons: {
          edit: 'Muokkaa %(name)s',
          remove: 'Poista %(name)s',
          undoRemove: 'Peru %(name)s poisto',
          refresh: 'Päivitä %(name)s',
          open: 'Avaa %(name)s',
          close: 'Sulje %(name)s',
          select: 'Valitse %(name)s',
          deselect: 'Poista valinta %(name)s',
        },
        addUserMetadata: 'Lisää metadataa',
        editUserMetadata: 'Muokkaa metadataa',
        deleteUserMetadata: 'Poista metadata',
        form: {
          title: {
            label: 'Otsikko',
            placeholder: 'Otsikko',
          },
          description: {
            label: 'Kuvaus',
            placeholder: 'Kuvaus',
          },
          use: {
            label: 'Käyttökategoria',
            placeholder: 'Valitse vaihtoehto',
          },
          fileType: {
            label: 'Tiedostotyyppi',
            placeholder: 'Valitse vaihtoehto',
          },
          identifier: {
            label: 'Tunniste',
          },
        },
      },
      existing: {
        title: 'Aikaisemmin valitut tiedostot',
        help: {
          noncumulative:
            'Nämä ovat sinun aiemmin valitsemia tiedostoja. Jos olet liittänyt aineistoosi hakemiston, sen sisältöä ei automaattisesti päivitetä, vaikka sen sisältö olisi muuttunut IDAssa. Jos haluat lisätä puuttuvia tiedostoja, valitse ne tiedostolistasta. HUOM! Tiedostojen lisääminen luo aineistostasi uuden version.',
          cumulative:
            'Nämä ovat sinun aiemmin valitsemia tiedostoja. Jos olet liittänyt aineistoosi hakemiston, sen sisältöä ei automaattisesti päivitetä, vaikka sen sisältö olisi muuttunut IDAssa. Jos haluat lisätä puuttuvia tiedostoja, valitse ne tiedostolistasta. Voidaksesi poistaa tiedostoja aineisto on ensin muutettava ei-kumulatiiviseksi.',
          pasEditable:
            'Nämä ovat aineiston tiedostot. Voit muuttaa tiedostojen metatietoja muttet lisätä tai poistaa tiedostoja.',
          pasReadonly:
            'Nämä ovat aineiston tiedostot. Voit katsella tiedostojen metatietoja muttet tehdä muutoksia.',
        },
      },
      notificationNewDatasetWillBeCreated: {
        header: 'Tiedostojen ja kansioiden muokkaaminen',
        content:
          'Jos julkaistuun aineistoon lisätään tiedostoja tai hakemistoja, tai siitä poistetaan tiedostoja tai hakemistoja, ko. aineistosta syntyy automaattisesti uusi versio. Vanha versio pysyy muuttumattomana ja siihen lisätään "vanha" -tagi. Jos julkaistu aineisto ei sisältänyt yhtään tiedostoa, voit lisätä tiedostoja ja/tai hakemistoja yhden kerran ilman, että uusi versio syntyy.',
      },
      external: {
        title: 'Ulkoiset tiedostot (ATT)',
        infoText:
          'Määritä tiedostolle otsikko, käyttökategoria (alasvetovalikosta) sekä, kerro, mistä tiedosto / sen lisenssitieto löytyvät (sivun URL). Voit antaa myös suoran latauslinkin, jos sellainen on. Tiedostoa ei ladata Qvain Lightiin, vaan antamasi sivun URL toimii linkkinä sivulle, jossa tiedosto sijaitsee sekä tiedoston latauslinkin kauttaja pääsee suoraan aloittamaan tiedoston lataamisen omalle koneelleen.',
        help: 'Lisää linkkejä ulkoisiin tiedostoihin:',
        button: {
          label: 'Lisää linkki ulkoiseen tiedostoon',
        },
        addedResources: {
          title: 'Lisätyt ulkoiset tiedostot',
          none: 'Tiedostoja ei ole lisätty',
        },
        form: {
          title: {
            label: 'Otsikko',
            placeholder: 'Tiedoston nimi',
          },
          useCategory: {
            label: 'Käyttökategoria',
            placeholder: 'Valitse vaihtoehto',
          },
          accessUrl: {
            label: 'Sivun URL',
            placeholder: 'https://',
            infoText:
              'Sivu, jossa tiedoston linkki ja tiedostoon mahdollisesti liittyvä lisenssitieto sijaitsevat',
          },
          downloadUrl: {
            label: 'Latauslinkki',
            placeholder: 'https://',
            infoText: 'Linkki, jolla tiedoston saa ladattua suoraan omalle koneelle',
          },
          cancel: {
            label: 'Tyhjennä kentät',
          },
          save: {
            label: 'Lisää ulkoinen lähde',
          },
          add: {
            label: 'Lisää',
          },
        },
      },
    },
    history: {
      title: 'Aineistoon liittyvä materiaali ja historia',
      tooltip: 'Aineestoon liittyvä materiaali ja historia info',
      tooltipContent: {
        reference: {
          title: 'Viittaukset',
          paragraph:
            'Viittaukset muihin aineistoihin, julkaisuihin tai muihin resursseihin, jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa. ',
        },
        provience: {
          title: 'Historiatiedot',
          paragraph: 'Tiedot aineiston historiasta eli provenienssista.',
        },
        infrastructure: {
          title: 'Infrastruktuuri',
          paragraph: 'Palvelut tai työkalut, joita aineiston tuottamisessa on hyödynnetty.',
        },
      },
      infrastructure: {
        addButton: 'Lisää infrastruktuuri',
        title: 'Infrastruktuuri',
        description:
          'Voit lisätä palveluita tai rakenteita joita on käytetty aineiston laatimiseen.',
      },
    },
    temporalAndSpatial: {
      title: 'Ajallinen ja maantieteellinen kattavuus',
      tooltip: 'Ajallinen ja maantieteellinen kattavuus info',
      tooltipContent: {
        spatial: {
          title: 'Maantieteellinen kattavuus',
          paragraph: 'Alue jonka aineisto kattaa. Esimerkiksi paikat, joissa on tehty havaintoja. ',
        },
        temporal: {
          title: 'Ajallinen kattavuus',
          paragraph:
            'Ajanjakso, minkä aineisto kattaa, esimerkiksi aika jolloin on tehty havaintoja.',
        },
      },
      spatial: {
        title: 'Maantieteellinen kattavuus',
        description: 'Alue jonka aineisto kattaa. Esimerkiksi paikat, joissa on tehty havaintoja. ',
        addButton: 'Lisää maantieteellinen kattavuus',
        error: {
          nameRequired: 'Nimi on pakollinen kenttä.',
          altitudeNan: 'Korkeus täytyy olla numero',
        },
        modal: {
          title: {
            add: 'Lisää maantieteellinen kattavuus',
            edit: 'Muokkaa maantieteellistä kattavuutta',
          },
          buttons: {
            addGeometry: 'Lisää geometria',
            save: 'Tallenna',
            cancel: 'Peruuta',
          },
          nameInput: {
            label: 'Nimi',
            placeholder: 'Alueen nimi',
          },
          altitudeInput: {
            label: 'Korkeus',
            placeholder: 'Alueen korkeus ilmoitettuna WGS84 -referenssin mukaan',
          },
          addressInput: {
            label: 'Osoite',
            placeholder: 'Koko osoite',
          },
          geometryInput: {
            label: 'Geometria',
            placeholder: 'Geometria WKT-muodossa WGS84 -referenssin mukaan',
          },
          locationInput: {
            label: 'Paikka',
            placeholder: 'Etsi paikkoja hakusanalla',
          },
        },
      },
    },
  },
  slogan: 'Tutkimustenhaku palvelu',
  stc: 'Siirry sivun pääsisältöön',
  stsd: 'Siirry "Julkaise Aineisto"-nappiin',
  tombstone: {
    removedInfo: 'Aineisto on poistettu',
    deprecatedInfo: 'Aineisto on vanhentunut',
    urlToNew: 'Aineistosta on olemassa uudempi, julkaistu versio. Saat sen avattua ',
    urlToOld: 'Aineistosta on olemassa vanhempi, julkaistu versio. Saat sen avattua ',
    link: 'tästä',
  },
  userAuthenticationError: {
    header: 'Kirjautuminen epäonnistui.',
    content:
      'Tarkistathan, että sinulla on voimassaoleva CSC-tunnus (Qvaimen ja Qvain Lightin käyttö vaatii sen). Jos yritit kirjaututua jollain toisella tunnuksella (esim. Haka), sitä ei todennäköisesti ole liitetty CSC-tunnukseen. Lisäohjeita CSC-tunnuksen rekisteröimiseksi: https://docs.csc.fi/#accounts/how-to-create-new-user-account/',
  },
  userHomeOrganizationErrror: {
    header: 'Kirjautuminen epäonnistui.',
    content:
      'Tunnusta ei ole liitetty mihinkään kotiorganisaatioon. Olethan yhteydessä CSC:n asiakaspalveluun.',
  },
}

export default finnish
