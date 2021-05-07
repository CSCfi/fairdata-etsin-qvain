const rightsAndLicenses = {
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
      'Lisenssi on tärkeä osa aineiston kuvailua. Lisenssillä määrittelet, miten aineistoa voi käyttää. Oletuksena on valittuna suositeltu CC BY 4.0. Jos haluat alasvetovalikosta valinnan sijaan määrittää lisenssin URL -osoitteen itse, kirjoita lisenssin URL ja valitse alasvetovalikon alusta "Muu (URL)".',
    placeholder: 'Valitse vaihtoehto',
    other: {
      label: 'URL',
      help: 'Anna osoite lisenssille.',
    },
    addButton: 'Lisää lisenssi',
  },
}

export default rightsAndLicenses
