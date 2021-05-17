const project = {
  title: 'Producer Project',
  description: 'A project in which the dataset was created',
  addButton: 'Add project',
  editButton: 'Edit project',
  tooltipContent: {
    title: 'Producer Project',
    paragraph: 'A project in which the dataset was created',
  },
  project: {
    title: 'Add project',
    addButton: 'Add project',
    description: 'A project in which the dataset was created',
  },
  organization: {
    title: 'Organization *',
    description: 'The Organization(s) who is/are participating to the project',
  },
  fundingAgency: {
    title: 'Funding agency',
  },
  inputs: {
    title: {
      label: 'Add title for project',
      description: 'Name of the project, at least one language is required.',
    },
    titleEn: {
      placeholder: 'Title (English)',
    },
    titleFi: {
      placeholder: 'Title (Finnish)',
    },
    identifier: {
      label: 'Identifier',
      description:
        'Recommended best practice is to identify the resource by means of a string conforming to a formal identification system. An unambiguous reference to the resource within a given context.',
      placeholder: 'Add identifier',
    },
    fundingIdentifier: {
      label: 'Project funding identifier',
      description: 'Unique identifier for the project that is being used by the project funder',
      placeholder: 'Add project funding identifier',
    },
    funderType: {
      label: 'Funder type',
      placeholder: 'Select funder type',
      addButton: 'Add funder type',
      noOptions: 'Funder type not found',
    },
    organization: {
      placeholder: {
        organization: 'Select an organization',
        department: 'Select a department',
      },
      levels: {
        organization: 'Organization',
        department: 'Department',
        subdepartment: 'Subdepartment',
      },
      addButton: 'Add organization',
      editButton: 'Edit organization',
    },
    fundingAgency: {
      contributorType: {
        title: 'Contributor type',
        description:
          'Contributor type of the Organization. Based on the subset of the DataCite reference data',
        organization: {
          label: 'Select organization',
          validation: 'A valid organization is required',
        },
        identifier: {
          label: 'Contributor role',
        },
        definition: {
          label: 'Definition',
          description: 'A statement or formal explanation of the meaning of a concept.',
          placeholderEn: 'Definition (English)',
          placeholderFi: 'Definition (Finnish)',
        },
        addButton: 'Add contributor type',
        editButton: 'Edit contributor type',
      },
      addButton: 'Add agency',
      editButton: 'Edit agency',
    },
  },
}

export default project
