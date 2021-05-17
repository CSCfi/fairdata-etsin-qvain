const temporalAndSpatial = {
  title: 'Ajallinen ja maantieteellinen kattavuus',
  tooltip: 'Ajallinen ja maantieteellinen kattavuus info',
  tooltipContent: {
    spatial: {
      title: 'Maantieteellinen kattavuus',
      paragraph: 'Alue jonka aineisto kattaa. Esimerkiksi paikat, joissa on tehty havaintoja. ',
    },
    temporal: {
      title: 'Ajallinen kattavuus',
      paragraph: 'Ajanjakso, minkä aineisto kattaa, esimerkiksi aika jolloin on tehty havaintoja.',
    },
  },
  spatial: {
    title: 'Maantieteellinen kattavuus',
    description: 'Alue jonka aineisto kattaa. Esimerkiksi paikat, joissa on tehty havaintoja. ',
    noItems: 'Maantieteellistä kattavuutta ei ole lisätty.',
    modal: {
      addButton: 'Lisää maantieteellinen kattavuus',
      title: {
        add: 'Lisää maantieteellinen kattavuus',
        edit: 'Muokkaa maantieteellistä kattavuutta',
      },
      buttons: {
        addGeometry: 'Lisää geometria',
        save: 'Tallenna',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
      nameInput: {
        label: 'Nimi',
        placeholder: 'Alueen nimi',
      },
      altitudeInput: {
        label: 'Korkeus',
        placeholder: 'Alueen korkeus ilmoitettuna WGS84 -referenssin mukaan',
      },
      addressInput: {
        label: 'Osoite',
        placeholder: 'Koko osoite',
      },
      geometryInput: {
        label: 'Geometria',
        placeholder: 'Geometria WKT-muodossa WGS84 -referenssin mukaan',
      },
      locationInput: {
        label: 'Paikka',
        placeholder: 'Etsi paikkoja hakusanalla',
      },
    },
  },
  temporal: {
    title: 'Ajallinen kattavuus',
    description: 'Ajanjakso, minkä aineisto kattaa, esimerkiksi aika jolloin on tehty havaintoja.',
    addButton: 'Lisää ajallinen kattavuus',
    modal: {
      durationInput: {
        label: 'Ajanjakso',
        startPlaceholder: 'Alkamisajankohta',
        endPlaceholder: 'Loppuajankohta',
      },
    },
  },
}

export default temporalAndSpatial
