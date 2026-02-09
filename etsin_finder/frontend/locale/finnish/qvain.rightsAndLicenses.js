const rightsAndLicenses = {
  title: 'Oikeudet ja lisenssit',
  infoTitle: 'Oikeudet ja lisenssit info',
  accessRights: 'Käyttöoikeudet',
  accessType: {
    title: 'Pääsyoikeus',
    infoText: `<p>Tällä tiedolla määrittelet, miten julkaistun aineiston tiedostot saa käyttöönsä.
    Tämä kenttä ei vaikuta aineiston kuvailutietojen (metadata) näkyvyyteen.
    Kuvailu näkyy aina automaattisesti Etsimessä julkaisun jälkeen.</p>

    <p>Jos valitset jonkin muun vaihtoehdon kuin "Avoin" ("Open"),
    valitse myös peruste tiedostojen lataamisen rajoittamiselle.
    Jos valitset vaihtoehdon "Embargo", määrittele myös embargon päättymisajankohta.</p>`,
    placeholder: 'Valitse vaihtoehto',
    permitInfo:
      'Organisaation nimeämä taho käsittelee aineiston datan käyttöön liittyvät käyttölupahakemukset. Voit valita myös automaattisen hyväksynnän.',
    showDataDetailsInfo:
      'Datan metatiedot (kansiorakenne, tiedostonimet ja muu tiedostometatieto) ovat oletuksena piilotettu, kun pääsyoikeutta aineistoon on rajoitettu. Valitse, haluatko näyttää vai piilottaa datan metatiedot julkaistussa aineistossa. Huom: Pääsy dataan pysyy rajoitettuna.',
    showDataDetails: {
      radio: {
        no: 'Piilota datan tiedot Etsimessä',
        yes: 'Näytä datan tiedot Etsimessä',
      },
    },
    showDataDetailsTitle: 'Aineiston näkyvyys',
  },
  embargoDate: {
    label: 'Embargo loppumispäivämäärä',
    placeholder: 'Päivämäärä',
    help: 'Jos päivämäärää ei aseteta, embargo ei lopu ja näin ollen tiedostot eivät koskaan tule ladattavaksi.',
  },
  restrictionGrounds: {
    title: 'Rajoituksen peruste',
    placeholder: 'Valitse vaihtoehto',
    text: 'Jos pääsyoikeus on jokin muu kuin "Avoin", valitse peruste tiedostojen lataamisen rajoittamiselle.',
  },
  license: {
    title: 'Lisenssi',
    infoText: `Lisenssillä määrittelet, miten aineistoa voi käyttää.
    Oletuksena on valittuna tutkimusaineistoille suositeltu CC BY 4.0, mutta voit vaihtaa sitä.
    Jos haluat määrittää lisenssin URL-osoitteen itse, kirjoita kenttään lisenssin verkko-osoite https://-muodossa.<br>
    HUOM! Kuvailutiedot saavat automaattisesti CC0-lisenssin.`,
    placeholder: 'Valitse vaihtoehto',
    other: {
      label: 'URL',
      help: 'Anna osoite lisenssille.',
    },
    addButton: 'Lisää lisenssi',
  },
  description: {
    title: 'Käyttöoikeuksien kuvaus',
  },
  dataAccess: {
    title: 'Aineiston luvituksen ohjeet ja ehdot',
    applicationInstructions: 'Ohjeet luvan pyytämiseen',
    reviewerInstructions: 'Ohjeet luvan antamiseen luvittajille (ei näy käyttäjille)',
    terms: 'Myöntämisehdot (millä perustein luvitetaan)',
    remsApprovalType: {
      title: 'Luvan tyyppi',
      manual:
        'Data Access Committee (DAC). Käyttäjä voi tehdä hakemuksen ' +
        'saadakseen pääsyn aineiston dataan.',
      manualDisabled: 'Ei käytössä valitulle kuvailutietojen ylläpitäjälle.',
      automatic:
        'Automaattinen. Käyttäjät saavat automaattisesti pääsyn aineiston ' +
        'dataan kun ovat hyväksyneet lisenssin ja myöntämisehdot.',
    },
    remoteResourcesInfo:
      'Aineiston käyttöoikeuksien hyväksyntäprosessi ' +
      'hoidetaan Fairdata-palveluiden ulkopuolella. ' +
      'Täällä määritetty pääsyoikeustyyppi ja mahdolliset ohjeet ' +
      'näytetään Etsimessä vain tiedoksi.',
  },
}

export default rightsAndLicenses
