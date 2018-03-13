const english = {
  addDataset: 'Add dataset',
  changepage: 'Navigated to page: %(page)s',
  dataset: {
    access_permission: 'Ask for access',
    access_locked: 'Restricted Access',
    access_open: 'Open Access',
    access_rights: 'Access rights statement',
    citation: 'Citation',
    citation_formats: 'Show more citation formats',
    contact: {
      contact: 'Contact',
      email: {
        error: { required: 'Email is required!', invalid: 'Invalid email address' },
        name: 'Email',
        placeholder: 'Enter your email',
      },
      error: 'Error sending message!',
      message: {
        error: {
          required: 'Message is required!',
          max: 'Maximum message length is 1000 characters',
        },
        name: 'Message',
        placeholder: 'Enter your message',
      },
      recipient: {
        error: { required: 'Recipient is required!' },
        placeholder: 'Select recipient',
        name: 'Recipient',
      },
      send: 'Send message',
      subject: {
        error: { required: 'Subject is required!' },
        name: 'Subject',
        placeholder: 'Enter your subject',
      },
      success: 'Successfully sent message!',
    },
    contributor: {
      plrl: 'Contributors',
      snglr: 'Contributor',
    },
    creator: {
      plrl: 'Creators',
      snglr: 'Creator',
    },
    curator: 'Curator',
    data_location: 'Go to harvested location',
    dl: {
      breadcrumbs: 'Breadcrumbs',
      category: 'Category',
      dirContent: 'Folder content',
      download: 'Download',
      downloadAll: 'Download all',
      fileAmount: '%(amount)s objects',
      file_types: {
        both: 'files and folders',
        directory: 'Folder',
        file: 'file',
      },
      files: 'Files',
      info: 'Info',
      info_about: 'about object: %(file)s',
      item: 'item %(item)s',
      name: 'Name',
      size: 'Size',
    },
    doi: 'DOI',
    field_of_science: 'Field of science',
    funder: 'Funder',
    identifier: 'Identifier',
    infrastructure: 'Infrastructure',
    keywords: 'Keywords',
    license: 'License',
    permanent_link: 'Permanent link to this page',
    project: 'Project',
    publisher: 'Publisher',
    rights_holder: 'Rights Holder',
    spatial_coverage: 'Spatial Coverage',
    temporal_coverage: 'Temporal Coverage',
  },
  error: {
    notFound: "Couldn't find metadata for given id",
    notLoaded: 'Sorry! There was a problem loading the page.',
  },
  general: {
    description: 'Description',
  },
  home: {
    title: 'Search datasets',
  },
  nav: {
    data: 'Data',
    dataset: 'Dataset',
    datasets: 'Datasets',
    help: 'Help & About',
    home: 'Home',
    organizations: 'Organizations',
  },
  results: {
    amount: {
      plrl: '%(amount)s results',
      snglr: '%(amount)s result',
    },
  },
  search: {
    placeholder: 'Search term',
    sorting: {
      best: 'Best Match',
      dateA: 'Date ascending',
      dateD: 'Date descending',
    },
  },
  slogan: 'Research data finder',
  stc: 'Skip to content',
  tombstone: {
    info: 'The dataset has been either deprecated or removed',
  },
}

export default english
