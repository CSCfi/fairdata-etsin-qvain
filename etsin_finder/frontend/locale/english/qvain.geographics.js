const geographics = {
  infoText: {
    section: 'Geographical area covered by the dataset, i.e. locations of observations.',
    geometry:
      'If the location is selected, Qvain will automatically save also geometry data for the location (if available). ' +
      'The location will then be shown on a map in Etsin. In addition you can also fill in the geometry data manually in WSG84 format.',
  },
  noItems: 'No geographical areas added.',
  title: {
    section: 'Geographical area',
    general: 'General information',
    geometry: 'Geometry',
  },
  name: {
    label: 'Name',
    infoText: 'Area name',
  },
  altitude: {
    label: 'Altitude',
    infoText: 'The altitude of the geographical area (meters from WGS84 reference)',
  },
  address: {
    label: 'Address',
    infoText: 'Full address',
  },
  geometry: {
    label: 'Geometry',
    infoText: 'Add geometry using WKT format in WGS84 coordinate system',
  },
  location: {
    label: 'Location',
    infoText: 'Type to search available options',
  },

  modal: {
    addButton: 'Add Geographical area',
    title: {
      add: 'Add Geographical area',
      edit: 'Edit Geographical area',
    },
    buttons: {
      addGeometry: 'Add geometry',
      save: 'Add geographical data',
      editSave: 'Apply changes',
      cancel: 'Cancel',
    },
  },
}

export default geographics
