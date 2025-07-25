const rightsAndLicenses = {
  title: 'Rights And Licenses',
  infoTitle: 'Rights And Licenses info',
  accessRights: 'Access rights',
  accessType: {
    title: 'Access Type',
    infoText: `<p>This field specifies how the data in your dataset can be accessed.
    The option selected does not affect the visibility of the dataset description
    (metadata) itself; it only affects the openness of the linked data (files).</p>
    <p>If you select anything else than "Open", you must also choose a reason for the
    restriction (a "Restriction Grounds" field will appear). If you select "Embargo",
    please also specify the embargo expiration date (an "Embargo expiration date" field will appear).</p>`,
    placeholder: 'Select option',
    permitInfo:
      'By default the dataset owner (the original describer) can approve the applications. In addition, functionality is under development to allow chosen representatives (only or in addition to the owner) of the dataset\'s organization to make the approvals. By using the access type "Requires permission" the dataset owner agrees to these upcoming changes.',
  },
  embargoDate: {
    label: 'Embargo expiration date',
    placeholder: 'Date',
    help: 'By default the embargo date is not set and thus embargo will never end resulting in the files not being available for download',
  },
  restrictionGrounds: {
    title: 'Restriction Grounds',
    placeholder: 'Select option',
    text: 'When access type is not "Open", specify the reason for restricted file download.',
  },
  license: {
    title: 'License',
    infoText: `License is an essential part of the dataset description. 
    The license describes how the dataset can be used. 
    As a default, the recommended license for research datasets "CC BY 4.0" is selected, but you can change it if needed. 
    If you need to specify your own license, type it in the field as a URL in https:// format.<br>
    Note! Dataset's metadata is automatically CC0 licenced.`,
    placeholder: 'Select option',
    other: {
      label: 'URL address',
      help: 'Specify URL address for license',
    },
    addButton: 'Add license',
  },
  description: {
    title: 'Access rights description',
  },
  dataAccess: {
    title: 'Data access',
    applicationInstructions: 'Instructions on how to apply for permission',
    reviewerInstructions: 'Instructions for approvers (not shown to users)',
    terms: 'Access policy (terms for data access)',
    remsApprovalType: {
      title: 'Approval type',
      disabled: 'Disabled',
      automatic: 'Automatic',
      manual: 'Manual',
    },
  },
}

export default rightsAndLicenses
