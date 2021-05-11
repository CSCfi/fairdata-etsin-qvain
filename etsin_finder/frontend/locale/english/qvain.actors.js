const actors = {
  title: 'Actors',
  infoTitle: 'Actors info',
  addButton: 'Add new actor',
  infoText:
    'Add at least one Creator. First, select the type of actor (person or organization). Then choose the roles the actor has (you can add multiple). After that, fill in the details: organization is mandatory for a person. You can edit added actors by clicking the pen icon or remove it by clicking the X icon.',
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
      type: 'Actor Type',
      roles: 'Roles',
      info: 'Actor Information',
    },
    help:
      'Having at least one creator for the dataset is mandatory. Notice that one actor can have multiple roles.',
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
      placeholder: {
        organization: 'Name',
        person: 'First And Last Name',
      },
      label: 'Name',
    },
    email: {
      placeholder: 'Email',
      label: 'Email',
    },
    identifier: {
      label: 'Identifier',
      placeholder: 'e.g http://orcid.org',
    },
    organization: {
      label: 'Organization',
      placeholder: 'E.g. University of Helsinki',
      placeholderChild: '+ Add department or unit',
      loading: 'Loading organizations...',
      labels: {
        name: 'Organization name',
        email: 'Organization email',
        identifier: 'Organization identifier',
      },
      options: {
        create: 'Add new organization manually',
        dataset: 'Organizations in dataset',
        presets: 'Preset organizations',
      },
    },
    save: {
      label: 'Add actor',
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
