const validationMessages = {
  types: {
    string: {
      date: 'Arvon on oltava päivämäärämerkkijono.',
      number: 'Arvon on oltava numeromerkkijono.',
    },
  },
  draft: {
    description: 'Luonnosta ei voida tallentaa ennen kuin seuraavat virheet on korjattu:',
  },
  publish: {
    description: 'Aineistoa ei voida julkaista ennen kuin seuraavat virheet on korjattu:',
  },
  title: {
    string: 'Otsikon tulisi olla arvoltaan merkkijono.',
    max: 'Otsikko on liian pitkä.',
    required: 'Otsikko on pakollinen vähintään joko suomeksi tai englanniksi.',
  },
  description: {
    string: 'Kuvaus tulisi olla arvoltaan merkkijono.',
    max: 'Kuvaus on liian pitkä.',
    required: 'Kuvaus on pakollinen vähintään joko suomeksi tai englanniksi.',
  },
  issuedDate: {
    requiredIfUseDoi: 'Julkaisupäivämäärä on pakollinen tieto jos haluat käyttää DOI -tunnistetta.',
  },
  otherIdentifiers: {
    string: 'Tunnisteet tulisivat olla arvoltaan merkkijonoja.',
    max: 'Tunniste on liian pitkä.',
    min: 'Tunnisteen pitää olla vähintään 10 merkkiä pitkä.',
  },
  fieldOfScience: {},
  keywords: {
    string: 'Avainsanat tulisi olla arvoltaan merkkijonoja.',
    max: 'Avainsana on liian pitkä.',
    required: 'Vähintään yksi avainsana on pakollinen.',
  },
  actors: {
    type: {
      mixed: '',
      oneOf: 'Toimijan tyyppi pitää olla joko "Henkilö" tai "Organisaatio".',
      required: 'Toimijan tyyppi on pakollinen.',
    },
    roles: {
      mixed: '',
      oneOf:
        'Roolin kuuluisi olla "Tekijä", "Julkaisija", "Kuraattori", "Oikeuksienhaltija" tai "Muu tekijä".',
      required: 'Tekijän rooli on pakollinen.',
      min: 'Toimijalla täytyy olla vähintään yksi rooli',
    },
    name: {
      string: 'Nimi pitää olla arvoltaan merkkijono.',
      max: 'Nimi on liian pitkä.',
      required: 'Nimi on pakollinen tieto.',
    },
    email: {
      string: 'Sähköposti pitää olla arvoltaan merkkijono.',
      max: 'Sähköposti on liian pitkä.',
      email: 'Lisää validi sähköposti.',
      nullable: '',
    },
    identifier: {
      string: '',
      max: 'Tunniste on liian pitkä.',
      nullable: '',
    },
    organization: {
      mixed: '',
      object: 'Valitun organisaation tulee olla olio.',
      name: 'Organisaation nimi on pakollinen tieto.',
      required: 'Organisaatio on pakollinen tieto.',
    },
    requiredActors: {
      atLeastOneActor: 'Aineistoon on lisättävä vähintään yksi toimija.',
      creator:
        'Toimijat: Aineistolla on oltava ainakin yksi tekijä. Huomioi: yksittäisellä toimijalla voi olla useampi rooli.',
      publisher:
        'Toimijat: Aineistolla on oltava ainakin yksi julkaisija. Huomioi että yksittäisellä toimijalla voi olla useampi rooli.',
    },
  },
  accessType: {
    string: 'Pääsyoikeus tulisi olla arvoltaan merkkijono.',
    url: 'Virhe pääsyoikeuden referenssiarvossa.',
    required: 'Pääsyoikeus on pakollinen tieto.',
  },
  restrictionGrounds: {
    string: 'Kentän arvo tulisi olla merkkijono.',
    url: 'Virhe rajoituksen peruste -kentän referenssiarvossa.',
    required: 'Rajoituksen peruste on pakollinen tieto jos pääsyoikeus ei ole "Avoin".',
  },
  license: {
    requiredIfIDA: 'Lisenssi on pakollinen tieto kun tiedoston lähde on IDA.',
    otherUrl: {
      string: 'Lisenssin URL pitää olla merkkijono.',
      url: 'Lisenssin URL pitää olla oikeanlainen URL.',
      required: 'Lisenssin URL on pakollinen tieto.',
    },
  },
  files: {
    dataCatalog: {
      required: 'Tiedoston lähde on pakollinen tieto.',
      wrongType: 'Tiedoston lähde on väärää tyyppiä tai se puuttuu kokonaan.',
    },
    file: {
      title: {
        required: 'Tiedoston otsikko on pakollinen tieto.',
      },
      description: {
        required: 'Tiedoston kuvaus on pakollinen tieto.',
      },
      useCategory: {
        required: 'Tiedoston käyttökategoria on pakollinen tieto.',
      },
    },
    directory: {
      title: {
        required: 'Hakemiston otsikko on pakollinen tieto.',
      },
      useCategory: {
        required: 'Hakemiston käyttökategoria on pakollinen tieto.',
      },
    },
  },
  externalResources: {
    title: {
      required: 'Ulkoisen aineiston otsikko on pakollinen tieto.',
    },
    useCategory: {
      required: 'Ulkoisen aineiston käyttökategoria on pakollinen tieto.',
    },
    accessUrl: {
      validFormat: 'Ulkoisen aineiston pitää olla oikeassa URL-formaatissa.',
    },
    downloadUrl: {
      validFormat: 'Ulkoisen aineiston latauslinkin URL pitää olla oikeassa URL-formaatissa.',
    },
  },
  projects: {
    title: {
      required: 'Projektin nimi on pakollinen vähintään yhdellä kielellä.',
      string: 'Nimen täytyy olla merkkijono.',
    },
    organization: {
      mixed: '',
      object: 'Valitun organisaation tulee olla olio.',
      name: 'Organisaation nimi on pakollinen tieto.',
      required: 'Organisaatio on pakollinen tieto.',
      min: 'Projektissa täytyy olla vähintään yksi organisaatio.',
      email: 'Organisaation sähköpostiosoite on viallinen.',
    },
    fundingAgency: {
      contributorType: {
        identifier: 'Organisaation rooli on pakollinen tieto.',
      },
    },
  },
  temporalAndSpatial: {
    spatial: {
      nameRequired: 'Nimi on pakollinen.',
      altitudeNan: 'Korkeuden täytyy olla numero.',
    },
    temporal: {
      dateMissing: 'Ajankohta puuttuu.',
    },
  },
  history: {
    relatedResource: {
      nameRequired: 'Nimitieto on pakollinen vähintään yhdellä kielellä.',
      typeRequired: 'Viitteen tyyppi on pakollinen tieto.',
    },
    provenance: {
      nameRequired: 'Nimitieto on pakollinen vähintään yhdellä kielellä.',
      startDateMissing: 'Alkamispäivämäärä puuttuu',
      endDateMissing: 'Loppumispäivämäärä puuttuu',
    },
  },
  publications: {
    nameRequired: 'Nimitieto on pakollinen vähintään yhdellä kielellä.',
    typeRequired: 'Viitteen tyyppi on pakollinen tieto.',
    entityTypeRequired: 'Resurssin tyyppi pakollinen tieto.',
  },
}

export default validationMessages
