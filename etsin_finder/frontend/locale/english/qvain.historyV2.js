const history = {
  title: {
    title: 'Provenance',
    general: 'Event description',
    outcome: 'Outcome',
    details: 'Other details',
  },
  infoText: 'An action or event that the dataset was the subject of.',
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
  },
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
  outcomeDescription: {
    fi: {
      label: 'Outcome description',
      infoText: 'Outcome description (in Finnish)',
    },
    en: {
      label: 'Outcome description',
      infoText: 'Outcome description (in English)',
    },
  },
  location: {
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
        save: 'Add location to event',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
      nameInput: {
        label: 'Name',
        infoText: 'Name',
      },
      altitudeInput: {
        label: 'Altitude',
        infoText: 'The altitude of a spatial coverage (meters from WGS84 reference)',
      },
      addressInput: {
        label: 'Address',
        infoText: 'Full address',
      },
      geometryInput: {
        label: 'Geometry',
        infoText: 'Geometry using WKT format in WGS84 coordinate system',
      },
      locationInput: {
        label: 'Location',
        infoText: 'Type to search available options',
      },
    },
  },
  outcome: {
    label: 'Outcome',
    infoText: 'Select outcome',
  },
  lifecycle: {
    label: 'Event type',
    infoText: 'Select event type',
  },
  periodOfTime: {
    label: 'Time period',
    startInfoText: 'Start date',
    endInfoText: 'End date',
  },
  actors: {
    label: 'Was associated with an actor',
    infoText: 'Specify associated actor',
    createButton: 'Specify new actor',
  },
}

export default history
