const temporalAndSpatial = {
  title: 'Temporal and Spatial Coverage',
  tooltip: 'Temporal and Spatial Coverage info',
  tooltipContent: {
    spatial: {
      title: 'Spatial coverage',
      paragraph: 'Area covered by the dataset, e.g. places of observations.  ',
    },
    temporal: {
      title: 'Temporal coverage',
      paragraph: 'Time span that is covered by the dataset, e.g. period of observations. ',
    },
  },
  spatial: {
    title: 'Spatial coverage',
    description: 'Area covered by the dataset, e.g. places of observations.',
    noItems: 'No spatial coverage have been added.',
    modal: {
      addButton: 'Add Spatial coverage',
      title: {
        add: 'Add Spatial coverage',
        edit: 'Edit spatial coverage',
      },
      buttons: {
        addGeometry: 'Add Geometry',
        save: 'Save',
        editSave: 'Apply changes',
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
  temporal: {
    title: 'Temporal coverage',
    description: 'Time span that is covered by the dataset, e.g. period of observations. ',
    addButton: 'Add temporal coverage',
    modal: {
      durationInput: {
        label: 'Period of time',
        startPlaceholder: 'Start date',
        endPlaceholder: 'End date',
      },
    },
  },
}

export default temporalAndSpatial
