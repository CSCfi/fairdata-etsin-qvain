const description = {
  title: 'Description',
  infoTitle: 'Description info',
  infoText:
    'Give a descriptive title for your dataset. Also, write the description as detailed as you possibly can; explain how the dataset was created, how it is structured, and how it has been handled. Describe also the content.',
  fieldHelpTexts: {
    requiredForAll: 'Required for all datasets',
    requiredToPublish: 'Required to save and publish',
  },
  description: {
    langEn: 'ENGLISH',
    langFi: 'FINNISH',
    title: {
      label: 'Title',
      placeholderEn: 'Title (English)',
      placeholderFi: 'Title (Finnish)',
    },
    description: {
      label: 'Description',
      placeholderEn: 'Description (English)',
      placeholderFi: 'Description (Finnish)',
    },
    instructions: 'Only one language selection is mandatory',
  },
  issuedDate: {
    title: 'Issued date',
    infoText:
      'Date of formal issuance (publication) of the resource. This value does not affect or reflect the visibility of the dataset itself. If this is left empty, current date is used as default value.',
    instructions: '',
    placeholder: 'Date',
  },
  otherIdentifiers: {
    title: 'Other Identifiers',
    infoText:
      "If your dataset already has an identifier (usually a DOI) insert it here. The dataset still gets the permanent identifier which resolves to Etsin's Landing page.",
    instructions:
      'Identifier for the metadata will be created automatically but if there already is an EXISTING identifier please insert it here.',
    alreadyAdded: 'Identifier already added',
    addButton: 'Add identifier',
    placeholder: 'E.g. https://doi.org/...',
  },
  fieldOfScience: {
    title: 'Field of Science',
    infoText:
      'Select a value from the dropdown menu. The drop down uses the classification of the Ministry of Education and Culture.',
    placeholder: 'Select option',
    help: 'You can add multiple fields of science.',
  },
  datasetLanguage: {
    title: 'Dataset language',
    infoText: 'Select languages used in the dataset.',
    placeholder: 'Type to search language',
    noResults: 'No languages found',
    help: 'You can add multiple languages.',
  },
  keywords: {
    title: 'Keywords',
    infoText: 'Set keywords that characterize the dataset.',
    placeholder: 'E.g. economy',
    alreadyAdded: 'Keyword already added',
    addButton: 'Add keyword',
    help:
      'You can add multiple keywords by separating them with a comma (,). Dataset has to have at least one keyword.',
  },
  subjectHeadings: {
    title: 'Subject Headings',
    infoText:
      'Choose subject headings from the KOKO Ontology. It also has English and Swedish translations of the terms.',
    placeholder: 'Type to search for available options',
    help:
      'Choose subject headings from the KOKO Ontology. It also has English and Swedish translations of the terms.',
  },
  error: {
    title: 'A title is required in at least one language.',
    description: 'A description is required in at least one language.',
  },
}

export default description
