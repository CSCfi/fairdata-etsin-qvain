const actors = {
  title: 'Toimijat',
  infoTitle: 'Toimijat info',
  addButton: 'Lisää uusi toimija',
  infoText: `<p>Toimijat info
Tutkimukseen tai aineiston tekemiseen osallistuneet henkilöt ja organisaatiot.
Voit määrittää Tekijät, Julkaisijan, Kuraattorit, Oikeuksienhaltijat sekä Muut tekijät.</p>
<p>Valitse ensin, onko kyseessä henkilö vai organisaatio. Määritä sen jälkeen,
missä roolissa ko. toimija osallistui tutkimukseen (voit valita useita),
ja määritä sen jälkeen tarvittavat tiedot. Jos kyseessä on henkilö,
on organisaatiotieto pakollinen tieto. Henkilölle on mahdollista ilmoittaa ORCID-tunniste.</p><p>
Jo tallennettuja tietoja pääset muuttamaan klikkaamalla tallennetun toimijan kohdalla kynä -ikonia.</p>
  `,

  errors: {
    loadingReferencesFailed: 'Referenssiorganisaatioiden latauksessa tapahtui virhe.',
  },
  add: {
    title: 'Toimijat',
    action: {
      create: 'Lisää uusi toimija',
      edit: 'Muokkaa toimijaa',
    },
    groups: {
      type: 'Toimijan tyyppi',
      roles: 'Roolit',
      info: 'Tiedot',
    },
    help: `Aineistolla on oltava ainakin yksi Tekijä ja Julkaisija.
      Huomioi että yksittäisellä toimijalla voi olla useampi rooli.`,
    radio: {
      person: 'Henkilö',
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
      infoText: {
        organization: 'Nimi',
        person: 'Etu- ja sukunimi',
        manualOrganization: 'Syötä organisaation nimi',
      },
      label: 'Nimi',
    },
    email: {
      placeholder: 'Sähköposti',
      infoText:
        'Sähköposti. Käyttäjä voi lähettää viestin Etsimestä, mutta varsinaista osoitetta ei näytetä.',
      label: 'Sähköposti',
    },
    identifier: {
      label: 'Tunniste',
      infoText: {
        person: 'Esim. http://orcid.org',
        organization: 'Esim. RAID-tunniste tai Y-tunnus',
      },
    },
    organization: {
      label: 'Organisaatio',
      placeholder: 'Hae organisaatiota tai syötä uusi organisaatio',
      infoText: 'Hae organisaatiota tai syötä uusi organisaatio',
      placeholderChild: '+ Lisää osasto tai yksikkö',
      infoTextChild: '+ Lisää osasto tai yksikkö',
      loading: 'Ladataan organisaatioita...',
      labels: {
        name: 'Organisaation nimi',
        email: 'Organisaation sähköposti',
        identifier: 'Organisaation tunniste',
        manualOrganization: 'Lisää uusi organisaatio',
      },
      options: {
        create: 'Lisää uusi organisaatio',
        dataset: 'Aineiston organisaatiot',
        presets: 'Organisaatiot',
      },
      details: 'Muokkaa organisaation tietoja',
    },
    save: {
      label: 'Lisää toimija',
    },
    edit: {
      label: 'Vahvista muutokset',
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
