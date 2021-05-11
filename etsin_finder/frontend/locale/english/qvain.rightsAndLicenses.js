const rightsAndLicenses = {
  title: 'Rights And Licenses',
  infoTitle: 'Rights And Licenses info',
  accessType: {
    title: 'Access Type',
    infoText:
      'This field sets how the data in your dataset can be accessed. Whichever option is selected does not affect the visibility of the dataset description (metadata) itself; it only affects the openness of the linked data (files). If you select anything else than "Open", you must also choose a reason for the restriction (field "Restriction Grounds" will appear). If you select "Embargo", please also specify the embargo expiration date ("Embargo expiration date" field will appear).',
    placeholder: 'Select option',
    permitInfo:
      'By default the dataset owner (the original describer) can approve the applications. In addition, functionality is under development to allow chosen representatives (only or in addition to the owner) of the dataset\'s organization to make the approvals. By using the access type "Requires permission" the dataset owner agrees to these upcoming changes.',
  },
  embargoDate: {
    label: 'Embargo expiration date',
    placeholder: 'Date',
    help: 'By default, expiration date will be indefinite if not set.',
  },
  restrictionGrounds: {
    title: 'Restriction Grounds',
    placeholder: 'Select option',
    text: 'When access type is not "Open", you need to define the restriction grounds.',
  },
  license: {
    title: 'License',
    infoText:
      'License is an essential part of the dataset description. The license describes how the dataset can be used. As a default, the recommended CC BY 4.0 license is selected, but you can change it if needed. If you want to add a URL to an existing license page, please type the URL and select the "Other (URL)" option.',
    placeholder: 'Select option',
    other: {
      label: 'URL address',
      help: 'Specify URL address for license',
    },
    addButton: 'Add license',
  },
}

export default rightsAndLicenses
