const project = {
  title: 'Producer Project',
  description: 'A project in which the dataset was created',
  addButton: 'Add',
  editButton: 'Edit',
  tooltipContent: {
    title: 'Producer Project',
    paragraph: 'A project in which the dataset was created',
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
      description: 'It is recommended to use general identifiers, if available',
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
        description: "Specify organization's role in the project.",
        organization: {
          label: 'Select organization',
          validation: 'A valid organization is required',
        },
        identifier: {
          label: 'Contributor role',
          placeholder: 'Select contributor role',
        },
        definition: {
          label: 'Description',
          description: "Description of the organization's role.",
          placeholderEn: 'Description (English)',
          placeholderFi: 'Description (Finnish)',
        },
        addButton: 'Add role',
        editButton: 'Edit role',
      },
      addButton: 'Add organization',
      editButton: 'Edit organization',
    },
  },
}

export default project
