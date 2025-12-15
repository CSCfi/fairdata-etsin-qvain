const sections = {
  adminOrg: {
    title: 'Kuvailutietojen ylläpito-oikeudet organisaatiolle',
  },
  dataOrigin: {
    title: 'Datalähde',
    buttons: {
      ida: {
        title: 'IDA',
        description: 'Valitse "IDA" jos datasi on Fairdata IDA ‑palvelussa',
      },
      att: {
        title: 'Ulkoinen lähde',
        description: 'Valitse "ulkoinen lähde", jos datasi sijaitsee ulkopuolisessa palvelussa',
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
    infoText: 'Huom! Et voi muuttaa Datalähdettä enää tallennuksen (luonnos/julkaisu) jälkeen.',
    error: {
      title: 'Katalogien lataus epäonnistui',
      description: 'Katalogien lataamisessa tapahtui virhe. Ole hyvä ja yritä uudelleen.',
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
