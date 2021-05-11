import actors from './qvain.actors'
import datasets from './qvain.datasets'
import description from './qvain.description'
import files from './qvain.files'
import general from './qvain.general'
import history from './qvain.history'
import home from './qvain.home'
import nav from './qvain.nav'
import project from './qvain.project'
import rightsAndLicenses from './qvain.rightsAndLicenses'
import temporalAndSpatial from './qvain.temporalAndSpatial'
import validationMessages from './qvain.validationMessages'

const qvainFinnish = {
  saveDraft: 'Tallenna Luonnos',
  submit: 'Julkaise Aineisto',
  edit: 'Päivitä Aineisto',
  unsavedChanges:
    'Sinulla on tallentamattomia muutoksia. Oletko varma että haluat poistua sivulta?',
  consent:
    'Käyttämällä Qvain -työkalua käyttäjä vakuuttaa, että hän on saanut suostumuksen muiden henkilöiden henkilötietojen lisäämiseen kuvailutietoihin ja ilmoittanut heille miten he voivat saada henkilötietonsa poistettua palvelusta. Käyttämällä Qvain -työkalua käyttäjä hyväksyy <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">käyttöehdot</a>.',
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
  useDoiHeader: 'DOI-tunnisteen luominen',
  useDoiContent:
    'Olet pyytänyt aineistollesi pysyväksi tunnisteeksi DOIn URN-tunnisteen sijaan. DOI vaatii, että julkaisupäivämäärä ja julkaisija on määritelty. DOI-tunniste rekisteröidään DataCite-palvelun tietokantaan, eikä toimintoa voi peruuttaa. Oletko varma?',
  useDoiAffirmative: 'Kyllä',
  useDoiNegative: 'Ei',
  notCSCUser1:
    'Varmistakaa että teillä on voimassaoleva CSC tunnus. Jos yritit kirjautua sisään ulkoisella tunnuksella (kuten Haka) niin saatat saada tämän ' +
    'virheilmoituksen, jos tilit eivät ole linkitetty. Linkityksen voi tehdä',
  notCSCUserLink: ' CSC asiakas porttaalissa',
  notCSCUser2: ' Voit rekisteröityä Hakatunuksella tai ilman.',
  notLoggedIn: 'Kirjaudu sisään CSC -tililläsi käyttääksesi Qvain -palvelua.',
  titleCreate: 'Lisää uusi aineisto',
  titleEdit: 'Muokkaa aineistoa',
  titleLoading: 'Ladataan aineistoa',
  titleLoadingFailed: 'Aineiston Lataus Epäonnistui',
  error: {
    deprecated:
      'Aineistoa ei voida julkaista, koska aineisto on vanhentunut. Korjaa vanhentunut aineisto ensin.',
    permission: 'Oikeusvirhe aineiston latauksessa',
    missing: 'Aineistoa ei löydy',
    default: 'Virhe ladattaessa aineistoa',
    render: 'Aineiston renderöinnissä tapahtui virhe',
    component: 'Kentän %(field)s renderöinnissä tapahtui virhe',
  },
  backLink: ' Takaisin aineistolistaan',
  common: {
    save: 'Tallenna',
    cancel: 'Peruuta',
  },
  confirmClose: {
    warning: 'Sinulla on tallentamattomia muutoksia. Perutaanko muutokset?',
    confirm: 'Kyllä, peru muutokset',
    cancel: 'Ei, jatka muokkausta',
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
    placeholder: {
      name: 'Nimi',
      email: 'Sähköposti',
      identifier: 'esim. http://orcid.org',
    },
  },
  actors,
  datasets,
  description,
  files,
  general,
  history,
  home,
  nav,
  project,
  rightsAndLicenses,
  temporalAndSpatial,
  validationMessages,
}

export default qvainFinnish
