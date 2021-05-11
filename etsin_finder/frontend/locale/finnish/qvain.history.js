const history = {
  title: 'Aineistoon liittyvä materiaali ja historia',
  tooltip: 'Aineestoon liittyvä materiaali ja historia info',
  tooltipContent: {
    relatedResource: {
      title: 'Viittaukset',
      paragraph:
        'Viittaukset muihin aineistoihin, julkaisuihin tai muihin resursseihin, jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.',
    },
    provenance: {
      title: 'Historiatiedot (provenienssi)',
      paragraph: 'Tiedot aineiston historiatiedoista eli provenienssista.',
    },
    infrastructure: {
      title: 'Infrastruktuuri',
      paragraph: 'Palvelut tai työkalut, joita aineiston tuottamisessa on hyödynnetty.',
    },
  },
  infrastructure: {
    addButton: 'Lisää infrastruktuuri',
    title: 'Infrastruktuuri',
    description: 'Voit lisätä palveluita tai rakenteita joita on käytetty aineiston laatimiseen.',
    noItems: 'Infrastruktuureja ei ole lisätty.',
  },
  relatedResource: {
    title: 'Viittaukset toiseen resurssiin',
    description:
      'Viittaukset aineistoihin, julkaisuihin tai muihin resursseihin, jotka auttavat ymmärtämään ja käyttämään tätä tutkimusaineistoa.',
    noItems: 'Viittauksia toisiin resursseihin ei ole lisätty.',
    modal: {
      addButton: 'Lisää viittaus toiseen resurssiin',
      title: {
        add: 'Lisää viittaus toiseen resurssiin',
        edit: 'Muokkaa viittausta toiseen resurssiin',
      },
      buttons: {
        save: 'Tallenna',
        editSave: 'Vahvista muutokset',
        cancel: 'Peruuta',
      },
      nameInput: {
        fi: {
          label: 'Nimi',
          placeholder: 'Nimi (suomeksi)',
        },
        en: {
          label: 'Nimi',
          placeholder: 'Nimi (englanniksi)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Kuvailu',
          placeholder: 'Kuvailu (suomeksi)',
        },
        en: {
          label: 'Kuvailu',
          placeholder: 'Kuvailu (englanniksi)',
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
        label: 'Resurssin tyyppi',
        placeholder: 'Resurssin tyyppi',
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
          placeholder: 'Nimi (suomeksi)',
        },
        en: {
          label: 'Nimi',
          placeholder: 'Nimi (englanniksi)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Seloste',
          placeholder: 'Seloste (suomeksi)',
        },
        en: {
          label: 'Seloste',
          placeholder: 'Seloste (englanniksi)',
        },
      },
      outcomeDescriptionInput: {
        fi: {
          label: 'Seloste lopputuloksesta',
          placeholder: 'Seloste lopputuloksesta (suomeksi)',
        },
        en: {
          label: 'Seloste lopputuloksesta',
          placeholder: 'Seloste lopputuloksesta (englanniksi)',
        },
      },
      periodOfTimeInput: {
        label: 'Ajanjakso',
        startPlaceholder: 'Alkaa',
        endPlaceholder: 'Päättyy',
      },
      locationInput: {
        label: 'Alueelliset tiedot',
        noItems: 'Alueellisia tietoja ei ole lisätty.',
        error: {
          nameRequired: 'Nimi on pakollinen kenttä.',
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
        placeholder: 'Lopputulos',
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
              placeholder: 'Nimi (suomeksi)',
            },
            en: {
              label: 'Nimi',
              placeholder: 'Nimi (englanniksi)',
            },
          },
          descriptionInput: {
            fi: {
              label: 'Kuvailu',
              placeholder: 'Kuvailu (suomeksi)',
            },
            en: {
              label: 'Kuvailu',
              placeholder: 'Kuvailu (englanniksi)',
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
            label: 'Resurssin tyyppi',
            placeholder: 'Resurssin tyyppi',
          },
        },
      },
      actorsInput: {
        label: 'Liittyi toimijaan',
        placeholder: 'Liitä toimija',
        createButton: 'Luo uusi toimija',
      },
      lifecycleInput: {
        label: 'Elinkaaritapahtuma',
        placeholder: 'Elinkaaritapahtuma',
      },
    },
  },
}

export default history
