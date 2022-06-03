const geographics = {
  infoText: {
    section: 'Alue, jonka aineisto kattaa. Esimerkiksi paikat, joissa on tehty havaintoja.',
    geometry:
      'Jos valitset paikan, Qvain täyttää valinnan geometriatiedot automaattisesti tallennuksen yhteydessä. ' +
      'Etsin näyttää paikan karttapohjalla näiden geometriatietojen mukaan. ' +
      'Automaattisten geometriatietojen lisäksi voit tarkentaa paikannusta antamalla geometriatiedot itse WSG84 muodossa.',
  },
  noItems: 'Maantieteellistä aluetta ei ole lisätty.',
  title: {
    section: 'Maantieteellinen alue',
    general: 'Yleiset tiedot',
    geometry: 'Geometria',
  },
  name: {
    label: 'Nimi',
    infoText: 'Alueen nimi',
  },
  altitude: {
    label: 'Korkeus',
    infoText: 'Alueen korkeus ilmoitettuna WGS84 -referenssin mukaan',
  },
  address: {
    label: 'Osoite',
    infoText: 'Koko osoite',
  },
  geometry: {
    label: 'Geometria',
    infoText: 'Lisää geometria WKT-muodossa WGS84 -referenssin mukaan',
  },
  location: {
    label: 'Paikka',
    infoText: 'Etsi paikkoja hakusanalla',
  },

  modal: {
    addButton: 'Lisää maantieteellinen alue',
    title: {
      add: 'Lisää maantieteellinen alue',
      edit: 'Muokkaa maantieteellistä aluetta',
    },
    buttons: {
      addGeometry: 'Lisää geometria',
      save: 'Lisää maantieteellinen alue',
      editSave: 'Vahvista muutokset',
      cancel: 'Peruuta',
    },
  },
}

export default geographics
