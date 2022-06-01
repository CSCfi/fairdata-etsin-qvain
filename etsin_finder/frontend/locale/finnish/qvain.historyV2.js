const history = {
  title: {
    title: 'Historiatiedot (provenienssi)',
    general: 'Tapahtuman kuvailu',
    outcome: 'Lopputulos',
    details: 'Muut yksityiskohdat',
  },
  infoText: 'Tapahtuma tai toiminta, jonka kohteena oli tämä aineisto.',
  noItems: 'Historiatietoja ei ole lisätty.',
  modal: {
    title: {
      add: 'Lisää historiatieto',
      edit: 'Muokkaa historiatietoa',
    },
    addButton: 'Lisää historiatieto',
    buttons: {
      save: 'Lisää historiatieto',
      editSave: 'Vahvista muutokset',
      cancel: 'Peruuta',
    },
  },
  name: {
    fi: {
      label: 'Nimi',
      infoText: 'Nimi (suomi)',
    },
    en: {
      label: 'Nimi',
      infoText: 'Nimi (englanti)',
    },
  },
  description: {
    fi: {
      label: 'Seloste',
      infoText: 'Seloste (suomi)',
    },
    en: {
      label: 'Seloste',
      infoText: 'Seloste (englanti)',
    },
  },
  outcomeDescription: {
    fi: {
      label: 'Kuvaus lopputuloksesta',
      infoText: 'Kuvaus lopputuloksesta (suomi)',
    },
    en: {
      label: 'Kuvaus lopputuloksesta',
      infoText: 'Kuvaus lopputuloksesta (englanti)',
    },
  },
  location: {
    label: 'Alueelliset tiedot',
    noItems: 'Alueellisia tietoja ei ole lisätty.',
    error: {
      nameRequired: 'Nimi on pakollinen tieto.',
      altitudeNan: 'Korkeus täytyy olla numero',
    },
    modal: {
      addButton: 'Lisää alueellinen tieto',
      buttons: {
        addGeometry: 'Lisää alueellinen tieto',
        save: 'Lisää alueellinen tieto historiaan',
        editSave: 'Päivitä',
        cancel: 'Peruuta',
      },
      title: {
        add: 'Lisää alueellinen tieto',
        edit: 'Muokkaa alueellista tietoa',
      },
      nameInput: {
        label: 'Nimi',
        infoText: 'Alueen nimi',
      },
      altitudeInput: {
        label: 'Korkeus',
        infoText: 'Alueen korkeus ilmoitettuna WGS84 -referenssin mukaan',
      },
      addressInput: {
        label: 'Osoite',
        infoText: 'Koko osoite',
      },
      geometryInput: {
        label: 'Geometria',
        infoText: 'Geometria WKT-muodossa WGS84 -referenssin mukaan',
      },
      locationInput: {
        label: 'Paikka',
        infoText: 'Etsi paikkoja hakusanalla',
      },
    },
  },
  outcome: {
    label: 'Lopputulos',
    infoText: 'Valitse lopputulos',
  },
  lifecycle: {
    label: 'Tapahtuman tyyppi',
    infoText: 'Valitse tapahtuman tyyppi  ',
  },
  periodOfTime: {
    label: 'Ajanjakso',
    startInfoText: 'Alkamispäivämäärä',
    endInfoText: 'Päättymispäivämäärä',
  },
  actors: {
    label: 'Liittyi toimijaan',
    infoText: 'Lisää toimija',
    createButton: 'Lisää uusi toimija',
  },
}

export default history
