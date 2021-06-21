const history = {
  title: 'Related Material and History',
  tooltip: 'Related Material and History info',
  tooltipContent: {
    relatedResource: {
      title: 'Reference to a related resource',
      paragraph: `Refer to related datasets, publications, and other
        resources that are relevant in understanding this dataset.`,
    },
    provenance: {
      title: 'Provenance',
      paragraph: `Information about the provenance of the data.
      These are e.g. events related to gathering of the data, data analysis and presenting data.`,
    },
    infrastructure: {
      title: 'Infrastructure',
      paragraph: 'Services or tools that are used to produce the dataset.',
    },
  },
  relatedResource: {
    title: 'Reference to a related resource',
    description: `Refer to related datasets, publications, and other
      resources that are relevant in understanding this dataset.`,
    noItems: 'No references to any related resources have been specified.',
    select: {
      newRelation: 'Create a new reference',
      placeholder: 'Create a new reference or search reference from external resources',
    },
    modal: {
      addButton: 'Add reference to a related resource',
      title: {
        add: 'Add reference to a related resource',
        edit: 'Edit reference to a related resource',
      },
      buttons: {
        save: 'Save related resource',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
      nameInput: {
        fi: {
          label: 'Name',
          placeholder: 'Name (in Finnish)',
        },
        en: {
          label: 'Name',
          placeholder: 'Name (in English)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Description',
          placeholder: 'Description (in Finnish)',
        },
        en: {
          label: 'Description',
          placeholder: 'Description (in English)',
        },
      },
      identifierInput: {
        label: 'Identifier',
        placeholder: 'Identifier',
      },
      relationTypeInput: {
        label: 'Relation type',
        placeholder: 'Select relation type',
      },
      entityTypeInput: {
        label: 'Resource type',
        placeholder: 'Select resource type',
      },
    },
  },
  infrastructure: {
    addButton: 'Add Infrastructure',
    title: 'Infrastructure',
    description: 'You can specify services and tools that are used to produce the dataset.',
    noItems: 'No infrastructures have been added.',
  },
  provenance: {
    title: 'Provenance',
    description: 'An action or event that the dataset was the subject of.',
    noItems: 'No provenances have been specified.',
    modal: {
      title: {
        add: 'Add Provenance',
        edit: 'Edit Provenance',
      },
      addButton: 'Add Provenance',
      buttons: {
        save: 'Add Provenance',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
      nameInput: {
        fi: {
          label: 'Name',
          placeholder: 'Name (in Finnish)',
        },
        en: {
          label: 'Name',
          placeholder: 'Name (in English)',
        },
      },
      descriptionInput: {
        fi: {
          label: 'Description',
          placeholder: 'Description (in Finnish)',
        },
        en: {
          label: 'Description',
          placeholder: 'Description (in English)',
        },
      },
      outcomeDescriptionInput: {
        fi: {
          label: 'Outcome description',
          placeholder: 'Outcome description (in Finnish)',
        },
        en: {
          label: 'Outcome description',
          placeholder: 'Outcome description (in English)',
        },
      },
      periodOfTimeInput: {
        label: 'Time period',
        startPlaceholder: 'Start date',
        endPlaceholder: 'End date',
      },
      locationInput: {
        label: 'Location',
        noItems: 'No locations have been added.',
        error: {
          nameRequired: 'Name is required',
          altitudeNan: 'Altitude must be a number',
        },
        modal: {
          addButton: 'Add location',
          title: {
            add: 'Add location',
            edit: 'Edit location',
          },
          buttons: {
            addGeometry: 'Add Geometry',
            save: 'Save',
            editSave: 'Update',
            cancel: 'Cancel',
          },
          nameInput: {
            label: 'Name',
            placeholder: 'Name',
          },
          altitudeInput: {
            label: 'Altitude',
            placeholder: 'The altitude of a spatial coverage (meters from WGS84 reference)',
          },
          addressInput: {
            label: 'Address',
            placeholder: 'Full address',
          },
          geometryInput: {
            label: 'Geometry',
            placeholder: 'Geometry using WKT format in WGS84 coordinate system',
          },
          locationInput: {
            label: 'Location',
            placeholder: 'Type to search available options',
          },
        },
      },
      outcomeInput: {
        label: 'Outcome',
        placeholder: 'Select outcome',
      },
      usedEntityInput: {
        label: 'Used entities',
        noItems: 'No used entities have been added.',
        modal: {
          addButton: 'Add used entity',
          buttons: {
            save: 'Save',
            editSave: 'Update',
            cancel: 'Cancel',
          },
          title: {
            add: 'Add used entity',
            edit: 'Edit used entity',
          },
          nameInput: {
            fi: {
              label: 'Name',
              placeholder: 'Name (in Finnish)',
            },
            en: {
              label: 'Name',
              placeholder: 'Name (in English)',
            },
          },
          descriptionInput: {
            fi: {
              label: 'Description',
              placeholder: 'Description (in Finnish)',
            },
            en: {
              label: 'Description',
              placeholder: 'Description (in English)',
            },
          },
          identifierInput: {
            label: 'Identifier',
            placeholder: 'Identifier',
          },
          relationTypeInput: {
            label: 'Relation type',
            placeholder: 'Relation type',
          },
          entityTypeInput: {
            label: 'Entity type',
            placeholder: 'Entity type',
          },
        },
      },
      actorsInput: {
        label: 'Was associated with an actor',
        placeholder: 'Specify associated actor',
        createButton: 'Specify new actor',
      },
      lifecycleInput: {
        label: 'Lifecycle event',
        placeholder: 'Select lifecycle event',
      },
    },
  },
}

export default history
