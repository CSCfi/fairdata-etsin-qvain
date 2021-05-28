const history = {
  title: 'Aineistoon liittyvät tuotokset ja historia',
  tooltip: 'Aineestoon liittyvät tuotokset ja historia info',
  tooltipContent: {
    relatedResource: {
      title: 'Viittaukset',
      paragraph: `Viittaukset aineistoihin, julkaisuihin tai muihin tuotoksiin,
        jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.`,
    },
    provenance: {
      title: 'Historiatiedot',
      paragraph: `Tiedot aineiston historiatiedoista eli provenienssista.
      Tällaisia ovat muun muassa aineiston keruuseen, analysointiin tai esittelyyn liittyvät tilaisuudet.`,
    },
    infrastructure: {
      title: 'Infrastruktuuri',
      paragraph: 'Palvelut tai työkalut, joita aineiston tuottamisessa on hyödynnetty.',
    },
  },
  infrastructure: {
    addButton: 'Lisää infrastruktuuri',
    title: 'Infrastruktuuri',
    description:
      'Voit lisätä palveluita tai infrastruktuureita joita on käytetty aineiston tuottamiseen.',
    noItems: 'Infrastruktuureja ei ole lisätty.',
  },
  relatedResource: {
    title: 'Viittaukset toiseen tuotokseen',
    description: `Viittaukset aineistoihin, julkaisuihin tai muihin tuotoksiin,
        jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.`,
    noItems: 'Viittauksia toisiin tuotoksiin ei ole lisätty.',
    modal: {
      addButton: 'Lisää viittaus toiseen tuotokseen',
      title: {
        add: 'Lisää viittaus toiseen tuotokseen',
        edit: 'Muokkaa viittausta toiseen tuotokseen',
      },
      buttons: {
        save: 'Tallenna viittaus',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
      nameInput: {
        fi: {
          label: 'Nimi',
          placeholder: 'Nimi (suomi)',
        },
        en: {
          label: 'Nimi',
          placeholder: 'Nimi (englanti)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Kuvaus',
          placeholder: 'Kuvaus (suomi)',
        },
        en: {
          label: 'Kuvaus',
          placeholder: 'Kuvaus (englanti)',
        },
      },
      identifierInput: {
        label: 'Tunniste',
        placeholder: 'Tunniste',
      },
      relationTypeInput: {
        label: 'Viitteen tyyppi',
        placeholder: 'Viitteen tyyppi',
      },
      entityTypeInput: {
        label: 'Tuotoksen tyyppi',
        placeholder: 'Tuotoksen tyyppi',
      },
    },
  },
  provenance: {
    title: 'Historiatiedot (provenienssi)',
    description: 'Tapahtuma tai toiminta, jonka kohteena oli tämä aineisto.',
    noItems: 'Historiatietoja ei ole lisätty.',
    modal: {
      addButton: 'Lisää historiatieto',
      title: {
        add: 'Lisää historiatieto',
        edit: 'Muokkaa historiatietoa',
      },
      buttons: {
        save: 'Lisää historiatieto',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
      nameInput: {
        fi: {
          label: 'Nimi',
          placeholder: 'Nimi (suomi)',
        },
        en: {
          label: 'Nimi',
          placeholder: 'Nimi (englanti)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Seloste',
          placeholder: 'Seloste (suomi)',
        },
        en: {
          label: 'Seloste',
          placeholder: 'Seloste (englanti)',
        },
      },
      outcomeDescriptionInput: {
        fi: {
          label: 'Kuvaus lopputuloksesta',
          placeholder: 'Kuvaus lopputuloksesta (suomi)',
        },
        en: {
          label: 'Kuvaus lopputuloksesta',
          placeholder: 'Kuvaus lopputuloksesta (englanti)',
        },
      },
      periodOfTimeInput: {
        label: 'Ajanjakso',
        startPlaceholder: 'Alkamispäivämäärä',
        endPlaceholder: 'Päättymispäivämäärä',
      },
      locationInput: {
        label: 'Alueelliset tiedot',
        noItems: 'Alueellisia tietoja ei ole lisätty.',
        error: {
          nameRequired: 'Nimi on pakollinen tieto.',
          altitudeNan: 'Korkeus täytyy olla numero',
        },
        modal: {
          addButton: 'Lisää alueellinen tieto',
          buttons: {
            addGeometry: 'Lisää alueellinen tieto',
            save: 'Tallenna',
            editSave: 'Päivitä',
            cancel: 'Peruuta',
          },
          title: {
            add: 'Lisää alueellinen tieto',
            edit: 'Muokkaa alueellista tietoa',
          },
          nameInput: {
            label: 'Nimi',
            placeholder: 'Alueen nimi',
          },
          altitudeInput: {
            label: 'Korkeus',
            placeholder: 'Alueen korkeus ilmoitettuna WGS84 -referenssin mukaan',
          },
          addressInput: {
            label: 'Osoite',
            placeholder: 'Koko osoite',
          },
          geometryInput: {
            label: 'Geometria',
            placeholder: 'Geometria WKT-muodossa WGS84 -referenssin mukaan',
          },
          locationInput: {
            label: 'Paikka',
            placeholder: 'Etsi paikkoja hakusanalla',
          },
        },
      },
      outcomeInput: {
        label: 'Lopputulos',
        placeholder: 'Valitse lopputulos',
      },
      usedEntityInput: {
        label: 'Käytetyt kokonaisuudet',
        noItems: 'Ei lisättyjä käytettyjä kokonaisuuksia.',
        modal: {
          addButton: 'Lisää käytetty kokonaisuus',
          buttons: {
            save: 'Tallenna',
            editSave: 'Päivitä',
            cancel: 'Peruuta',
          },
          title: {
            add: 'Lisää käytetty kokonaisuus',
            edit: 'Muokkaa käytettyä kokonaisuutta',
          },
          nameInput: {
            fi: {
              label: 'Nimi',
              placeholder: 'Nimi (suomi)',
            },
            en: {
              label: 'Nimi',
              placeholder: 'Nimi (englanti)',
            },
          },
          descriptionInput: {
            fi: {
              label: 'Kuvaus',
              placeholder: 'Kuvaus (suomi)',
            },
            en: {
              label: 'Kuvaus',
              placeholder: 'Kuvaus (englanti)',
            },
          },
          identifierInput: {
            label: 'Tunniste',
            placeholder: 'Tunniste',
          },
          relationTypeInput: {
            label: 'Suhde aineistoon',
            placeholder: 'Suhde aineistoon',
          },
          entityTypeInput: {
            label: 'Resurssin tyyppi',
            placeholder: 'Resurssin tyyppi',
          },
        },
      },
      actorsInput: {
        label: 'Liittyi toimijaan',
        placeholder: 'Lisää toimija',
        createButton: 'Lisää uusi toimija',
      },
      lifecycleInput: {
        label: 'Elinkaaritapahtuma',
        placeholder: 'Valitse elinkaaritapahtuma',
      },
    },
  },
}

export default history
