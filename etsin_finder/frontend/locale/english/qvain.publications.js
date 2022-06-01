const publications = {
  title: 'Related publications and other resources',
  infoText: `Refer to related datasets, publications, and other
    resources that are relevant in understanding this dataset.`,
  select: {
    newRelation: 'Create a new reference',
    placeholder: 'Create a new reference or search reference from external resources',
  },
  tooltipContent: {
    title: 'Reference to a related resource',
    paragraph: `Refer to related datasets, publications, and other
      resources that are relevant in understanding this dataset.`,
  },
  search: {
    title: 'Search',
    infoText: 'Start typing the name for the publication to start the search',
  },
  publications: {
    title: 'Publications',
    infoText:
      'You can either enter the publication information manually or search ' +
      'for the publication in the Crossref Service (crossref.org) using the search function.',
    noItems: 'No publications have been specified.',

    name: {
      fi: {
        label: 'Name',
        infoText: 'Name (in Finnish)',
      },
      en: {
        label: 'Name',
        infoText: 'Name (in English)',
      },
    },

    description: {
      fi: {
        label: 'Description',
        infoText: 'Description (in Finnish)',
      },
      en: {
        label: 'Description',
        infoText: 'Description (in English)',
      },
    },

    identifier: {
      label: 'Identifier',
      infoText:
        'Publication identifier. It is recommended to use persistent identifiers, if available.',
    },

    relationType: {
      label: 'Relation type',
      infoText: 'Select relation type',
    },

    modal: {
      formTitle: "Publication's information",
      addButton: 'Add publication',
      title: {
        add: 'Add publication',
        edit: 'Edit publication',
      },
      buttons: {
        save: 'Add publication',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
    },
  },
  otherResources: {
    title: 'Other material',
    noItems: 'No other material have been specified.',

    name: {
      fi: {
        label: 'Name',
        infoText: 'Name (in Finnish)',
      },
      en: {
        label: 'Name',
        infoText: 'Name (in English)',
      },
    },
    description: {
      fi: {
        label: 'Description',
        infoText: 'Description (in Finnish)',
      },
      en: {
        label: 'Description',
        infoText: 'Description (in English)',
      },
    },
    identifier: {
      label: 'Identifier',
      infoText:
        'Resource identifier. It is recommended to use persistent identifiers, if available.',
    },
    relationType: {
      label: 'Relation type',
      infoText: 'Select relation type',
    },
    entityType: {
      label: 'Resource type',
      infoText: 'Select resource type',
    },

    modal: {
      addButton: 'Add other material',
      title: {
        add: 'Add reference to other material',
        edit: 'Edit reference to other material',
      },
      buttons: {
        save: 'Add reference',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
    },
  },
}

export default publications
