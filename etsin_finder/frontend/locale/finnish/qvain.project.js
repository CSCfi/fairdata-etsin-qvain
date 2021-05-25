const project = {
  title: 'Projekti',
  description: 'Projekti jonka tuotoksena aineisto on luotu',
  addButton: 'Lisää',
  editButton: 'Muokkaa',
  tooltipContent: {
    title: 'Projekti',
    paragraph: 'Projekti jonka tuotoksena aineisto on luotu',
  },
  organization: {
    title: 'Organisaatio *',
    description: 'Organisaatio(t), jotka ovat olleet osallisena projektissa',
  },
  fundingAgency: {
    title: 'Rahoittajaorganisaatio',
  },
  inputs: {
    title: {
      label: 'Lisää projektin otsikko',
      description: 'Projektin nimi on pakollinen vähintään yhdellä kielellä.',
    },
    titleEn: {
      placeholder: 'Nimi (englanti)',
    },
    titleFi: {
      placeholder: 'Nimi (suomi)',
    },
    identifier: {
      label: 'Tunniste',
      description: 'On suositeltavaa käyttää yleisiä tunnisteita, jos saatavilla.',
      placeholder: 'Lisää tunniste',
    },
    fundingIdentifier: {
      label: 'Rahoitustunniste',
      description: 'Projektin uniikki rahoitustunniste',
      placeholder: 'Lisää tunniste',
    },
    funderType: {
      label: 'Rahoitustyyppi',
      placeholder: 'Valitse rahoitustyyppi',
      addButton: 'Lisää rahoitustyyppi',
      noOptions: 'Rahoitustyyppiä ei löytynyt',
    },
    organization: {
      levels: {
        organization: 'Organisaatio',
        department: 'Yksikkö',
        subdepartment: 'Aliyksikkö',
      },
      addButton: 'Lisää organisaatio',
      editButton: 'Muokkaa organisaatiota',
    },
    fundingAgency: {
      contributorType: {
        title: 'Organisaation rooli',
        description: 'Valitse projektiin liittyvän organisaation rooli.',
        organization: {
          label: 'Valitse organisaatio',
          validation: 'Organisaatio tarvitaan',
        },
        identifier: {
          label: 'Rooli',
          placeholder: 'Valitse rooli',
        },
        definition: {
          label: 'Kuvaus',
          description: 'Kuvaus organisaation roolille',
          placeholderEn: 'Kuvaus (englanti)',
          placeholderFi: 'Kuvaus (suomi)',
        },
        addButton: 'Lisää rooli',
        editButton: 'Muokkaa roolia',
      },
      addButton: 'Lisää organisaatio',
      editButton: 'Muokkaa organisaatiota',
    },
  },
}

export default project
