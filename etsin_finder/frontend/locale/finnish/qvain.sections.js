const sections = {
  dataOrigin: {
    title: 'Datalähde',
    buttons: {
      ida: {
        title: 'Ida',
        description: 'Valitse "Ida" jos data on Fairdata IDA palvelussa',
      },
      att: {
        title: 'Ulkoinen lähde',
        description: 'Valitse "Ulkoinen lähde" data sijaitsee ulkoisessa ',
      },
      pas: {
        inProcess: {
          title: 'Pitkäaikaissäilytys',
          description: 'Aineisto on menossa pitkäaikaissäilytykseen (PAS)',
        },
        done: {
          title: 'Pitkäaikaissäilytyksessä',
          description: 'Aineisto on pitkäaikaissäilytyksessä (PAS)',
        },
      },
    },
  },
  description: {
    title: 'Kuvaus',
  },
  actors: {
    title: 'Toimijat',
  },
  publications: {
    title: 'Aineistoon liittyvät julkaisut ja muut tuotokset',
  },
  geographics: {
    title: 'Maantieteellinen alue',
  },
  timePeriod: {
    title: 'Ajanjakso',
  },
  infrastructure: {
    title: 'Infrastruktuuri',
  },
  history: {
    title: 'Historiatiedot ja tapahtumat (provenienssi)',
  },
  projectV2: {
    title: 'Projekti ja rahoitus',
  },
}

export default sections
