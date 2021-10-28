const temporalAndSpatial = {
  title: 'Time Period and Geographical area',
  tooltip: 'Time Period and Geographical area',
  tooltipContent: {
    spatial: {
      title: 'Geographical area',
      paragraph: 'Area covered by the dataset, i.e. locations of observations.',
    },
    temporal: {
      title: 'Time period',
      paragraph: 'Time period that is covered by the dataset, i.e. period of observations.',
    },
  },
  spatial: {
    title: 'Geographical area',
    description: 'Geographical area covered by the dataset, i.e. locations of observations.',
    noItems: 'No spatial coverage has been added.',
    modal: {
      addButton: 'Add Geographical area',
      title: {
        add: 'Add Geographical area',
        edit: 'Edit Geographical area',
      },
      buttons: {
        addGeometry: 'Add Geometry',
        save: 'Save',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
      nameInput: {
        label: 'Name',
        placeholder: 'Area name',
      },
      altitudeInput: {
        label: 'Altitude',
        placeholder: 'The altitude of the geographical area (meters from WGS84 reference)',
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
    title: 'Time period',
    description: 'Time period that is covered by the dataset, i.e. period of observations.',
    addButton: 'Add temporal coverage',
    listItem: {
      bothDates: '%(startDate)s – %(endDate)s',
      startDateOnly: 'from %(startDate)s',
      endDateOnly: 'until %(endDate)s',
    },
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
