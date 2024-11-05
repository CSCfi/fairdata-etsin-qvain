const validationMessages = {
  types: {
    string: {
      date: 'The value must be a date string.',
      number: 'The value must be a number string.',
    },
  },
  draft: {
    description: 'Please solve the following errors before saving the draft:',
  },
  publish: {
    description: 'Please solve the following errors before publishing the dataset:',
  },
  title: {
    string: 'The title must be a string value.',
    max: 'The title is too long.',
    required: 'A title is required in Finnish or English.',
  },
  description: {
    string: 'The description must be a string value.',
    max: 'The description is too long.',
    required: 'A description is required in Finnish or English.',
  },
  issuedDate: {
    requiredIfUseDoi: 'Issued date must be defined for DOI datasets',
  },
  otherIdentifiers: {
    string: 'Other identifiers must be string value.',
    max: 'The identifier is too long.',
    min: 'The identifier needs to be at least 10 characters long.',
  },
  fieldOfScience: {},
  keywords: {
    string: 'The keyword must be a string value.',
    max: 'The keyword is too long.',
    required: 'At least one keyword is required.',
  },
  actors: {
    type: {
      mixed: '',
      oneOf: 'Actor type can only be "person" or "organization"',
      required: 'Actor type is required.',
    },
    roles: {
      mixed: '',
      oneOf:
        'Roles must be one of "Creator", "Publisher", "Curator", "Rights holder" or "Contributor"',
      required: 'Please specify the role of the actor. The creator role is mandatory.',
      min: 'Actor must have at least one role',
    },
    name: {
      string: 'The name must be a string value.',
      max: 'The name is too long.',
      required: 'Name is required.',
    },
    email: {
      string: '',
      max: 'The email address is too long.',
      email: 'Please insert a valid email address.',
      nullable: '',
    },
    identifier: {
      string: '',
      max: 'The identifier is too long.',
      nullable: '',
    },
    organization: {
      mixed: '',
      object: 'The selected organization should be an object.',
      name: 'Organization name is required.',
      required: 'Organization is required.',
    },
    requiredActors: {
      atLeastOneActor: 'At least one actor is required for the dataset.',
      creator: 'Actors: Creator role is required. Note: one actor can have multiple roles.',
      publisher: 'Actors: Publisher role is required. Note: one actor can have multiple roles.',
    },
  },
  accessType: {
    string: 'Access type must be string value.',
    url: 'Reference value error.',
    required: 'Access type is a required field.',
  },
  restrictionGrounds: {
    string: 'Restriction grounds must be string value.',
    url: 'Reference value error in Restriction grounds.',
    required: 'Restriction grounds are required if access type is not "Open".',
  },
  license: {
    requiredIfIDA: 'License is required for datasets where File origin is set to IDA.',
    otherUrl: {
      string: 'The license URL must be a valid string of text',
      url: 'The license URL must be a valid URL',
      required: 'License URL is required.',
    },
  },
  files: {
    dataCatalog: {
      required: 'File origin is required.',
      wrongType: 'The file origin is the wrong type or it is missing.',
    },
    file: {
      title: {
        required: 'File title is required.',
      },
      description: {
        required: 'File description is required.',
      },
      useCategory: {
        required: 'File use category is required.',
      },
    },
    directory: {
      title: {
        required: 'Folder title is required.',
      },
      useCategory: {
        required: 'Folder use category is required.',
      },
    },
  },
  externalResources: {
    title: {
      required: 'Remote resource title is required.',
    },
    useCategory: {
      required: 'Remote resource use category is required.',
    },
    accessUrl: {
      validFormat: 'Access URL needs to be of valid URL format.',
    },
    downloadUrl: {
      validFormat: 'Download URL needs to be of valid URL format.',
    },
  },
  projects: {
    title: {
      required: 'Title is required in at least one language.',
      string: 'The title must be a string value.',
    },
    organization: {
      mixed: '',
      object: 'The selected organization should be an object.',
      name: 'Organization name is required.',
      required: 'Organization is required.',
      min: 'Project must have at least one organization.',
      email: 'Organization email is not valid.',
    },
    fundingAgency: {
      contributorType: {
        identifier: 'The role is required.',
      },
    },
    funding: {
      max: 'Qvain supports only one funding per project. Multiple fund support will be added later on.',
    },
  },
  temporalAndSpatial: {
    spatial: {
      nameRequired: 'Name is required',
      altitudeNan: 'Altitude must be a number',
    },
    temporal: {
      dateMissing: 'Please enter a date.',
    },
  },
  history: {
    relatedResource: {
      nameRequired: 'Name is required in at least one language.',
      typeRequired: 'Relation type is required.',
    },
    provenance: {
      nameRequired: 'Name is required in at least in one language.',
      startDateMissing: 'Start date missing.',
      endDateMissing: 'End date missing.',
    },
  },
  publications: {
    nameRequired: 'Name is required in at least one language.',
    typeRequired: 'Relation type is required.',
    entityTypeRequired: 'Resource type is required',
  },
}

export default validationMessages
