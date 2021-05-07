const description = {
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
    infoText:
      'Lähteen muodollinen julkaisupäivämäärä. Ei vaikuta aineston näkyvyyteen. Jos kenttä jätetään tyhjäksi, käytetään nykyistä päivämäärää.',
    instructions: '',
    placeholder: 'Päivämäärä',
  },
  otherIdentifiers: {
    title: 'Muut tunnisteet',
    infoText:
      'Jos aineistollasi on jo tunniste (tai useita), yleensä esim. DOI, anna ne tässä. Olemassaolevien tunnisteiden lisäksi aineisto saa tallennusvaiheessa pysyvän tunnisteen, joka tulee resolvoitumaan Etsimen laskeutumissivulle.',
    instructions:
      'Metadatan tunniste luodaan automaattisesti mutta jos on jo OLEMASSA OLEVA tunniste, syötä se tähän.',
    alreadyAdded: 'Tunniste on jo lisätty',
    addButton: 'Lisää tunniste',
    placeholder: 'Esim. https://doi.org/...',
  },
  fieldOfScience: {
    title: 'Tieteenala',
    infoText:
      'Valitse tieteenala. Alasvetovalikkosa on Opetus- ja Kulttuuriministeriön mukainen luokitus tieteenaloille.',
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
    infoText:
      'Vapaat hakusanat aineistollesi. Vaikuttaa aineistosi löytymiseen Etsimen haussa. Käytä mahdollisimman tarkkoja termejä. Tässä kentässä ei ole automaattista käännöstä eri kielille.',
    placeholder: 'Esim. taloustiede',
    alreadyAdded: 'Avainsana on jo lisätty',
    addButton: 'Lisää avainsana',
    help:
      'Voit lisätä useamman avainsanan erottamalla ne pilkulla (,). Aineistolla on oltava vähintään yksi avainsana.',
  },
  subjectHeadings: {
    title: 'Asiasanat',
    infoText:
      'Valitse asiasanat KOKO-ontologiasta. Kaikille asiasanoille löytyy käännökset englanniksi ja ruotsiksi.',
    placeholder: 'Hae vaihtoehtoja',
    help:
      'Valitse asiasanat KOKO-ontologiasta. Kaikille asiasanoille löytyy käännökset englanniksi ja ruotsiksi.',
  },
  error: {
    title: 'Otsikko on pakollinen ainakin yhdellä kielellä.',
    description: 'Kuvaus on pakollinen ainakin yhdellä kielellä.',
  },
}

export default description
