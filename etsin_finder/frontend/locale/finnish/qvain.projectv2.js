const project = {
  noItems: 'Projekteja ei ole lisätty.',
  infoText: 'Projekti, jonka tuotoksena aineisto on luotu.',
  modal: {
    title: {
      add: 'Lisää projekti ja rahoitus',
      edit: 'Muokkaa projektia ja rahoitus',
    },
    addButton: 'Lisää projekti',
    buttons: {
      save: 'Lisää projekti',
      editSave: 'Vahvista muutokset',
      cancel: 'Peruuta',
    },
  },
  title: {
    project: 'Projektin tiedot',
    funding: 'Rahoitus',
  },
  // fields
  name: {
    en: {
      label: 'Projektin nimi englanniksi',
      infoText: 'Projektin nimi englanniksi',
    },
    fi: {
      label: 'Projektin nimi suomeksi',
      infoText: 'Projektin nimi suomeksi',
    },
  },
  identifier: {
    label: 'Projektin tunniste',
    infoText:
      'Lisää projektin tunniste. On suositeltavaa käyttää yleisiä tunnisteita, jos saatavilla.',
  },
  organizations: {
    title: 'Organisaatiot',
    infoText: 'Projektiin osallistuneet organisaatiot',
    noItems: 'Ei lisättyjä organisaatioita',
    buttons: {
      save: 'Lisää organisaatio',
    },
    organization: {
      infoText: 'Organisaatio',
    },
    department: {
      infoText: 'Yksikkö',
    },
    subdepartment: {
      infoText: 'Aliyksikkö',
    },
  },
  funderType: {
    label: 'Rahoitustyyppi',
    infoText: 'Projektin rahoitustyyppi',
  },
  funderOrganization: {
    title: 'Rahoittajaorganisaatio',
    infoText: 'Organisaatio joka rahoittaa projektia',
    organization: {
      infoText: 'Organisaatio',
    },
    department: {
      infoText: 'Yksikkö',
    },
    subdepartment: {
      infoText: 'Aliyksikkö',
    },
  },
  fundingIdentifier: {
    label: 'Rahoitustunniste',
    infoText:
      'Uniikki rahoitustunniste (tai rahoituspäätöksen tunniste). On suositeltavaa käyttää pysyviä tunnisteita, jos saatavilla.',
  },
  inputs: {
    organization: {
      levels: {
        organization: 'Organisaatio',
        department: 'Yksikkö',
        subdepartment: 'Aliyksikkö',
      },
    },
  },
}

export default project
