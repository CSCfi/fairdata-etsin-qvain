const project = {
  title: 'Projekti',
  description: 'Projekti jonka tuotoksena aineisto on luotu',
  addButton: 'Lisää',
  editButton: 'Muokkaa',
  tooltipContent: {
    title: 'Projekti',
    paragraph: 'Projekti jonka tuotoksena aineisto on luotu',
  },
  project: {
    title: 'Lisää projekti',
    addButton: 'Lisää',
    description: 'Projekti jonka tuotoksena aineisto on luotu',
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
      description: 'Projektin nimi, lisää vähintään yksi kieli.',
    },
    titleEn: {
      placeholder: 'Nimi (Engalnti)',
    },
    titleFi: {
      placeholder: 'Nimi (Suomi)',
    },
    identifier: {
      label: 'Yksilöivä tunniste',
      description:
        'Yksiselitteinen viittaus resurssiin tietyssä kontekstissa. On suositeltavaa käyttää virallisen tunnistamisjärjestelmän mukaisesta tunnistetta.',
      placeholder: 'Tunniste',
    },
    fundingIdentifier: {
      label: 'Rahoitustunniste',
      description: 'Projektin uniikki rahoitustunniste',
      placeholder: 'Tunniste',
    },
    funderType: {
      label: 'Rahoitustyyppi',
      placeholder: 'Valitse rahoitustyyppi',
      addButton: 'Lisää rahoitustyyppi',
      noOptions: 'Rahoitustyyppiä ei löytynyt',
    },
    organization: {
      placeholder: {
        organization: 'Valitse organisaatio',
        department: 'Valitse osasto',
      },
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
        description: 'Valitse organisaation rooli projektin avustajana.',
        organization: {
          label: 'Valitse organisaatio',
          validation: 'Organisaatio tarvitaan',
        },
        identifier: {
          label: 'Rooli',
        },
        definition: {
          label: 'Selite',
          description: 'Lisäselite organisaation roolille',
          placeholderEn: 'Selite (Englanti)',
          placeholderFi: 'Selite (Suomi)',
        },
        addButton: 'Lisää rooli',
        editButton: 'Muokkaa roolia',
      },
      addButton: 'Lisää avustaja',
      editButton: 'Muokkaa avustajaa',
    },
  },
}

export default project
