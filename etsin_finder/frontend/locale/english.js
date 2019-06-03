/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

const english = {
  changepage: 'Navigated to page: %(page)s',
  dataset: {
    access_permission: 'Ask for access',
    access_locked: 'Restricted Access',
    access_open: 'Open Access',
    access_rights: 'Access',
    catalog_publisher: 'Catalog publisher',
    citation: 'Citation',
    citation_formats: 'Show more citation formats',
    contact: {
      access: 'Contact the curator on issues related to dataset access',
      contact: 'Contact',
      email: {
        error: { required: 'Email is required!', invalid: 'Invalid email address' },
        name: 'Email',
        placeholder: 'Enter your email',
      },
      error: 'Error sending message!',
      errorInternal: 'Internal server error! Please contact our support',
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
    copyToClipboard: 'Copy to clipboard',
    creator: {
      plrl: 'Creators',
      snglr: 'Creator',
    },
    curator: 'Curator',
    data_location: 'Go to harvested location',
    dl: {
      root: 'root',
      breadcrumbs: 'Breadcrumbs',
      category: 'Category',
      dirContent: 'Folder content',
      download: 'Download',
      downloadAll: 'Download all',
      downloading: 'Downloading...',
      fileAmount: '%(amount)s objects',
      close_modal: 'Close info modal',
      info_header: 'Other info related to file',
      loading: 'Loading folder',
      loaded: 'Folder loaded',
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
      remote: 'Remote resources',
      checksum: 'Checksum',
      id: 'ID',
      title: 'Title',
      type: 'Type',
      go_to_original: 'Go to original',
      sliced: 'Some files are not displayed in this view due to large amount of files'
    },
    events_idn: {
      events: {
        title: 'Events',
        event: 'Event',
        who: 'Who',
        when: 'When',
        event_title: 'Title',
        description: 'Description',
      },
      other_idn: 'Other identifiers',
      relations: {
        title: 'Relations',
        type: 'Type',
        name: 'Title',
        idn: 'Identifier',
      },
    },
    doi: 'DOI',
    field_of_science: 'Field of science',
    funder: 'Funder',
    goBack: 'Go back',
    identifier: 'Identifier',
    infrastructure: 'Infrastructure',
    issued: 'Release date',
    modified: 'Dataset modification date',
    keywords: 'Keywords',
    license: 'License',
    loading: 'Loading dataset',
    harvested: 'Harvested',
    cumulative: 'Cumulative',
    permanent_link: 'Permanent link to this page',
    project: {
      project: 'Project',
      name: 'Name',
      identifier: 'Identifier',
      sourceOrg: 'Organizations',
      funding: 'Funding',
      has_funder_identifier: 'Funder identifier',
      funder: 'Funder',
      funder_type: 'Funder type',
      homepage: 'Project homepage',
      homepageUrl: 'Link',
      homepageDescr: 'Description'
    },
    publisher: 'Publisher',
    go_to_original: 'Go to original location',
    rights_holder: 'Rights Holder',
    spatial_coverage: 'Spatial Coverage',
    temporal_coverage: 'Temporal Coverage',
    tags: 'Dataset tags',
    version: { number: 'Version %(number)s', old: '(Old)' },
    agent: {
      contributor_role: 'Contributor role',
      contributor_type: 'Contributor type',
      member_of: 'Member of',
      is_part_of: 'Is part of',
      homepage: 'Homepage',
    },
    language: 'Language',
  },
  error: {
    notFound:
      'Sorry, we are having some technical difficulties at the moment. Please, try again later.',
    notLoaded: "Sorry! The page couldn't be found.",
    undefined: 'Sorry! An error occured.',
  },
  general: {
    showMore: 'Show more',
    showLess: 'Show less',
    description: 'Description',
    notice: {
      SRhide: 'piilota ilmoitus',
    },
    state: {
      changedLang: 'Changed language to: %(lang)s',
      inactiveLogout: 'You have been logged out due to inactivity',
    },
    pageTitles: {
      data: 'Data',
      idnAndEvents: 'Identifiers and Events',
      maps: 'Maps',
      dataset: 'Dataset',
      datasets: 'Datasets',
      home: 'Home',
      error: 'Error',
    },
    language: {
      toggleLabel: 'Toggle language',
    },
  },
  home: {
    title: 'Search datasets',
    title1: 'What is Etsin?',
    title2: 'How can I get access to the datasets?',
    para1:
      'Etsin enables you to find research datasets from all fields of science. Etsin contains information about the datasets and metadata in the national Finnish Fairdata services. We also currently harvest information from the Language Bank of Finland, the Finnish Social Science Data archive and the Finnish Environmental Institute, and new sources will be included.',
    para2:
      'The published metadata on the dataset is open to everyone. The data owner decides how and by whom the underlying research data can be accessed. Etsin works independently of actual data storage location and contains no research datasets. Datasets can be described and published through the <a href="https://qvain.fairdata.fi">Qvain service.</a><br><br>Read more about the Finnish Fairdata services on the <a href="https://fairdata.fi">Fairdata.fi</a> pages.',
    key: {
      dataset: 'datasets',
      keywords: 'keywords',
      fos: 'fields of science',
      research: 'projects',
    },
  },
  nav: {
    login: 'Login',
    logout: 'Logout',
    logoutNotice: 'Logged out. Close browser to also logout from HAKA',
    data: 'Data',
    dataset: 'Dataset',
    datasets: 'Datasets',
    events: 'Identifiers and events',
    help: 'Help',
    home: 'Home',
    organizations: 'Organizations',
    addDataset: 'Add dataset',
  },
  results: {
    resultsFor: 'Results for query: ',
    amount: {
      plrl: '%(amount)s results',
      snglr: '%(amount)s result',
    },
  },
  search: {
    name: 'Search',
    placeholder: 'Search term',
    sorting: {
      sort: 'Sort',
      best: 'Most relevant',
      bestTitle: 'Relevance',
      dateA: 'Oldest first',
      dateATitle: 'Oldest',
      dateD: 'Last modified',
      dateDTitle: 'Newest',
    },
    filter: {
      clearFilter: 'Remove filters',
      filtersCleared: 'Filters cleared',
      filters: 'Filters',
      filter: 'Filter',
      SRactive: 'active',
      show: 'More',
      hide: 'Less'
    },
    pagination: {
      prev: 'Previous page',
      next: 'Next page',
      SRskipped: 'Skipped pages indicator',
      SRpage: 'page',
      SRcurrentpage: 'current page',
      SRpagination: 'Pagination',
      changepage: 'Page %(value)s',
    },
    noResults: {
      searchterm: 'Your search - <strong>%(search)s</strong> - did not match any documents.',
      nosearchterm: 'Your seach did not match any documents.',
    },
  },
  qvain: {
    unsuccessfullLogin: 'Login unsuccessful.',
    notCSCUser1: 'Please make sure that you have a valid CSC account. If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with CSC account. Please do the registration in',
    notCSCUserLink: ' CSC Customer Portal',
    notCSCUser2: ' You can register with or without Haka account.',
    notLoggedIn: 'Please login to use Qvain-light service.',
    title: 'Publish Dataset',
    common: {
      cancel: 'Cancel',
      save: 'Save'
    },
    description: {
      title: 'Description',
      description: {
        langEn: 'ENGLISH',
        langFi: 'FINNISH',
        title: {
          label: 'Title',
          placeholderEn: 'Title (English)',
          placeholderFi: 'Title (Finnish)'
        },
        description: {
          label: 'Description',
          placeholderEn: 'Description (English)',
          placeholderFi: 'Description (Finnish)'
        },
        instructions: 'Only one launguage selection is mandatory'
      },
      otherIdentifiers: {
        title: 'Other Identifiers',
        instructions: 'Identifier for the metadata will be created automatically but if there alredy is an EXISTING identifier please insert it here.',
        addButton: '+ Add new'
      },
      fieldOfScience: {
        title: 'Field of Science',
        placeholder: 'Select option'
      },
      keywords: {
        title: 'Keywords',
        placeholder: 'E.g. economy'
      }
    },
    rightsAndLicenses: {
      title: 'Rights And Licenses',
      accessType: {
        title: 'Access Type',
        placeholder: 'Select option'
      },
      embargoDate: {
        label: 'Embargo expiration date',
        placeholder: 'Date',
        help: 'By default, expiration date will be indefinite if not set.'
      },
      restrictionGrounds: {
        title: 'Restriction Grounds',
        placeholder: 'Select option',
        text: 'When access type is "Restricted", please choose the restriction grounds.'
      },
      license: {
        title: 'License',
        placeholder: 'Select option'
      }
    },
    participants: {
      title: 'Participants',
      add: {
        title: 'Participants',
        help: 'Creator (1+) and publisher (max 1) roles are mandatory. Notice that one participant can have multiple roles.',
        radio: {
          person: 'Person',
          organization: 'Organization'
        },
        checkbox: {
          creator: 'Creator',
          publisher: 'Publisher',
          curator: 'Curator'
        },
        name: {
          placeholder: {
            organization: 'Name',
            person: 'First And Last Name'
          },
          label: 'Name'
        },
        email: {
          placeholder: 'Email',
          label: 'Email'
        },
        identifier: {
          label: 'Identifier',
          placeholder: 'e.g http://orcid.org'
        },
        organization: {
          label: {
            person: 'Organization',
            organization: 'Parent Organization'
          },
          placeholder: 'E.g. University of Helsinki'
        },
        save: {
          label: 'Save'
        },
        cancel: {
          label: 'Cancel'
        },
        newOrganization: {
          label: 'Add'
        }
      },
      added: {
        title: 'Added Participants',
        noneAddedNotice: 'No participants added'
      }
    },
    validationMessages: {
      title: {
        string: 'The Title must be a string value.',
        max: 'The Title is too long.',
        required: 'The Title is required in at least one language.'
      },
      description: {
        string: 'The Description must be a string value.',
        max: 'The description is too long.',
        required: 'The Description is required in at least one language.'
      },
      otherIdentifiers: {
        string: 'Other Identifiers must be string value.',
        url: 'Ther Identifiers should be valid URLs.',
        max: 'Identifier too long.'
      },
      fieldOfScience: {},
      keywords: {
        string: 'Keywords must be string value.',
        max: 'Keyword too long.',
        required: 'At least one keyword is required.'
      },
      participants: {
        type: {
          mixed: '',
          oneOf: 'Participant type can only be "person" or "organization"',
          required: 'The Type of the Participant is required.'
        },
        roles: {
          mixed: '',
          oneOf: 'Roles must be one of "creator", "publisher" or "curator".',
          required: 'You must specify the role of the participant. Creator field is mandatory and there must be exactly one Publisher.'
        },
        name: {
          string: 'The Name must be a string value.',
          max: 'Name too long.',
          required: 'Name is a required field.'
        },
        email: {
          string: '',
          max: 'Email too long.',
          email: 'Please insert a valid Email address.',
          nullable: ''
        },
        identifier: {
          string: '',
          max: 'Identifier too long.',
          nullable: ''
        },
        organization: {
          mixed: '',
          object: 'The Selected Organization should be an Object.',
          string: 'The Organization value must be string.',
          required: 'Organization is required if the partisipant is a person.'
        }
      },
      accessType: {
        string: 'Access Type must be string value.',
        url: 'Reference value ERROR.',
        required: 'Access Type is a required field.'
      },
      restrictionGrounds: {
        string: 'Restriction Grounds must be string value.',
        url: 'Reference value ERROR.',
        required: 'Restriction Grounds are required if Access Type is not "Open".'
      },
      license: {}
    },
    files: {
      title: 'Files',
      ida: {
        help: 'If you have files in Fairdata IDA you can link them from here:',
        button: {
          label: 'Link files from Fairdata IDA'
        }
      },
      projectSelect: {
        placeholder: 'Select project'
      },
      selected: {
        title: 'Selected files',
        form: {
          title: {
            label: 'Title',
            placeholder: 'Title'
          },
          description: {
            label: 'Description',
            placeholder: 'Description'
          },
          directoryFiles: {
            label: 'Files within directory'
          },
          use: {
            label: 'Use category',
            placeholder: 'Select option'
          },
          fileType: {
            label: 'File type',
            placeholder: 'Select option'
          },
          fileFormat: {
            label: 'File format',
            placeholder: 'Select option'
          },
          formatVersion: {
            label: 'File format version',
            placeholder: 'Select option'
          },
          isSequential: {
            label: 'File is sequential'
          },
          csvDelimiter: {
            label: 'Delimiter',
            placeholder: 'Select option'
          },
          csvHasHeader: {
            label: 'Has header'
          },
          csvRecordSeparator: {
            label: 'Record separator',
            placeholder: 'Select option'
          },
          csvQuoteChar: {
            label: 'Quoting character',
            placeholder: 'Quoting character, e.g. \\'
          },
          csvEncoding: {
            label: 'Encoding',
            placeholder: 'Select option'
          },
          identifier: {
            label: 'Identifier'
          }
        }
      },
      external: {
        help: 'Add link to external files from here:',
        button: {
          label: 'Add link to external files'
        },
        addedResources: {
          title: 'Added external resources',
          none: 'None added'
        },
        form: {
          title: {
            label: 'Title',
            placeholder: 'A Resource'
          },
          url: {
            label: 'URL',
            placeholder: 'https://'
          },
          save: {
            label: 'Save'
          },
          add: {
            label: 'Add'
          }
        }
      }
    }
  },
  slogan: 'Research data finder',
  stc: 'Skip to content',
  tombstone: {
    info: 'The dataset has been either deprecated or removed',
  },
}

export default english
