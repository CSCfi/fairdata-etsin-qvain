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
    datasetAsFile: {
      open: 'Avaa tiedostona',
      infoText: 'Datacite without validation: Aineisto näytetään Datacite -formaatissa, mutta ilman pakollisten kenttien validointia. Aineisto ei sellaisenaan välttämättä täytä Dataciten vaatimuksia.'
    },
    dl: {
      root: 'juuri',
      breadcrumbs: 'Leivänmurut',
      category: 'Kategoria',
      dirContent: 'Kansion sisältö',
      download: 'Lataa',
      downloadFailed: 'Lataus epäonnistui',
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
      sliced: 'Joitain tiedostoja ei näytetä tässä näkymässä tiedostojen suuren lukumäärän vuoksi',
      cumulativeDatasetLabel: 'Huom: Aineisto on kasvava',
      cumulativeDatasetTooltip: {
        header: 'Kasvava aineisto',
        info: 'Tämä on karttuva aineisto, johon mahdollisesti vielä lisätään tiedostoja. Huomio tämä kun käytät aineistoa tai viittaat siihen (esim. ajallinen kattavuus hyvä mainita). Aineistosta ei kuitenkaan voi poistaa tai muuttaa olemassa olevia tiedostoja.',
      },
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
      origin_identifier: 'Alkuperäisen aineiston tunniste',
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
    storedInPas: 'Tämä ainesto on säilytetty Fairdata PAS:issa.',
    pasDatasetVersionExists: 'Fairdata PAS-versio tästä aineistosta on olemassa: ',
    originalDatasetVersionExists: 'Alkuperäinen versio tästä aineistosta on olemassa: ',
    linkToPasDataset: 'Linkki',
    linkToOriginalDataset: 'Linkki',
    enteringPas: 'Menemässä PAS:iin',
    dataInPasDatasetsCanNotBeDownloaded: 'PAS-aineistojen dataa ei voida ladata'
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
    includePas: 'Ota mukaan Fairdata PAS-datasettejä',
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
    submit: 'Julkaise Aineisto',
    edit: 'Päivitä Aineisto',
    consent: 'Käyttämällä Qvain Lightia käyttäjä hyväksyy, että hän on pyytänyt suostumusta kaikilta henkilöiltä, joiden hankilökohtaisia tietoja käyttäjä lisää kuvattaviin tietoihin, ja ilmoitti heille, miten he voivat saada tietonsa poistettua. Käyttämällä Qvain Lightia käyttäjä hyväksyy <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">käyttöehdot</a>.',
    submitStatus: {
      success: 'Aineisto julkaistu!',
      fail: 'Jotain meni pieleen...',
      editSuccess: 'Uusi aineisto versio luotu!',
      editMetadataSuccess: 'Aineisto päivitys onnistui!',
    },
    unsuccessfullLogin: 'Kirjautuminen epäonnistui.',
    notCSCUser1:
      'Varmistakaa että teillä on voimassaoleva CSC tunnus. Jos yritit kirjautua sisään ulkoisella tunnuksella (kuten Haka) Niin saatat saada tämän virhe ilmoituksen jos titlit eivät ole linkitetty. Linkityksen voi tehdä',
    notCSCUserLink: ' CSC asiakas porttaalissa',
    notCSCUser2: ' Voit rekisteröityä Hakatunuksella tai ilman.',
    notLoggedIn: 'Kirjaudu sisään CSC -tililläsi käyttääksesi Qvain-light palvelua.',
    titleCreate: 'Julkaise Aineisto',
    titleEdit: 'Muokkaa Aineistoa',
    backLink: ' Takaisin aineistolistaan',
    common: {
      save: 'Tallenna',
      cancel: 'Peruuta',
    },
    datasets: {
      title: 'Aineistot',
      search: 'Haku',
      help: 'Muokkaa olemassa olevaa aineistoa tai luo uusi',
      createButton: 'Luo aineisto',
      tableRows: {
        id: 'ID',
        title: 'Otsikko',
        version: 'Versio',
        modified: 'Muokattu',
        created: 'Luotu',
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
      oldVersion: 'Vanha',
      latestVersion: 'Uusin',
      editButton: 'Muokkaa',
      deleteButton: 'Poista',
      confirmDelete: 'Oletko varma, että haluat poistaa aineiston? Aineiston poiston jälkeen se ei enää näy Qvaimessa eikä Etsimen haku löydä sitä. Aineiston laskeutumissivua ei poisteta.',
      goToEtsin: 'Katso Etsimessä',
      noDatasets: 'Sinulla ei ole olemassa olevia aineistoja',
      reload: 'Lataa uudelleen',
      loading: 'Lataa...',
      errorOccurred: 'Virhe tapahtui',
    },
    general: {
      langEnglish: 'Englanti',
      langFinnish: 'Suomi',
    },
    description: {
      title: 'Kuvaus',
      infoTitle: 'Kuvaus info',
      infoText: 'Anna aineistolle kuvaava ja yksilöivä nimi. Kirjoita myös kuvaus mahdollisimman tarkasti. Kerro miten aineisto on syntynyt, mihin tarkoitukseen, miten se rakentuu ja miten sitä on käsitelty. Kerro myös sisällöstä, mahdollisista puutteista ja rajauksista.',
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
      otherIdentifiers: {
        title: 'Muut tunnisteet',
        infoText: 'Jos aineistollasi on jo tunniste (tai useita), yleensä esim. DOI, anna ne tässä. Olemassaolevien tunnisteiden lisäksi aineisto saa tallennusvaiheessa pysyvän tunnisteen, joka tulee resolvoitumaan Etsimen laskeutumissivulle.',
        instructions:
          'Metadatan tunniste luodaan automaattisesti mutta jos on jo OLEMASSA OLEVA tunniste, syötä se tähän.',
        addButton: '+ Lisää uusi',
        alreadyAdded: 'Tunniste on jo lisätty',
      },
      fieldOfScience: {
        title: 'Tutkimusala',
        infoText: 'Valitse tieteenala. Alasvetovalikkosa on Opetus- ja Kulttuuriministeriön mukainen luokitus tieteenaloille.',
        placeholder: 'Valitse vaihtoehto',
      },
      keywords: {
        title: 'Avainsanat',
        infoText: 'Vapaat hakusanat aineistollesi. Vaikuttaa aineistosi löytymiseen Etsimen haussa. Käytä mahdollisimman tarkkoja termejä. Tässä kentässä ei ole automaattista käännöstä eri kielille.',
        placeholder: 'Esim. taloustiede',
        addButton: 'Lisää avainsanoja',
        help:
          'Voit lisätä useamman avainsanan erottamalla ne pilkulla (,). Aineistolla on oltava vähintään yksi avainsana.',
      },
    },
    rightsAndLicenses: {
      title: 'Oikeudet ja lisenssit',
      infoTitle: 'Oikeudet ja lisenssit info',
      accessType: {
        title: 'Pääsyoikeus',
        infoText: 'Tällä kentällä määrittelet, miten aineiston (tiedostot) saa käyttöönsä. Tämä kenttä ei vaikuta siihen, miten tämä kuvailu näkyy. Kuvailu näkyy aina automaattisesti Etsimessä julkaisun jälkeen. Jos valitset jotain muuta kuin Avoin (Open), myös syy, miksi tiedostojen latausta on rajoitettu (Restricition Grounds) on pakollinen tieto. Jos valitse "Embargo", määrittele myös embargon expiroitumisajankohta.',
        placeholder: 'Valitse vaihtoehto',
      },
      embargoDate: {
        label: 'Embargo loppumispäivämäärä (vvvv-kk-pp)',
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
        infoText: 'Lisenssi on tärkeä osa aineiston kuvailua. Lisenssillä määrittelet, miten aineistoa voi käyttää. Oletuksena on valittuna suositeltu CC BY 4.0. Jos haluat alasvetovalikosta valinnan sijaan määrittää lisenssin URL -osoitteen itse, valitse alasvetovalikosta "Muu (URL)", minkä jälkeen pääset kirjoittamaan URL-osoitteen.',
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
      infoText: 'Tutkimukseen tai aineiston tekemiseen osallistuneet henkilöt ja organisaatiot. Voit määrittää tekijät (pakollinen), Julkaisijan, Kuraattorit, Oikeuksienhaltijat sekä Muut tekijät. Valitse ensin, onko kyseessä henkilö vai organisaatio. Määritä sen jälkeen, missä roolissa ko. toimija osallistui tutkimukseen (voit valita useita), ja määritä sen jälkeen tarvittavat tiedot. Jos kyseessä on henkilö, on organisaatiotieto pakollinen tieto. Jo annettuja tietoja pääset muuttamaan klikkaamalla tallennetun toimijan kohdalla kynä -ikonia.',
      add: {
        title: 'Toimijat',
        help:
          'Tekijä (1+) rooli on pakollinen. Huomioi että yksittäisellä toimijalla voi olla useampi rooli.',
        radio: {
          person: 'Luonnollinen henkilö',
          organization: 'Organisaatio',
        },
        checkbox: {
          creator: 'Tekijä',
          publisher: 'Julkaisija',
          curator: 'Kuraattori',
          rights_holder: 'Oikeuksienhaltija',
          contributor: 'Muu tekijä'
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
          label: {
            person: 'Organisaatio',
            organization: 'Emo-organisaatio',
          },
          placeholder: 'Esim. Helsingin yliopisto',
        },
        save: {
          label: 'Tallenna',
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
        noneAddedNotice: 'Toimijoita ei olla lisätty',
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
      otherIdentifiers: {
        string: 'Tunnisteet tulisivat olla arvoltaan merkkijonoja.',
        url: 'Tunnisteet täytyy olla valiideja URL:eja',
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
          oneOf: 'Roolin kuuluisi olla "Tekijä", "Julkasija", "Kuraattori", "Oikeuksienhaltija" tai "Muut tekijät".',
          required:
            'Tekijän rooli on pakollinen.',
        },
        name: {
          string: 'Nimi pitää olla arvoltaan merkkijono.',
          max: 'Nimi on liian pitkä.',
          required: 'Nimi kenttä on pakollinen.',
        },
        email: {
          string: 'Sähköposti pitää olla arvoltaan merkkijono.',
          max: 'Sähköposti on liian pikä.',
          email: 'Lisää valiidi sähköposti.',
          nullable: '',
        },
        identifier: {
          string: '',
          max: 'Tunniste on liian pitkä.',
          nullable: '',
        },
        organization: {
          mixed: '',
          object: 'Valittu organisaatio tulisi olla olio.',
          string: 'Organisaation arvo tulisi olla merkkijono.',
          required: 'Organisaatio on pakollinen kenttä jos toimija on luonnollinen henkilö.',
        },
        requiredActors: {
          atLeastOneActor: 'Aineistoon on lisättävä vähintään yksi toimija.',
          mandatoryActors: 'Toimijat: Tekijä on pakollinen kenttä. Huomioi: yksittäisellä toimijalla voi olla useampi rooli.',
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
          required: 'Tiedoston lähde on pakollinen kenttä.'
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
        url: {
          required: 'Ulkoisen aineiston URL osoite on pakollinen kenttä.',
          url: 'Ulkoisen aineiston URL osoitteen pitää olla oikeassa URL-formaatissa',
        },
      },
    },
    files: {
      title: 'Tiedostot',
      infoTitle: 'Tiedostot info',
      infoText: 'Lisää texti',
      dataCatalog: {
        label: 'Tiedoston lähde',
        infoText: 'Ennenkuin pääset linkittämään tiedostoja aineistoosi, sinun tulee valita, linkitätkö tiedostoja IDAsta vai annatko ulkopuolisen palvelun URL-osoitteet, joista tiedostot löytyvät.',
        explanation: 'Valitse "IDA", jos tiedostot on tallennettu Fairdata IDA -palveluun. Valitse "Ulkoinen lähde" jos tiedostot sijaitsevat muualla.',
        placeholder: 'Valitse vaihtoehto',
        ida: 'IDA',
        att: 'Ulkoinen lähde'
      },
      help:
        'Aineistoon kuuluvat tiedostot. Aineistoon voi kuulua vain joko IDAssa olevia tiedostoja tai ulkopuolisia tiedostoja. Tiedostojen metadata ei ole osa aineistojen metadataa, joten muista tallentaa muutokset jotka teet tiedostojen metadataan.',
      ida: {
        title: 'Fairdata IDA tiedostot',
        infoText: 'Jos linkität IDA-tiedostoja, sinun tulee ensin valita IDA-projekti, minkä jälkeen näet ko. projektiin kuuluvat tiedostot ja hakemistot. Kun olet valinnut haluamasi projektin, sivu listaa sinulle ko. projektin sisältämät jäädytetyt hakemistot ja tiedostot. Valitse listasta ne hakemistot ja tiedostot, jotka haluat liittää aineistoosi. Jos liität hakemistot, KAIKKI sen alla olevat tiedostot liitetään aineistoon (älä siinä tapauksessa valitse hakemiston alta enää yksittäisiä tiedostoja).',
        help: 'Jos sinulla on tiedostoja Fairdata IDA:ssa, voit liittää ne tässä:',
        button: {
          label: 'Liitä tiedostoja Fairdata IDA:sta',
        },
      },
      projectSelect: {
        placeholder: 'Valitse projekti',
        loadError: 'Projektin hakemistojen lataus epäonnistui, virhe: ',
      },
      selected: {
        title: 'Valitut tiedostot',
        none: 'Tiedostoja tai hakemistoja ei ole valittu',
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
        help: 'Nämä ovat sinun aiemmin valitsemia tiedostoja. Jos olet liittänyt aineistoosi hakemiston, sen sisältöä ei automaattisesti päivitetä, vaikka sen sisältö olisi muuttunut IDAssa. Jos haluat lisätä puuttuvia tiedostoja, valitse ne tiedostolistasta. HUOM! Tiedostojen lisääminen luo aineistostasi uuden version.',
      },
      notificationNewDatasetWillBeCreated: {
        header: 'Tiedostojen ja kansioiden muokkaaminen',
        content: 'Jos julkaistuun aineistoon lisätään tiedostoja tai hakemistoja, tai siitä poistetaan tiedostoja tai hakemistoja, ko. aineistosta syntyy automaattisesti uusi versio. Vanha versio pysyy muuttumattomana ja siihen lisätään "vanha" -tagi. Jos julkaistu aineisto ei sisältänyt yhtään tiedostoa, voit lisätä tiedostoja ja/tai hakemistoja yhden kerran ilman, että uusi versio syntyy.',
      },
      external: {
        title: 'Ulkoiset tiedostot (ATT)',
        infoText: 'Määritä tiedostolle otsikko, käyttökategoria (alasvetovalikosta) sekä, kerro, mistä tiedosto löytyy. Tiedosto ei ladata Qvain Lightiin, vaan antamasi URL toimii aktiivisena linkkinä ko. tiedostoon.',
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
          url: {
            label: 'URL',
            placeholder: 'https://',
          },
          cancel: {
            label: 'Kumoa',
          },
          save: {
            label: 'Tallenna',
          },
          add: {
            label: 'Lisää',
          },
        },
      },
    },
  },
  slogan: 'Tutkimustenhaku palvelu',
  stc: 'Siirry sivun pääsisältöön',
  stsd: 'Siirry "Julkaise Aineisto"-nappiin',
  tombstone: {
    info: 'Aineisto on joko vanhentunut tai poistettu',
  },
  userAuthenticationError: {
    header: 'Kirjautuminen epäonnistui.',
    content: 'Tarkistathan, että sinulla on voimassaoleva CSC-tunnus (Qvaimen ja Qvain Lightin käyttö vaatii sen). Jos yritit kirjaututua jollain toisella tunnuksella (esim. Haka), sitä ei todennäköisesti ole liitetty CSC-tunnukseen. Voit rekisteröidä itsellesi CSC-tunnuksen osoitteessa https://sui.csc.fi.',
  },
  userHomeOrganizationErrror: {
    header: 'Kirjautuminen epäonnistui.',
    content: 'Tunnusta ei ole liitetty mihinkään kotiorganisaatioon. Olethan yhteydessä CSC:n asiakaspalveluun.',
  }
}

export default finnish
