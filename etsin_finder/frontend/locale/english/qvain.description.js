const description = {
  title: 'Description',
  infoTitle: 'Description info',
  infoText: `Give a descriptive and distinct title for your dataset.
  Also, write the description as detailed as you possibly can;
  explain how and for what purpose the dataset was created,
  how it is structured, and how it has been handled.
  Describe also the content as well as possible shortcomings and limitations of the dataset.`,
  fieldHelpTexts: {
    requiredForAll: 'Required for all datasets',
    requiredToPublish: 'Required to save and publish',
  },
  charactersRemaining: '%(charactersRemaining)s characters remaining.',
  description: {
    langEn: 'ENGLISH',
    langFi: 'FINNISH',
    title: {
      label: 'Title',
      placeholderEn: 'Title (English)',
      placeholderFi: 'Title (Finnish)',
      infoText: {
        fi: 'Title in English',
        en: 'Title in Finnish',
      },
    },
    description: {
      label: 'Description',
      placeholderEn: 'Description (English)',
      placeholderFi: 'Description (Finnish)',
      infoText: {
        fi: 'Describe dataset in Finnish',
        en: 'Describe dataset in English',
      },
    },
    instructions: 'Only one language is mandatory',
  },
  issuedDate: {
    title: 'Issued date',
    infoText: `Date of formal issuance (publication) of the resource. This value does not affect or
    reflect the visibility of the dataset itself. If left empty, the current date is used as a default value.`,
    instructions: '',
    placeholder: 'Date',
  },
  otherIdentifiers: {
    title: 'Other Identifiers',
    infoText: `If your dataset already has an identifier enter it here.
      When saved, the dataset will still be assigned a permanent identifier
      which directs to Etsin's Landing page.`,
    instructions: `Identifier for the metadata will be created automatically.
      If there already is an existing identifier for the dataset please enter it here.
      The identifier needs to be at least 10 characters long.`,
    alreadyAdded: 'Identifier already added',
    addButton: 'Add identifier',
    placeholder: 'E.g. https://doi.org/...',
  },
  fieldOfScience: {
    title: 'Field of Science',
    infoText:
      'Select one or multiple fields of science from the Statistics Finland field of science classification.',
    placeholder: 'Select option',
    help: 'You can specify multiple fields of science.',
  },
  datasetLanguage: {
    title: 'Dataset language',
    infoText: 'Select languages used in the dataset.',
    placeholder: 'Type to search language',
    noResults: 'No languages found',
    help: 'You can specify multiple languages.',
  },
  keywords: {
    title: 'Keywords',
    infoText: `Specify keywords that characterize the dataset.
    Keywords affect the dataset's findability. Use terms that are as precise as possible.
    This field does not include an automatic translation for different languages.
    You can specify multiple keywords by separating them with a comma (,).`,
    placeholder: 'E.g. Economics',
    alreadyAdded: 'Keyword already added',
    addButton: 'Add keyword',
  },
  subjectHeadings: {
    title: 'Subject Headings',
    infoText: `Choose subject headings for your dataset.
    The field suggests subject headings as your type text in the field.
    Finnish and Swedish translations are available for all subject headings.
    The suggested subject headings are from KOKO ontology maintaned by Finto.`,
    placeholder: 'Type to search for available options',
    help: 'Choose subject headings from the KOKO Ontology. It also has English and Swedish translations of the terms.',
  },
  error: {
    title: 'A title is required in at least one language.',
    description: 'A description is required in at least one language.',
  },
}

export default description
