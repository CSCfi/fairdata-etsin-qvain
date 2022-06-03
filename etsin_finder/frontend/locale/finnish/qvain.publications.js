const publications = {
  title: 'Aineistoon liittyvät julkaisut ja muut tuotokset',
  infoText: `Viittaukset aineistoihin, julkaisuihin tai muihin tuotoksiin,
      jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.`,
  select: {
    newRelation: 'Luo uusi viittaus',
    placeholder: 'Luo uusi viittaus tai etsi viittauksia ulkoisesta lähteestä',
  },
  tooltipContent: {
    title: 'Viittaukset',
    paragraph: `Viittaukset aineistoihin, julkaisuihin tai muihin tuotoksiin,
      jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.`,
  },
  search: {
    title: 'Haku',
    infoText: 'Haku käynnistyy, kun alat kirjoittaa julkaisun nimeä.',
  },
  publications: {
    title: 'Julkaisut',
    infoText:
      'Voit täyttää julkaisun tiedot joko manuaalisesti ao. kenttiin tai hakea tiedot Crossref -palvelusta (crossref.org).',
    noItems: 'Viittauksia toisiin julkaisuihin ei ole lisätty.',

    name: {
      fi: {
        label: 'Nimi',
        infoText: 'Nimi (suomi)',
      },
      en: {
        label: 'Nimi',
        infoText: 'Nimi (englanti)',
      },
    },

    description: {
      fi: {
        label: 'Kuvaus',
        infoText: 'Kuvaus (suomi)',
      },
      en: {
        label: 'Kuvaus',
        infoText: 'Kuvaus (englanti)',
      },
    },

    identifier: {
      label: 'Tunniste',
      infoText: 'Julkaisun tunniste. On suositeltavaa käyttää pysyviä tunnisteita, jos saatavilla.',
    },

    relationType: {
      label: 'Viitteen tyyppi',
      infoText: 'Viitteen tyyppi',
    },

    modal: {
      formTitle: 'Julkaisun tiedot',
      addButton: 'Lisää julkaisu',
      title: {
        add: 'Lisää julkaisu',
        edit: 'Muokkaa julkaisua',
      },
      buttons: {
        save: 'Lisää julkaisu',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
    },
  },
  otherResources: {
    title: 'Muut tuotokset',
    noItems: 'Viittauksia muihin tuotoksiin ei ole lisätty',

    name: {
      fi: {
        label: 'Nimi',
        infoText: 'Nimi (suomi)',
      },
      en: {
        label: 'Nimi',
        infoText: 'Nimi (englanti)',
      },
    },
    description: {
      fi: {
        label: 'Kuvaus',
        infoText: 'Kuvaus (suomi)',
      },
      en: {
        label: 'Kuvaus',
        infoText: 'Kuvaus (englanti)',
      },
    },

    identifier: {
      label: 'Tunniste',
      infoText: 'Resurssin tunniste. On suositeltavaa käyttää pysyviä tunnisteita, jos saatavilla.',
    },
    relationType: {
      label: 'Viitteen tyyppi',
      infoText: 'Viitteen tyyppi',
    },
    entityType: {
      label: 'Tuotoksen tyyppi',
      infoText: 'Tuotoksen tyyppi',
    },

    modal: {
      addButton: 'Lisää viittaus toiseen tuotokseen',
      title: {
        add: 'Lisää viittaus toiseen tuotokseen',
        edit: 'Muokkaa viittausta toiseen tuotokseen',
      },
      buttons: {
        save: 'Lisää viittaus',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
    },
  },
}

export default publications
