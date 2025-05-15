const actors = {
  title: 'Actors',
  infoTitle: 'Actors info',
  addButton: 'Add new actor',
  infoText: `<p>Specify people or organizations that have been part of the research or making
  of the dataset. You can specify Creators, Publisher, Curators, Rights Holders and Contributors.</p>
  <p>First, select the type of actor (person or organization).
  Then choose the roles the actor has (you can specify multiple roles).
  After that, fill in the details: organization is mandatory for a person.</p>
  <p>You can edit added actors by clicking the pen icon or remove it by clicking the X icon.</p>
  `,
  errors: {
    loadingReferencesFailed: 'Error loading reference organizations.',
  },
  add: {
    title: 'Actors',
    action: {
      create: 'Add new actor',
      edit: 'Edit actor',
    },
    groups: {
      type: 'Actor type',
      roles: 'Roles',
      info: 'Information',
    },
    help: `Having at least one Creator and Publisher for the dataset is required.
      Notice that one actor can have multiple roles.`,
    radio: {
      person: 'Person',
      organization: 'Organization',
    },
    checkbox: {
      creator: 'Creator',
      publisher: 'Publisher',
      curator: 'Curator',
      rights_holder: 'Rights holder',
      contributor: 'Contributor',
      provenance: 'Provenance',
    },
    name: {
      infoText: {
        organization: 'Name',
        person: 'First and last name',
        manualOrganization: 'Enter name of the organization',
      },
      label: 'Name',
    },
    email: {
      placeholder: 'Email',
      infoText:
        'Email. Etsin users are able to send messages without seeing the actual email address.',
      label: 'Email',
    },
    identifier: {
      label: 'Identifier',
      infoText: {
        person:
          'E.g. http://orcid.org. It is recommended to use persistent identifiers, if available',
        organization:
          'E.g RAID-identifier or Business ID. It is recommended to use persistent identifiers, if available',
      },
    },
    organization: {
      label: 'Organization',
      placeholder: 'Search by typing or add new organization',
      placeholderChild: '+ Add department or unit',
      infoText: 'Search by typing or add new organization',
      infoTextChild: '+ Add department or unit',
      loading: 'Loading organizations...',
      labels: {
        name: 'Organization name',
        email: 'Organization email',
        identifier: 'Organization identifier',
        manualOrganization: 'Add new organization',
      },
      options: {
        create: 'Add new organization',
        dataset: 'Organizations in dataset',
        presets: 'Preset organizations',
      },
      details: 'Edit organization details',
    },
    save: {
      label: 'Add actor',
    },
    edit: {
      label: 'Apply changes',
    },
    cancel: {
      label: 'Cancel',
    },
    newOrganization: {
      label: 'Add',
    },
  },
  added: {
    title: 'Actors',
    noneAddedNotice: 'No actors have been added.',
  },
}

export default actors
