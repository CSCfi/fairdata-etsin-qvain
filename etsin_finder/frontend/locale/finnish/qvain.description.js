const description = {
  title: 'Kuvaus',
  infoTitle: 'Kuvaus info',
  infoText: `Anna aineistolle kuvaava ja yksilöivä otsikko.
  Kuvauksessa voit kertoa miten aineisto on syntynyt, mihin tarkoitukseen,
  miten se rakentuu ja miten sitä on käsitelty.
  Kerro myös sisällöstä, mahdollisista puutteista ja rajauksista.
  `,
  fieldHelpTexts: {
    requiredForAll: 'Pakollinen tieto kaikille aineistoille',
    requiredToPublish: 'Pakollinen tieto julkaistaville aineistoille',
  },
  charactersRemaining: '%(charactersRemaining)s merkkiä jäljellä.',
  description: {
    title: {
      label: 'Otsikko',
      placeholder: {
        en: 'Otsikko (englanti)',
        fi: 'Otsikko (suomi)',
        sv: 'Otsikko (ruotsi)',
      },
      infoText: {
        fi: 'Aineiston otsikko suomeksi',
        en: 'Aineiston otsikko englanniksi',
        sv: 'Aineiston otsikko ruotsiksi',
      },
    },
    description: {
      label: 'Kuvaus',
      placeholder: {
        en: 'Kuvaus (englanti)',
        fi: 'Kuvaus (suomi)',
        sv: 'Kuvaus (ruotsi)',
      },
      infoText: {
        fi: 'Aineiston kuvaus suomeksi',
        en: 'Aineiston kuvaus englanniksi',
        sv: 'Aineiston kuvaus ruotsiksi',
      },
    },
    instructions: 'Vain yksi kielivalinta on pakollinen',
  },
  issuedDate: {
    title: 'Julkaisupäivämäärä',
    infoText: `Aineiston muodollinen julkaisupäivämäärä.
    Jos jätät kentät tyhjäksi, julkaisupäivämääräksi täytetään se päivämäärä,
    jolloin kuvailutiedot tallennetaan ensi kerran.`,
    instructions: '',
    placeholder: 'Päivämäärä',
  },
  otherIdentifiers: {
    title: 'Muut tunnisteet',
    infoText: `Metadatan tunniste luodaan automaattisesti.
    Jos aineistolle kuitenkin on jo olemassaoleva tunniste, syötä se tähän.
    Tunnisteen pituus on oltava vähintään 10 merkkiä.`,
    instructions:
      'Metadatan tunniste luodaan automaattisesti, mutta jos on jo OLEMASSA OLEVA tunniste, syötä se tähän.',
    alreadyAdded: 'Tunniste on jo lisätty',
    addButton: 'Lisää tunniste',
    placeholder: 'Esim. https://doi.org/...',
  },
  fieldOfScience: {
    title: 'Tieteenala',
    infoText: 'Valitse yksi tai useampi tieteenala Tilastokeskuksen tieteenalaluokituksesta.',
    placeholder: 'Valitse vaihtoehto',
    help: 'Voit lisätä useita tieteenaloja.',
  },
  datasetLanguage: {
    title: 'Aineiston kieli',
    infoText: 'Valitse aineistossa käytetyt kielet.',
    placeholder: 'Hae kieliä kirjoittamalla',
    noResults: 'Ei hakutuloksia',
    help: 'Voit lisätä useita kieliä.',
  },
  keywords: {
    title: 'Avainsanat',
    infoText: `Syötä aineistollesi sopivia avainsanoja. Näillä voit parantaa aineistosi löydettävyyttä.
    Käytä mahdollisimman tarkkoja termejä. Tässä kentässä ei ole automaattista käännöstä eri kielille.
    Voit lisätä useamman avainsanan erottamalla ne pilkulla (,).`,
    placeholder: 'Esim. taloustiede',
    alreadyAdded: 'Avainsana on jo lisätty',
    addButton: 'Lisää avainsana',
  },
  subjectHeadings: {
    title: 'Asiasanat',
    infoText: `Valitse aineistolle asiasanat pudotusvalikosta. Kenttä ehdottaa asiasanoja sitä mukaa,
    kun kirjoitat kenttään tekstiä. Kaikille asiasanoille löytyy käännökset
    englanniksi ja ruotsiksi. Valittavissa ovat Finton ylläpitämän KOKO-ontologian termit.`,
    placeholder: 'Hae vaihtoehtoja',
    help: 'Valitse asiasanat KOKO-ontologiasta. Kaikille asiasanoille löytyy käännökset englanniksi ja ruotsiksi.',
  },
  bibliographicCitation: {
    title: 'Lähdeviite',
    infoText: 'Suositeltu lähdeviittauksen muoto.',
  },
  error: {
    title: 'Otsikko on pakollinen ainakin yhdellä kielellä.',
    description: 'Kuvaus on pakollinen ainakin yhdellä kielellä.',
  },
}

export default description
