// V1
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
      addButton: 'Lisää maantieteellinen alue',
      title: {
        add: 'Lisää maantieteellinen alue',
        edit: 'Muokkaa maantieteellistä aluetta',
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
    infoText: 'Ajanjakso, minkä aineisto kattaa, esimerkiksi aika jolloin on tehty havaintoja.',
    description: 'Ajanjakso, minkä aineisto kattaa, esimerkiksi aika jolloin on tehty havaintoja.',
    addButton: 'Lisää ajanjakso',
    listItem: {
      bothDates: '%(startDate)s – %(endDate)s',
      startDateOnly: 'alkaen %(startDate)s',
      endDateOnly: '%(endDate)s saakka',
    },
    modal: {
      durationInput: {
        label: 'Ajanjakso',
        startPlaceholder: 'Alkamispäivämäärä',
        endPlaceholder: 'Loppumispäivämäärä',
      },
    },
  },
}

export default temporalAndSpatial
