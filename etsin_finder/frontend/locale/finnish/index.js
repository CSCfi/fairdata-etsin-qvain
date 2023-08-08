/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import qvain from './qvain'

const finnish = {
  changepage: 'Siirryit sivulle: %(page)s',
  dataset: {
    additionalInformation: 'Lisätietoja',
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
    citation: {
      sidebar: 'Sitaatti / Lähdeviite',
      buttonTitle: 'Kopioi Sitaatti/Lähdeviite',
      title: 'Viittaa aineistoon',
      titleShort: 'Viittaa',
      copyButton: 'Kopioi',
      copyButtonTooltip: 'Kopioi leikepöydälle',
      copyButtonTooltipSuccess: 'Viittaus kopioitu leikepöydälle',
      warning:
        'Automaattisesti luotujen viitteiden tiedoissa voi esiintyä virheitä. Tarkista aina viitteen tiedot.',
    },
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
      errorInternal: 'Palvelinvirhe! Ota yhteyttä tukeen',
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
    copy: 'Kopioi',
    copyToClipboard: 'Kopioi leikepöydälle',
    copyToClipboardSuccess: 'Tunniste kopioitu leikepöydälle',
    creator: {
      plrl: 'Tekijät',
      snglr: 'Tekijä',
    },
    curator: 'Kuraattori',
    data_location: 'Mene haravoituun sijaintiin',
    datasetAsFile: {
      open: 'Lataa aineiston metatiedot',
      infoLabel: 'Formaatin tiedot',
      infoText:
        'Validoimaton Datacite: Aineisto näytetään Datacite -formaatissa, mutta ilman pakollisten kenttien validointia. Aineisto ei sellaisenaan välttämättä täytä Dataciten vaatimuksia.',
      datacite: 'Datacite tietomallissa (XML)',
      fairdata_datacite: 'Ei validoituna Datacite tietomallissa (XML)',
      metax: 'Metax tietomallissa (JSON)',
    },
    draftInfo: {
      draft: 'Tämä aineisto on luonnos ja näkyy ainoastaan aineiston luojalle.',
      changes:
        'Tämä on esikatselu julkaisemattomista muutoksista aineistoon ja näkyy ainoastaan aineiston luojalle.',
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
      downloadDisabledForDraft: 'Lataus ei käytössä luonnoksille',
      downloading: 'Ladataan...',
      source: 'Ulkoinen lähdesivu',
      commonSource: 'Avaa alkuperäinen lähde',
      fileAmount: '%(amount)s objektia',
      close_modal: 'Sulje info',
      customMetadata: 'Metatiedot',
      info_header: 'Tiedoston muut tiedot',
      loading: 'Ladataan kansiota',
      loaded: 'Kansio latautunut',
      errors: {
        serviceUnavailable:
          'Latauspalvelu ei ole juuri nyt käytettävissä. Jos virhetilanne jatkuu, löydät tarkemmat tiedot <a href="https://www.fairdata.fi/huoltokatko/">huoltokatko</a>-sivultamme.',
        idaUnavailable:
          'Tiedostojen lataus on väliaikaisesti pois käytöstä huoltokatkon takia. Lisätietoa huoltokatkoista: <a href="https://www.fairdata.fi/huoltokatko/">https://www.fairdata.fi/huoltokatko/</a>',
        unknownError:
          'Latauspalvelun käytössä tapahtui virhe. Jos virhetilanne jatkuu, löydät tarkemmat tiedot <a href="https://www.fairdata.fi/huoltokatko/">huoltokatko</a>-sivultamme.',
      },
      manualDownload: {
        title: 'Muut latausvaihtoehdot',
        ariaLabel: 'Näytä muut latausvaihtoehdot',
        description: `Etsimen lataukset voi käynnistää myös seuraavin komennoin.
        Huomioi että komennot ovat <em>kertakäyttöisiä</em> koska jokainen lataus tulee todentaa erikseen.
        Komennot ovat voimassa 72 tuntia.`,
        error: 'Latauksen valtuuttamisessa tapahtui virhe.',
        copyButton: 'Kopioi',
        copyButtonTooltip: 'Kopioi leikepöydälle',
        copyButtonTooltipSuccess: 'Kopioitu leikepöydälle',
      },
      packages: {
        createForAll: 'Lataa kaikki',
        create: 'Lataa',
        pending: 'Luodaan',
        pendingTooltip:
          'Latauspakettia luodaan. Kun painike muuttuu vihreäksi, lataus voidaan aloittaa.',
        loading: 'Ladataan',
        tooLarge: 'Lataus ei mahdollista latauksen suuren koon vuoksi.',
        modal: {
          generate: {
            header: 'Luo latauspaketti?',
            main: `Aloittaaksesi latauksen Etsimen täytyy luoda latauspaketti.
            Jos dataa on paljon, paketin luomisessa voi kestää minuutteja tai tunteja.
            Kun lataus voidaan aloittaa, lataa-painike muuttuu vihreäksi.`,
            additional: 'Latauspaketin luonti ei keskeydy, vaikka poistuisit Etsimestä.',
          },
          pending: {
            header: 'Latauspaketin luonti käynnissä',
            main: `Etsin luo parhaillaan latauspakettia.
              Jos dataa on paljon, paketin luomisessa voi kestää minuutteja tai tunteja.
              Kun lataus voidaan aloittaa, lataa-painike muuttuu vihreäksi.`,
          },
          success: {
            header: 'Latauspaketti luotu',
            main: 'Paketti on nyt valmis ladattavaksi.',
          },
          additionalEmail:
            'Jos haluat että sinulle ilmoitetaan kun lataus on mahdollista aloittaa, ilmoitathan sähköpostisi.',
          emailPlaceholder: 'Sähköposti',
          buttons: {
            ok: 'Luo latauspaketti',
            cancel: 'Peruuta',
            close: 'Sulje',
            submitEmail: 'Tilaa ilmoitus',
          },
        },
      },
      objectCount: {
        one: '1 objekti',
        other: '%(count)s objektia',
      },
      fileCount: {
        one: '1 tiedosto',
        other: '%(count)s tiedostoa',
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
        external: 'Lähteen tiedot',
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
        external: 'Lähteen tiedot',
      },
      item: 'aineisto %(item)s',
      name: 'Nimi',
      size: 'Koko',
      remote: 'Ulkoinen lähde',
      checksum: 'Checksum (%(insertable)s)',
      id: 'ID',
      accessUrl: 'Lähdesivu',
      downloadUrl: 'Latauslinkki',
      title: 'Otsikko',
      type: 'Tyyppi',
      go_to_original: 'Siirry sivulle',
      sliced: 'Joitain tiedostoja ei näytetä tässä näkymässä tiedostojen suuren lukumäärän vuoksi',
      cumulativeDatasetLabel: 'Aineisto on kasvava',
      cumulativeDatasetTooltip: {
        header: 'Kasvava aineisto',
        info: 'Tämä on karttuva aineisto, johon mahdollisesti vielä lisätään tiedostoja. Huomio tämä kun käytät aineistoa tai viittaat siihen (esim. ajallinen kattavuus hyvä mainita). Aineistosta ei kuitenkaan voi poistaa tai muuttaa olemassa olevia tiedostoja.',
      },
    },
    embargo_date: 'Embargo voimassa',
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
      preservationEvent: {
        useCopy: {
          title: 'Aineistosta viety kopio pitkäaikaissäilytykseen',
          descriptionDate: 'Kopio luotu: %(date)s.',
          descriptionLink: 'Siirry pitkäaikaissäilytyksessä olevaan versioon tästä.',
        },
        preservedCopy: {
          title: 'Viety pitkäaikaissäilytykseen',
          descriptionDate: 'Luotu: %(date)s.',
          descriptionLink: 'Käyttökopioon pääset tästä.',
        },
      },
      deprecations: {
        event: 'Vanhentunut (deprekoitunut)',
        title: 'Data poistettu',
        description: 'Alkuperäinen data poistettu Fairdata IDAsta',
      },
      other_idn: 'Muut tunnisteet',
      origin_identifier: 'Alkuperäisen aineiston tunniste',
      relations: {
        title: 'Relaatiot',
        type: 'Tyyppi',
        name: 'Otsikko',
        idn: 'Tunniste',
      },
      versions: {
        title: 'Versiot',
        type: 'Tyyppi',
        number: 'Numero',
        name: 'Otsikko',
        idn: 'Tunniste',
        types: {
          older: 'Vanhempi',
          latest: 'Viimeisin',
          newer: 'Uudempi',
        },
      },
    },
    map: {
      geographic_name: 'Maantieteellinen nimi',
      full_address: 'Kokonainen osoite',
      alt: 'Korkeus (m)',
    },
    description: 'Kuvaus',
    doi: 'DOI',
    field_of_science: 'Tieteenala',
    file_types: 'Datan tyyppi',
    funder: 'Rahoittaja',
    goBack: 'Palaa takaisin',
    identifier: 'Tunniste',
    catalog_alt_text: '%(title)s logo, linkki vie katalogin julkaisijan verkkosivuille',
    infrastructure: 'Infrastruktuuri',
    issued: 'Julkaisupäivämäärä: %(date)s',
    metadata: 'Aineiston metatiedot',
    modified: 'Aineiston muokkauspäivämäärä: %(date)s',
    harvested: 'Haravoitu',
    cumulative: 'Kumulatiivinen',
    keywords: 'Avainsanat',
    subjectHeading: 'Asiasanat',
    license: 'Lisenssi',
    otherLicense:
      'Aineiston lisenssiä ei ole selkeästi määritelty. Otathan yhteyttä aineiston omistajaan / oikeuksienhaltijaan saadaksesi lisätietoa.',
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
    fairdataPas: 'Fairdata PAS',
    storedInPas: 'Tämä aineisto on pitkäaikaissäilytyksessä.',
    pasDatasetVersionExists: 'Aineisto on myös pitkäaikaissäilytyksessä: ',
    originalDatasetVersionExists: 'Aineistosta on olemassa käyttökopio: ',
    linkToPasDataset: 'Siirry pitkäaikaissäilytyksessä olevaan versioon tästä',
    linkToOriginalDataset: 'Käyttökopioon pääset tästä',
    enteringPas: 'Menemässä PAS:iin',
    dataInPasDatasetsCanNotBeDownloaded: 'PAS-aineistojen dataa ei voida ladata',
    validationMessages: {
      email: {
        string: 'Sähköpostin pitää olla arvoltaan merkkijono.',
        max: 'Sähköpostiosoite on liian pitkä.',
        email: 'Lisää validi sähköpostiosoite.',
      },
    },
  },
  error: {
    cscLoginRequired: 'Tämä sivu vaatii kirjautumisen CSC-tunnuksella.',
    notFound: 'Hups! Sivua ei löytynyt.',
    notLoaded:
      'Olemme pahoillamme, nyt sattui häiriötilanne. Ole hyvä ja yritä hetken päästä uudelleen.',
    invalidIdentifier: 'Epäkelpo tunniste',
    undefined: 'Hups! Tapahtui virhe.',
    details: {
      showDetails: 'Näytä tiedot',
      hideDetails: 'Piilota tiedot',
    },
  },
  general: {
    showMore: 'Näytä lisää',
    showLess: 'Näytä vähemmän',
    description: 'Kuvaus',
    notice: {
      SRhide: 'piilota ilmoitus',
    },
    state: {
      changedLang: 'Kieli vaihdettu kieleen: %(lang)s',
      inactiveLogout: 'Istunto aikakatkaistu. Sinut kirjattiin ulos.',
    },
    qvainPageTitle: 'Qvain | Tutkimusaineistojen kuvailutyökalu',
    etsinPageTitles: {
      data: 'Data',
      events: 'Tunnisteet ja tapahtumat',
      maps: 'Kartat',
      dataset: 'Aineisto',
      datasets: 'Aineistot',
      home: 'Koti',
      qvain: 'Qvain',
      error: 'Virhe - Sivua ei löydy',
    },
    language: {
      toggleLabel: 'Vaihda kieltä: %(otherLang)s',
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
    tooltip: {
      datasets: 'Tarkastele aineistoja hakusivulla',
      keywords: 'Tarkastele asiasanoja hakusivulla',
      fos: 'Tarkastele tieteenaloja hakusivulla',
      research: 'Tarkastele projekteja hakusivulla',
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
    maps: 'Kartat',
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
  },
  slogan: 'Tutkimustenhaku palvelu',
  stc: 'Siirry sivun pääsisältöön',
  stsd: 'Siirry "Julkaise Aineisto"-nappiin',
  tombstone: {
    removedInfo: 'Aineisto on poistettu',
    deprecatedInfo:
      'Aineisto on vanhentunut. Aineiston metatiedot ovat edelleen saatavilla, mutta aineistoon sen julkaisuvaiheessa liitetty data on poistettu.',
    urlToNew: 'Aineistosta on olemassa uudempi, julkaistu versio.',
    urlToOld: 'Aineistosta on olemassa vanhempi, julkaistu versio.',
    urlToRelated:
      'Aineistosta on viittaus toiseen julkaistuun aineistoon viittaustyypillä "%(type)s."',
    urlToOtherIdentifier:
      'Aineistolla on toinen olemassa oleva pysyvä tunniste Fairdata-palvelussa (%(identifier)s).',
    linkTextToNew: 'Saat avattua uuden version tästä.',
    linkTextToRelated: 'Saat avattua viitatun aineiston tästä.',
    linkTextToOtherIdentifier: 'Saat avattua viitatun aineiston tästä.',
    linkTextToOld: 'Saat avattua version tästä.',
  },
  loginError: {
    header: 'Kirjautuminen epäonnistui.',
    missingUserName:
      'Tarkistathan, että sinulla on voimassaoleva CSC-tunnus (Qvaimen käyttö vaatii sen). Jos yritit kirjaututua jollain toisella tunnuksella (esim. Haka), sitä ei todennäköisesti ole liitetty CSC-tunnukseen. Lisäohjeita CSC-tunnuksen rekisteröimiseksi: https://docs.csc.fi/#accounts/how-to-create-new-user-account/',
    missingOrganization:
      'Tunnusta ei ole liitetty mihinkään kotiorganisaatioon. Olethan yhteydessä CSC:n asiakaspalveluun.',
  },
  footer: {
    fairdata: {
      title: 'Fairdata',
      text: 'Fairdata-palvelut järjestää <strong>opetus- ja kulttuuriministeriö</strong> ja toimittaa <strong>CSC – Tieteen tietotekniikan keskus Oy</strong>',
    },
    information: {
      title: 'Tietoa',
      terms: 'Käyttöpolitiikat ja ehdot',
      termsUrl: 'https://www.fairdata.fi/kayttopolitiikat-ja-ehdot/',
      contracts: 'Sopimukset ja tietosuoja',
      contractsUrl: 'https://www.fairdata.fi/sopimukset/',
    },
    accessibility: {
      title: 'Saavutettavuus',
      statement: 'Saavutettavuus',
      statementUrls: {
        fairdata: 'https://www.fairdata.fi/saavutettavuus',
        etsin: 'https://www.fairdata.fi/etsin-saavutettavuus',
        qvain: 'https://www.fairdata.fi/qvain-saavutettavuus',
      },
    },
    contact: {
      title: 'Ota yhteyttä',
    },
    follow: {
      title: 'Seuraa',
      news: 'Uutiset',
      newsUrl: 'https://www.fairdata.fi/ajankohtaista',
    },
  },
  qvain,
}

export default finnish
