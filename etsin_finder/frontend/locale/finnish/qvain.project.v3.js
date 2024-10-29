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
    funding: {
      addButton: 'Lisää rahoitus',
      title: {
        add: 'Lisää rahoitus',
        edit: 'Muokkaa rahoitusta',
      },
    },
  },
  section: {
    title: {
      project: 'Projektin tiedot',
      funding: 'Rahoitus',
    },
  },
  fields: {
    title: {
      en: {
        label: 'Projektin nimi englanniksi',
        infoText: 'Projektin nimi englanniksi',
      },
      fi: {
        label: 'Projektin nimi suomeksi',
        infoText: 'Projektin nimi suomeksi',
      },
    },
    project_identifier: {
      label: 'Projektin tunniste',
      infoText:
        'Lisää projektin tunniste. On suositeltavaa käyttää yleisiä tunnisteita, jos saatavilla.',
    },
    participating_organizations: {
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
    funding: {
      funder: {
        title: 'Rahoittaja',
      },
      fields: {
        funding_identifier: {
          label: 'Rahoitustunniste',
          infoText:
            'Uniikki rahoitustunniste (tai rahoituspäätöksen tunniste). On suositeltavaa käyttää pysyviä tunnisteita, jos saatavilla.',
        },
        funder: {
          fields: {
            funder_type: {
              label: 'Rahoitustyyppi',
              infoText: 'Projektin rahoitustyyppi',
            },
            organization: {
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
          },
        },
      },
    },
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
