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
      'Aineiston omistaja (alkuperäinen kuvailun tekijä) pystyy oletuksena hyväksymään aineiston datan käyttöön liittyvät käyttölupahakemukset. Käyttölupatoimintoa kehitetään, ja jossain vaiheessa tullaan lisäämään mahdollisuus myös muiden ko. organisaation edustajien päästä, joko omistajan lisäksi tai sijaan, hyväksymään käyttölupahakemuksia. Valitsemalla pääsyoikeudeksi "Vaatii luvan hakemista" / "Requires permission" käyttäjä sitoutuu näihin muutoksiin.',
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
    title: 'Aineiston luvitus',
    applicationInstructions: 'Ohjeet luvan pyytämiseen',
    reviewerInstructions: 'Ohjeet luvan antamiseen luvittajille (ei näy käyttäjille)',
    terms: 'Myöntämisehdot (millä perustein luvitetaan)',
    remsApprovalType: {
      title: 'Luvan tyyppi',
      disabled: 'Ei käytössä',
      automatic: 'Automaattinen',
      manual: 'Manuaalinen',
    },
  },
}

export default rightsAndLicenses
