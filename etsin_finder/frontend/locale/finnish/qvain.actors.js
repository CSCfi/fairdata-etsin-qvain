const actors = {
  title: 'Toimijat',
  infoTitle: 'Toimijat info',
  addButton: 'Lisää uusi toimija',
  infoText:
    'Tutkimukseen tai aineiston tekemiseen osallistuneet henkilöt ja organisaatiot. Voit määrittää tekijät (pakollinen), Julkaisijan, Kuraattorit, Oikeuksienhaltijat sekä Muut tekijät. Valitse ensin, onko kyseessä henkilö vai organisaatio. Määritä sen jälkeen, missä roolissa ko. toimija osallistui tutkimukseen (voit valita useita), ja määritä sen jälkeen tarvittavat tiedot. Jos kyseessä on henkilö, on organisaatiotieto pakollinen tieto. Jo annettuja tietoja pääset muuttamaan klikkaamalla tallennetun toimijan kohdalla kynä -ikonia.',
  errors: {
    loadingReferencesFailed: 'Referenssiorganisaatioiden latauksessa tapahtui virhe.',
  },
  add: {
    title: 'Toimijat',
    action: {
      create: 'Lisää toimija',
      edit: 'Muokkaa toimijaa',
    },
    groups: {
      type: 'Toimijan tyyppi',
      roles: 'Roolit',
      info: 'Tiedot',
    },
    help:
      'Aineistolla on oltava ainakin yksi tekijä. Huomioi että yksittäisellä toimijalla voi olla useampi rooli.',
    radio: {
      person: 'Luonnollinen henkilö',
      organization: 'Organisaatio',
    },
    checkbox: {
      creator: 'Tekijä',
      publisher: 'Julkaisija',
      curator: 'Kuraattori',
      rights_holder: 'Oikeuksienhaltija',
      contributor: 'Muu tekijä',
      provenance: 'Provenienssi',
    },
    name: {
      placeholder: {
        organization: 'Nimi',
        person: 'Etu- ja sukunimi',
      },
      label: 'Nimi',
    },
    email: {
      placeholder: 'Sähköposti',
      label: 'Sähköposti',
    },
    identifier: {
      label: 'Tunniste',
      placeholder: 'esim. http://orcid.org',
    },
    organization: {
      label: 'Organisaatio',
      placeholder: 'Esim. Helsingin yliopisto',
      placeholderChild: '+ Lisää osasto tai yksikkö',
      loading: 'Ladataan organisaatioita...',
      labels: {
        name: 'Organisaation nimi',
        email: 'Organisaation sähköposti',
        identifier: 'Organisaation tunniste',
      },
      options: {
        create: 'Lisää uusi organisaatio',
        dataset: 'Aineiston organisaatiot',
        presets: 'Organisaatiot',
      },
    },
    save: {
      label: 'Lisää toimija',
    },
    cancel: {
      label: 'Peruuta',
    },
    newOrganization: {
      label: 'Lisää',
    },
  },
  added: {
    title: 'Lisätyt toimijat',
    noneAddedNotice: 'Toimijoita ei ole lisätty.',
  },
}

export default actors
