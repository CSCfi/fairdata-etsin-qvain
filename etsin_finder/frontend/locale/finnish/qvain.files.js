const files = {
  title: 'Tiedostot',
  infoTitle: 'Tiedostot info',
  infoText: 'Lisää texti',
  deletedLabel: 'Poistettu',
  filterRow: {
    filter: 'Rajaa',
    placeholder: 'Rajaa kohteita nimellä',
    noMatches: 'Hakuehtoa vastaavia kohteita ei löytynyt.',
  },
  error: {
    title: 'Virhe ladattaessa tiedostoja',
    retry: 'Yritä uudelleen',
    noFiles: 'Valitsemassasi projektissa ei ole tiedostoja.',
  },
  dataCatalog: {
    label: 'Tiedoston lähde',
    infoText: `Ennen kuin voit liittää tiedostoja aineistoosi,
      sinun tulee valita, linkitätkö tiedostoja IDAsta vai
      annatko ulkopuolisen palvelun URL-osoitteet, joista tiedostot löytyvät.`,
    explanation:
      'Valitse "IDA", jos tiedostot on tallennettu Fairdata IDA -palveluun. Valitse "Ulkoinen lähde" jos tiedostot sijaitsevat muualla.',
    doiSelection:
      'Haluan julkaistulle aineistolleni DOI-tunnisteen (digital object identifier) URN-tunnisteen sijaan.',
    placeholder: 'Valitse vaihtoehto',
    doi: 'DOI',
    ida: 'IDA',
    att: 'Ulkoinen lähde',
    pas: 'PAS',
  },
  cumulativeState: {
    label: 'Kasvava aineisto',
    radio: {
      no: 'Ei. (Uusien tiedostojen tai kansioiden lisääminen julkaistuun aineistoon vaatii, että aineistosta tehdään uusi versio.)',
      yes: 'Kyllä. (Tiedostoja tai kansioita tullaan lisäämään aineistoon. Lisäys onnistuu ilman uuden version luomista.)',
      note: 'Huom! Julkaistua ei-kasvavaa aineistoa ei voi muuttaa kasvavaksi ilman, että siitä tehdään uusi versio. Kasvavan aineiston muuttaminen ei-kasvavaksi on sen sijaan sallittua.',
    },
    enabled: {
      state: 'Tämä aineisto on merkitty kasvavaksi.',
      explanation:
        'Kasvavaan aineistoon lisätään dataa säännöllisesti. Jos aineistoon ei enää lisätä dataa, se kannattaa muuttaa ei-kasvavaksi.',
      button: 'Muuta ei-kasvavaksi',
      note: 'Huom! Jos muutat kasvavan aineiston ei-kasvavaksi, et voi enää muuttaa sitä takaisin kasvavaksi luomatta uutta versiota.',
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
    versionInfo:{
      published: 'Huom! Kasvavaan aineistoon voi lisätä tiedostoja vapaasti, mutta tiedostojen poistaminen ei ole sallittua ilman, että aineistosta tehdään uusi versio.',
      draft: `Huom! Niin kauan, kun aineisto on tallennettu vain luonnoksena, tiedostoja voi muuttaa vapaasti.
      Julkaistun aineiston tiedostoja ei voi enää muuttaa ilman, että siitä tehdään uusi versio. Julkaistuun kasvavaan aineistoon voi lisätä tiedostoja.`,
    },
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
    help: 'Tämä toiminto korjaa aineiston poistamalla siitä kaikki tiedostot ja hakemistot jotka eivät ole enää saatavilla. Aineistosta tehdään uusi versio.',
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
    help: 'Datan tallentaminen päivittää tiedoston metadatan riippumatta siitä onko se aineistossa.',
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
      show: 'Tarkastele PAS-metadataa',
      edit: 'Muokkaa PAS-metadataa',
      delete: 'Poista PAS-metadata',
      close: 'Sulje',
      save: 'Tallenna muutokset',
      hideError: 'Jatka muokkausta',
    },
    clear: {
      header: 'Poista PAS-metadata',
      help: 'Haluatko poistaa PAS-metadatan tiedostosta %(file)s? Muutos tulee voimaan välittömästi.',
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
  help: 'Aineistoon kuuluvat tiedostot. Aineistoon voi kuulua vain joko IDAssa olevia tiedostoja tai ulkopuolisia tiedostoja. Tiedostojen metadata ei ole osa aineistojen metadataa, joten muista tallentaa muutokset jotka teet tiedostojen metadataan.',
  ida: {
    title: 'Fairdata IDA tiedostot',
    infoText: `Jos liität aineistoosi tiedostoja IDA-palvelusta,
    valitse ensin projekti IDAssa. Näet tämän jälkeen projektin jäädytetyt
    tiedostot ja hakemistot. Valitse ne tiedostot ja hakemistot,
    jotka haluat liittää aineistoosi. Jos liität aineistoon hakemiston,
    kaikki sen alla olevat tiedostot liitetään aineistoon.
    `,
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
      show: 'Näytä %(name)s',
      remove: 'Poista %(name)s',
      undoRemove: 'Peru %(name)s poisto',
      refresh: 'Päivitä %(name)s',
      open: 'Avaa %(name)s',
      close: 'Sulje %(name)s',
      select: 'Valitse %(name)s',
      deselect: 'Poista valinta %(name)s',
    },
    addUserMetadata: 'Lisää metadataa',
    showUserMetadata: 'Tarkastele metadataa',
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
      applyUseCategoryToChildren:
        'Kopioi käyttökategoria myös hakemiston kaikille tiedostoille ja alihakemistoille',
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
  // extRes V2
  remoteResources: {
    title: 'Ulkoiset lähteet',
    noItems: 'Tiedostoja ei ole lisätty',
    modal: {
      title: {
        add: 'Lisää ulkoinen lähde',
        edit: 'Muokkaa ulkoista lähdettä',
      },
      buttons: {
        save: 'Lisää ulkoinen lähde',
        editSave: 'Vahvista muutokset',
        cancel: 'Peru',
      },
      addButton: 'Lisää ulkoinen lähde',
    },
  },
  external: {
    title: 'Ulkoiset tiedostot',
    infoText: `Määritä tiedostolle otsikko, käyttökategoria (alasvetovalikosta),
    sekä kerro, mistä tiedosto / sen lisenssitieto löytyvät (sivun URL).
    Voit antaa myös suoran latauslinkin, jos sellainen on.
    Tiedostoa ei ladata Qvaimeen, vaan antamasi sivun URL toimii linkkinä sivulle,
    jossa tiedosto sijaitsee. Tiedoston latauslinkin kautta
    pääsee suoraan aloittamaan tiedoston lataamisen omalle koneelleen.
    `,
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
      fileType: {
        label: 'Tiedostotyyppi',
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
      edit: {
        label: 'Tallenna ulkoinen lähde',
      },
      add: {
        label: 'Lisää',
      },
    },
  },
  sort: {
    label: 'Järjestä',
    date: 'Jäädytysaika',
    name: 'Nimi',
  },
}

export default files
