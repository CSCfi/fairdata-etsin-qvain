const validationMessages = {
  types: {
    string: {
      date: 'The value must be a date string.',
      number: 'The value must be a number string.',
    },
  },
  draft: {
    description: 'Draft cannot be saved until the following errors are fixed:',
  },
  publish: {
    description: 'Dataset cannot be published before following errors are fixed:',
  },
  title: {
    string: 'The title must be a string value.',
    max: 'The title is too long.',
    required: 'A title is required in at least one language.',
  },
  description: {
    string: 'The description must be a string value.',
    max: 'The description is too long.',
    required: 'A description is required in at least one language.',
  },
  issuedDate: {
    requiredIfUseDoi: 'Issued date must be defined for DOI datasets',
  },
  otherIdentifiers: {
    string: 'Other identifiers must be string value.',
    url: 'The identifiers have to be valid URLs.',
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
        'Roles must be one of "Creator", "Publisher", "Curator", "Rights holder", "Contributor" or "Provenance.',
      required: 'You must specify the role of the actor. The creator role is mandatory.',
    },
    name: {
      string: 'The name must be a string value.',
      max: 'The name is too long.',
      required: 'Name is a required field.',
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
      name: 'The organization name must be a string.',
      required: 'Organization is required.',
    },
    requiredActors: {
      atLeastOneActor: 'You must add at least one actor to your dataset.',
      mandatoryActors: {
        creator: 'Actors: Creator role is mandatory. Note: one actor can have multiple roles.',
        publisher: 'Actors: Publisher role is mandatory. Note: one actor can have multiple roles.',
      },
    },
  },
  accessType: {
    string: 'Access type must be string value.',
    url: 'Reference value error.',
    required: 'Access type is a required field.',
  },
  restrictionGrounds: {
    string: 'Restriction grounds must be string value.',
    url: 'Reference value error.',
    required: 'Restriction grounds are required if access type is not "Open".',
  },
  license: {
    requiredIfIDA: 'License is mandatory for datasets where File origin is set to IDA.',
    otherUrl: {
      string: 'The license URL must be a valid string of text',
      url: 'The license URL must be a valid URL',
      required: 'License URL is a required field.',
    },
  },
  files: {
    dataCatalog: {
      required: 'File origin is required.',
      wrongType: 'File origin is wrong type or it is missing.',
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
      required: 'At least one language is required.',
      string: 'The title must be a string value.',
    },
    organization: {
      name: 'A name is required',
      email: 'A valid email address is required',
      min: 'At least one producer organization is required',
    },
    fundingAgency: {
      contributorType: {
        identifier: 'Valitse rooli',
      },
    },
  },
  temporalAndSpatial: {
    spatial: {
      nameRequired: 'Name is required',
      altitudeNan: 'Altitude must be a number',
    },
    temporal: {
      startDateMissing: 'Start date is missing.',
      endDateMissing: 'End date is missing',
    },
  },
  history: {
    relatedResource: {
      nameRequired: 'Name is required in at least one language.',
      typeRequired: 'Relation type is required.',
    },
    provenance: {
      nameRequired: 'Name required at least in one language.',
      startDateMissing: 'Start date missing',
      endDateMissing: 'End date missing',
    },
  },
}

export default validationMessages
