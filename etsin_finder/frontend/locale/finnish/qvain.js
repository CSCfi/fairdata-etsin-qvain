import actors from './qvain.actors'
import datasets from './qvain.datasets'
import description from './qvain.description'
import files from './qvain.files'
import general from './qvain.general'
import geographics from './qvain.geographics'
import historyV2 from './qvain.historyV2'
import home from './qvain.home'
import nav from './qvain.nav'
import projectV2 from './qvain.projectv2'
import publications from './qvain.publications'
import rightsAndLicenses from './qvain.rightsAndLicenses'
import validationMessages from './qvain.validationMessages'
import sections from './qvain.sections'
import infrastructure from './qvain.infrastructure'
import timePeriod from './qvain.timePeriod'

const qvainFinnish = {
  saveDraft: 'Tallenna luonnoksena',
  submit: 'Tallenna ja julkaise',
  edit: 'Päivitä aineisto',
  required: 'Pakollinen. ',
  requiredTitleOrDescription: 'Pakollinen vähintään joko suomeksi tai englanniksi.',
  unsavedChanges:
    'Sinulla on tallentamattomia muutoksia. Oletko varma että haluat poistua sivulta?',
  consent: `Käyttämällä Qvain -työkalua käyttäjä vakuuttaa, että hän on saanut suostumuksen
    muiden henkilöiden henkilötietojen lisäämiseen kuvailutietoihin ja ilmoittanut
    heille, miten he voivat saada henkilötietonsa poistettua palvelusta.
    Käyttämällä Qvain -työkalua käyttäjä hyväksyy
    <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">käyttöehdot</a>.`,
  submitStatus: {
    success: 'Aineisto julkaistu!',
    draftSuccess: 'Luonnos tallennettu!',
    fail: 'Jotain meni pieleen...',
    editFilesSuccess: 'Uusi aineistoversio luotu!',
    editMetadataSuccess: 'Aineiston päivitys onnistui!',
  },
  pasInfo: {
    stateInfo: 'Tämä on PAS-aineisto. Aineiston tila on "%(state)s: %(description)s".',
    editable: 'Voit muuttaa kuvauksia muttet lisätä tai poistaa tiedostoja.',
    readonly: 'Voit katsoa kuvauksia muttet tehdä muutoksia.',
  },
  pasState: {
    0: 'Odottaa tarkastusta',
    10: 'Rikastaa',
    20: 'Tarkastaa',
    30: 'Rikastus katkesi',
    40: 'Korjaa metatietoja',
    50: 'Tarkastus katkesi',
    60: 'Metatieto päivitetty',
    65: 'Tarkastetaan metatietoja',
    70: 'Odottaa siirtoa',
    75: 'Metadata vahvistettu',
    80: 'Siirto aloitettu',
    90: 'Paketoi',
    100: 'Paketointi katkesi',
    110: 'Siirtää',
    120: 'OK – säilytyksessä',
    130: 'Siirto katkesi',
    140: 'Saatavilla',
  },
  notCSCUser1:
    'Varmistakaa että teillä on voimassaoleva CSC tunnus. Jos yritit kirjautua sisään ulkoisella tunnuksella (kuten Haka) niin saatat saada tämän ' +
    'virheilmoituksen, jos tilit eivät ole linkitetty. Linkityksen voi tehdä',
  notCSCUserLink: ' CSC asiakasportaalissa',
  notCSCUser2: ' Voit rekisteröityä Hakatunuksella tai ilman.',
  notLoggedIn: 'Kirjaudu sisään CSC -tililläsi käyttääksesi Qvain -palvelua.',
  titleCreate: 'Uusi aineistokuvailu',
  titleEdit: 'Muokkaa aineistokuvailua',
  titleLoading: 'Ladataan aineistoa',
  titleLoadingFailed: 'Aineiston Lataus Epäonnistui',
  lock: {
    force: 'Muokkaa aineistoa',
    error: 'Aineiston avaaminen muokattavaksi epäonnistui.',
    unavailable: 'Aineisto on auki käyttäjällä %(user)s ja on vain luku -tilass.',
  },
  error: {
    deprecated:
      'Aineistoa ei voida julkaista, koska aineisto on vanhentunut. Korjaa vanhentunut aineisto ensin.',
    permission: 'Oikeusvirhe aineiston latauksessa',
    missing: 'Aineistoa ei löydy',
    default: 'Virhe ladattaessa aineistoa',
    render: 'Aineiston renderöinnissä tapahtui virhe',
    component: 'Kentän %(field)s renderöinnissä tapahtui virhe',
  },
  backLink: ' Takaisin aineistoihin',
  common: {
    save: 'Tallenna',
    cancel: 'Peruuta',
    close: 'Sulje',
  },
  confirmClose: {
    warning: 'Sinulla on tallentamattomia muutoksia. Perutaanko muutokset?',
    confirm: 'Kyllä, peru muutokset',
    cancel: 'Ei, jatka muokkaamista',
  },
  select: {
    placeholder: 'Valitse vaihtoehto',
    searchPlaceholder: 'Hae vaihtoehtoja kirjoittamalla',
  },
  organizationSelect: {
    label: {
      addNew: 'Lisää organisaatio käsin',
      name: 'Organisaation nimi',
      email: 'Organisaation sähköposti',
      identifier: 'Organisaation yksilöivä tunniste',
    },
    infoText: {
      name: 'Nimi',
      email: 'Sähköposti',
      identifier: 'Esim. http://orcid.org',
    },
  },
  unsupported: {
    info: `Aineisto sisältää kenttiä joita Qvain ei tue tällä hetkellä.
    Aineiston tallentaminen voi aiheuttaa kenttien datan menetyksen.`,
    showDetails: 'Näytä tukemattomat kentät',
    hideDetails: 'Piilota tukemattomat kentät',
  },
  state: {
    published: '',
    draft: 'Aineistokuvailua ei ole vielä julkaistu',
    changed: 'Aineistokuvailu on julkaistu, mutta se sisältää julkaisemattomia muutoksia',
  },
  sections,
  actors,
  datasets,
  description,
  files,
  general,
  geographics,
  historyV2,
  home,
  nav,
  projectV2,
  publications,
  rightsAndLicenses,
  validationMessages,
  infrastructure,
  timePeriod,
}

export default qvainFinnish
