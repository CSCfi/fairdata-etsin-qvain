const general = {
  looseActors: {
    warning:
      'Osan toimijoiden rooliksi on merkattu vain Provenienssi, mutta ne eivät ole kiinnitetty yhteenkään provenienssiin. Aineiston tallentamisen yhteydessä nämä toimijat häviävät. Tallennuksen yhteydessä seuraavat tiedot poistetaan:',
    question: 'Haluatko jatkaa aineiston tallentamista?',
    cancel: 'Ei, jatka muokkausta',
    confirm: 'Kyllä, jatka tallentamista',
  },
  looseProvenances: {
    warning: 'Toimija, jota olet poistamassa on kiinnitettynä seuraaviin proveniensseihin:',
    question: 'Toimija poistetaan myös edellä mainituista proveniensseista. Haluatko silti jatkaa?',
    confirm: 'Kyllä, poista toimija ja sen viitteet',
    cancel: 'Ei, peru toimijan poistaminen',
  },
  lang: {
    en: 'Englanti',
    fi: 'Suomi',
    sv: 'Ruotsi',
  },
  buttons: {
    edit: 'Muokkaa',
    remove: 'Poista',
    add: 'Lisää',
    save: 'Tallenna',
    cancel: 'Peruuta',
  },
  sort: {
    ascending: 'Nouseva',
    descending: 'Laskeva',
  },
}

export default general
