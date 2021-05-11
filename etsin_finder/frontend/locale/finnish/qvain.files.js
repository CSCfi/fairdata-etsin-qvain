const files = {
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
      'Haluan julkaistulle aineistolleni DOI-tunnisteen (digital object identifier) URN-tunnisteen sijaan.',
    doiSelectedHelp:
      'Aineistolle luodaan julkaisun yhteydessä DOI-tunniste, joka rekisteröidään DataCite-palvelun tietokantaan, eikä toimintoa voi peruuttaa. DOI-tunnisteellisen aineiston julkaisupäivämäärää ei voi muuttaa enää julkaisun jälkeen.',
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
        'Oletko varma, että haluat tehdä aineistosta kasvavan? Muutos aiheuttaa uuden version syntymisen ja uudella versiolla on aina uusi tunniste.',
      cancel: 'Peruuta',
    },
    modalHeader: 'Muuta aineiston kasvavuutta',
    closeButton: 'Sulje',
    changes: 'Aineistoon tehdyt muutokset on tallennettava ennen tämän asetuksen muuttamista.',
  },
  cumulativeStateV2: {
    label: 'Kasvava aineisto',
    radio: {
      no:
        'Ei. (Uusien tiedostojen tai kansioiden julkaistuun aineistoon vaatii, että aineistosta tehdään uusi versio.)',
      yes:
        'Kyllä. (Tiedostoja tai kansioita tullaan lisäämään aineistoon. Lisäys onnistuu ilman uuden version luomista.)',
      note:
        'Huom! Julkaistua aineistoa ei voi muuttaa kasvavaksi ilman, että siitä tehdään uusi versio. Kasvavan aineiston muuttaminen ei-kasvavaksi on sen sijaan sallittua.',
    },
    enabled: {
      state: 'Tämä aineisto on merkitty kasvavaksi.',
      explanation:
        'Kasvavaan aineistoon lisätään dataa säännöllisesti. Jos aineistoon ei enää lisätä dataa, se kannattaa muuttaa ei-kasvavaksi.',
      button: 'Muuta ei-kasvavaksi',
      note:
        'Huom! Jos muutat kasvavan aineiston ei-kasvavaksi, et voi enää muuttaa sitä takaisin kasvavaksi luomatta uutta versiota.',
    },
    disabled: {
      state: 'Aineisto on julkaistu tavallisena, ei-kasvavana aineistona.',
      explanation:
        'Aineistoon ei voi lisätä tiedostoja tai hakemistoja luomatta siitä uutta versiota.',
      note: 'Jos haluat muuttaa aineiston kasvavaksi, siitä on ensin luotava uusi versio.',
    },
    stateChanged: {
      note: 'Uusi tila tulee voimaan kun aineisto tallennetaan.',
      button: 'Peru muutos',
    },
  },
  responses: {
    fail: 'Jotain meni pieleen...',
    changeComplete: 'Toiminto suoritettu.',
    versionCreated: 'Aineistosta on luotu uusi versio tunnisteella %(identifier)s.',
    openNewVersion: 'Avaa uusi versio',
  },
  addItemsModal: {
    allSelected: 'Kaikki projektin tiedostot ja hakemistot ovat jo aineistossa.',
    noProject: 'Projekti puuttuu tai siinä ei ole tiedostoja.',
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
    statusText: 'Aineisto on vanhentunut. Jotkin aineiston tiedostot eivät ole enää saatavilla.',
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
      add: 'Lisää PAS-metadata',
      show: 'Muokkaa PAS-metadataa',
      delete: 'Poista PAS-metadata',
      close: 'Sulje',
      save: 'Tallenna muutokset',
      hideError: 'Jatka muokkausta',
    },
    clear: {
      header: 'Poista PAS-metadata',
      help:
        'Haluatko poistaa PAS-metadatan tiedostosta %(file)s? Muutos tulee voimaan välittömästi.',
      cancel: 'Peruuta',
      confirm: 'Poista',
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
      'Määritä tiedostolle otsikko, käyttökategoria (alasvetovalikosta) sekä, kerro, mistä tiedosto / sen lisenssitieto löytyvät (sivun URL). Voit antaa myös suoran latauslinkin, jos sellainen on. Tiedostoa ei ladata Qvaimeen, vaan antamasi sivun URL toimii linkkinä sivulle, jossa tiedosto sijaitsee sekä tiedoston latauslinkin kauttaja pääsee suoraan aloittamaan tiedoston lataamisen omalle koneelleen.',
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
}

export default files
