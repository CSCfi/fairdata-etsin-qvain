const validationMessages = {
  types: {
    string: {
      date: 'Arvon on oltava päivämäärämerkkijono.',
      number: 'Arvon on oltava numeromerkkijono.',
    },
  },
  draft: {
    description: 'Luonnosta ei voi tallentaa ennen kuin seuraavat virheet on korjattu:',
  },
  publish: {
    description: 'Aineistoa ei voida julkaista ennen kuin seuraavat virheet on korjattu:',
  },
  title: {
    string: 'Otsikon tulisi olla arvoltaan merkkijono.',
    max: 'Otsikko on liian pitkä.',
    required: 'Otsikko on pakollinen vähintään yhdellä kielellä.',
  },
  description: {
    string: 'Kuvaus tulisi olla arvoltaan merkkijono.',
    max: 'Kuvaus on liian pitkä.',
    required: 'Kuvaus on pakollinen vähintään yhdellä kielellä.',
  },
  issuedDate: {
    requiredIfUseDoi:
      'Julkaisupäivämäärä on pakollinen kenttä jos haluat käyttää DOI -tunnistetta.',
  },
  otherIdentifiers: {
    string: 'Tunnisteet tulisivat olla arvoltaan merkkijonoja.',
    url: 'Tunnisteet täytyy olla valideja URL:eja',
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
      oneOf: 'Toimijan tyyppi pitää olla joko "Luonnollinen henkilö" tai "Organisaatio".',
      required: 'Toimijan tyyppi on pakollinen.',
    },
    roles: {
      mixed: '',
      oneOf:
        'Roolin kuuluisi olla "Tekijä", "Julkasija", "Kuraattori", "Oikeuksienhaltija", "Muut tekijät" tai "Provenienssi.',
      required: 'Tekijän rooli on pakollinen.',
    },
    name: {
      string: 'Nimi pitää olla arvoltaan merkkijono.',
      max: 'Nimi on liian pitkä.',
      required: 'Nimi on pakollinen kenttä.',
    },
    email: {
      string: 'Sähköposti pitää olla arvoltaan merkkijono.',
      max: 'Sähköposti on liian pikä.',
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
      name: 'Organisaation nimen tulee olla merkkijono.',
      required: 'Organisaatio on pakollinen kenttä.',
    },
    requiredActors: {
      atLeastOneActor: 'Aineistoon on lisättävä vähintään yksi toimija.',
      mandatoryActors: {
        creator:
          'Toimijat: Aineistolla on oltava ainakin yksi tekijä. Huomioi: yksittäisellä toimijalla voi olla useampi rooli.',
        publisher:
          'Toimijat: Aineistolla on oltava ainakin yksi julkaisija. Huomioi: yksittäisellä toimijalla voi olla useampi rooli.',
      },
    },
  },
  accessType: {
    string: 'Pääsyoikeus tulisi olla arvoltaan merkkijono.',
    url: 'Virhe pääsyoikeuden referenssiarvossa.',
    required: 'Pääsyoikeus on pakollimen kenttä.',
  },
  restrictionGrounds: {
    string: 'Kentän arvo tulisi olla merkkijono.',
    url: 'Virhe satavuutta rajoitettu-kentän referenssiarvossa.',
    required: 'Saatavuutta rajoitettu on pakollinen kenttä jos pääsyoikeus ei ole "Avoin".',
  },
  license: {
    requiredIfIDA: 'Lisenssi on pakollinen kenttä kun tiedoston lähde on IDA.',
    otherUrl: {
      string: 'Lisenssin URL pitää olla merkkijono.',
      url: 'Lisenssin URL pitää olla oikeanlainen URL.',
      required: 'Lisenssin URL on pakollinen kenttä.',
    },
  },
  files: {
    dataCatalog: {
      required: 'Tiedoston lähde on pakollinen kenttä.',
      wrongType: 'Tiedoston lähde on väärää tyyppiä tai se puuttuu kokonaan.',
    },
    file: {
      title: {
        required: 'Tiedoston otsikko on pakollinen kenttä.',
      },
      description: {
        required: 'Tiedoston kuvaus on pakollinen kenttä.',
      },
      useCategory: {
        required: 'Tiedoston käyttökategoria on pakollinen kenttä.',
      },
    },
    directory: {
      title: {
        required: 'Hakemiston otsikko on pakollinen kenttä.',
      },
      useCategory: {
        required: 'Hakemiston käyttökategoria on pakollinen kenttä.',
      },
    },
  },
  externalResources: {
    title: {
      required: 'Ulkoisen aineiston otsikko on pakollinen kenttä.',
    },
    useCategory: {
      required: 'Ulkoisen aineiston käyttökategoria on pakollinen kenttä.',
    },
    accessUrl: {
      validFormat: 'Ulkoisen aineiston sivun URL pitää olla oikeassa URL-formaatissa.',
    },
    downloadUrl: {
      validFormat: 'Ulkoisen aineiston latauslinkin URL pitää olla oikeassa URL-formaatissa.',
    },
  },
  projects: {
    title: {
      required: 'Lisää vähintään yksi kieli',
      string: 'Nimen täytyy olla merkkijono.',
    },
    organization: {
      name: 'Nimi täytyy täyttää',
      email: 'Sähköpostiosoite ei kelpaa',
      min: 'Vähintään yksi organisaatio tarvitaan',
    },
    fundingAgency: {
      contributorType: {
        identifier: 'Rooli on pakollinen kenttä.',
      },
    },
  },
  temporalAndSpatial: {
    spatial: {
      nameRequired: 'Nimi on pakollinen kenttä.',
      altitudeNan: 'Korkeuden täytyy olla numero.',
    },
    temporal: {
      startDateMissing: 'Alkamisajankohta puuttuu.',
      endDateMissing: 'Loppuajankohta puuttuu.',
    },
  },
  history: {
    relatedResource: {
      nameRequired: 'Nimi kenttä on pakollinen ainakin yhdellä kielellä.',
      typeRequired: 'Viitteen tyyppi on pakollinen kenttä.',
    },
    provenance: {
      nameRequired: 'Nimi vaaditaan vähintään yhdellä kielellä.',
      startDateMissing: 'Alkamispäivämäärä puuttuu',
      endDateMissing: 'Loppumispäivämäärä puuttuu',
    },
  },
}

export default validationMessages
