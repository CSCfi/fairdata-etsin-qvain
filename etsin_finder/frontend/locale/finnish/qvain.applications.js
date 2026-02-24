// Qvain REMS applications handling
const applications = {
  notFound: 'Hakuehtoja vastaavia hakemuksia ei löytynyt.',
  table: {
    application: 'Hakemus',
    dataset: 'Aineisto',
    applicant: 'Hakija',
    status: 'Tila',
    view: 'Näytä',
  },
  filters: {
    title: 'Suodata hakemuksia:',
    all: 'Kaikki',
    todo: 'Odottaa käsittelyä',
    handled: 'Käsitelty',
  },
  modal: {
    application: 'Hakemus',
    applicant: 'Hakija',
    dataset: 'Hakemus aineistolle',
    all: 'Kaikki',
    todo: 'Odottaa käsittelyä',
    handled: 'Käsitelty',
    tabs: {
      details: 'Tiedot',
      events: 'Tapahtumat',
    },
    terms: 'Hyväksytyt ehdot ja lisenssit',
    instructions: 'Ohjeet',
    comment: 'Kommentti',
  },
  actions: {
    title: 'Toiminnot',
    approveOrReject: 'Hyväksy tai hylkää',
    approveOrRejectLong: 'Hyväksy tai hylkää hakemus',
    approveOrRejectInfo:
      'Hakemuksen hyväksyminen sallii hakijalle pääsyn aineiston dataan. ' +
      'Hylätyn hakemuksen hakija voi halutessaan tehdä uuden hakemuksen.',
    comment: 'Lisää kommentti (näkyy hakijalle)',
    approve: 'Hyväksy',
    reject: 'Hylkää',
    returnInfo: 'Pyydä käyttäjää tekemään muutoksia hakemukseen ja lähettämään sen uudestaan. ',
    return: 'Pyydä muutoksia',
    close: 'Sulje hakemus',
    closeInfo:
      'Tarpeettomaksi jääneen hakemuksen voi sulkea. ' +
      'Jos aineisto on hyväksytty, sulkeminen myös poistaa sen hyväksynnän.',
  },
}

export default applications
