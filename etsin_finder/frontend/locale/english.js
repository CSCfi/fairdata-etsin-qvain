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
    access_login: 'Login to apply for access',
    access_unavailable: 'Unavailable',
    access_denied: 'Application denied',
    access_draft: 'Application in draft state',
    access_request_sent: 'Access request sent',
    access_granted: 'Access granted',
    access_rights_description: {
      none: '',
      open: 'Anyone can access the data.',
      login: 'Users have to log in to access the data.',
      embargo: 'Data can be accessed only after the embargo has expired.',
      permit:
        'Data can be accessed only by applying for permission. You need to be logged in to be able to fill-in the application.',
      restricted: 'Data cannot be accessed.',
    },
    access_permission: 'Ask for access',
    access_locked: 'Restricted Access',
    access_open: 'Open Access',
    access_rights: 'Access',
    catalog_publisher: 'Catalog publisher',
    citation: 'Citation / Reference',
    citation_formats: 'Show more citation formats',
    citationNoDateIssued: 'Issued date not defined',
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
    copy: 'Copy',
    copyToClipboard: 'Copy to clipboard',
    copyToClipboardSuccess: 'Copied identifier to clipboard',
    creator: {
      plrl: 'Creators',
      snglr: 'Creator',
    },
    curator: 'Curator',
    data_location: 'Go to harvested location',
    datasetAsFile: {
      open: 'Download dataset metadata',
      infoText:
        'Datacite without validation: The dataset is shown in Datacite Format but without validation; mandatory fields might be missing. Dataset does not necessarily meet all Datacite requirements.',
      datacite: 'In Datacite datamodel (XML)',
      fairdata_datacite: 'In Datacite datamodel without validation (XML)',
      metax: 'In Metax datamodel (JSON)'
    },
    draftInfo: {
      draft: 'This dataset is a draft. Only the creator of the dataset can view it.',
      changes:
        'This is a preview of unpublished changes to a dataset.  Only the creator of the dataset can view it.',
    },
    draftIdentifierInfo: 'Dataset identifier will be generated when the dataset is published.',
    dl: {
      root: 'root',
      breadcrumbs: 'Breadcrumbs',
      category: 'Category',
      dirContent: 'Folder content',
      download: 'Download',
      downloadFailed: 'Download failed',
      downloadAll: 'Download all',
      downloadDisabledForDraft: 'Download disabled for draft',
      downloading: 'Downloading...',
      downloadItem: 'Download %(name)s',
      fileAmount: '%(amount)s objects',
      close_modal: 'Close info modal',
      customMetadata: 'Metadata',
      info_header: 'Other info related to file',
      loading: 'Loading folder',
      loaded: 'Folder loaded',
      errors: {
        showDetails: 'Show details',
        hideDetails: 'Hide details',
        serviceUnavailable: 'The download service is currently unavailable. Please try again later.',
        unknownError: 'There was an error using the download service.',
      },
      packages: {
        createForAll: 'Generate download package',
        createForItem: 'Create download package for %(name)s',
        pending: 'Generating download package',
        loading: 'Loading',
      },
      fileCount: {
        one: '1 file',
        other: '%(count)s files',
      },
      file_types: {
        both: 'files and folders',
        directory: 'Folder',
        file: 'file',
      },
      files: 'Files',
      info: 'Info',
      info_about: 'about object: %(file)s',
      infoHeaders: {
        file: 'File information',
        directory: 'Folder information',
      },
      infoModalButton: {
        directory: {
          general: 'Folder %(name)s information',
          custom: 'Folder %(name)s information and metadata',
        },
        file: {
          general: 'File %(name)s information',
          custom: 'File %(name)s information and metadata',
        },
      },
      item: 'item %(item)s',
      name: 'Name',
      size: 'Size',
      remote: 'Remote resources',
      checksum: 'Checksum',
      id: 'ID',
      title: 'Title',
      type: 'Type',
      go_to_original: 'Go to original',
      sliced: 'Some files are not displayed in this view due to large amount of files',
      cumulativeDatasetLabel: 'Note: Dataset is growing',
      cumulativeDatasetTooltip: {
        header: 'Growing dataset',
        info:
          'This dataset is still growing, be aware of this when you cite it or use it. Temporal coverage should be mentioned. No existing files can, however, be removed or changed.',
      },
    },
    events_idn: {
      deleted_versions: {
        title: 'Deleted Versions',
        date: 'Delete date',
        version: 'Version',
        link_to_dataset: 'Link to dataset',
      },
      events: {
        title: 'Events',
        event: 'Event',
        who: 'Who',
        when: 'When',
        event_title: 'Title',
        description: 'Description',
        deletionEvent: 'Dataset deletion',
        deletionOfDatasetVersion: 'Deleted dataset version: ',
      },
      other_idn: 'Other identifiers',
      origin_identifier: 'Origin dataset identifier',
      relations: {
        title: 'Relations',
        type: 'Type',
        name: 'Title',
        idn: 'Identifier',
      },
    },
    map: {
      geographic_name: 'Geographical name',
      full_address: 'Full address',
      alt: 'Altitude (m)',
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
    subjectHeading: 'Subject heading',
    license: 'License',
    loading: 'Loading dataset',
    harvested: 'Harvested',
    cumulative: 'Cumulative',
    go_to_original: 'Go to original location',
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
      homepageDescr: 'Description',
    },
    publisher: 'Publisher',
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
    fairdataPas: 'Fairdata DPS',
    storedInPas:
      "This dataset is stored in Fairdata's Digital Preservation Service (data not accessible via Etsin).",
    pasDatasetVersionExists:
      "This is a use copy of this dataset. A copy is also stored in Fairdata's Digital Preservation Service. ",
    originalDatasetVersionExists: 'There is an existing use copy of the dataset. ',
    linkToPasDataset: "Click here to open the Digial preservation Service's version",
    linkToOriginalDataset: 'You can open the use copy by clicking here',
    enteringPas: 'Entering DPS',
    dataInPasDatasetsCanNotBeDownloaded: 'DPS dataset data cannot be downloaded',
  },
  error: {
    cscLoginRequired: 'This page requires you to be logged in with a CSC account.',
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
    qvainPageTitle: 'Qvain | Research Dataset Description Tool',
    etsinPageTitles: {
      data: 'Data',
      events: 'Identifiers and Events',
      maps: 'Maps',
      dataset: 'Dataset',
      datasets: 'Datasets',
      home: 'Home',
      qvain: 'Qvain',
      error: 'Error - The page could not be found',
    },
    language: {
      toggleLabel: 'Switch language to: %(otherLang)s',
    },
    cookies: {
      section: 'Cookie notification',
      accept: 'Accept all cookies',
      infoText: 'The Fairdata services use cookies and tracking to ensure security and quality.',
      link: 'View the Fairdata Privacy Policy',
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
    tooltip: {
      datasets: 'View datasets in Search -page',
      keywords: 'View keywords in Search -page',
      fos: 'View fields of science in Search -page',
      research: 'View projects in Search -page',
    },
    includePas: 'Include Fairdata DPS datasets',
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
    addDataset: 'Create/edit datasets',
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
      hide: 'Less',
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
      nosearchterm: 'Your search did not match any documents.',
    },
  },
  qvain: {
    validation: {},
    nav: {
      home: 'Home',
      createDataset: 'Create Dataset',
      editDataset: 'Edit Dataset',
    },
    home: {
      brief: 'Research Dataset Description Tool',
      description:
        'Fairdata Qvain tool makes describing and publishing your research data effortless for you. It offers you a straightforward form in which to fill information about your data. Once you are happy with it, you can simply publish the dataset and make it visible to others. Qvain provides your dataset with a persistent identifier, landing page and distributes it to other relevant services.',
      howTo: 'How to start using Qvain and user guides',
      dataInIda: 'Data stored in IDA',
      dataInExternal: 'Data stored outside of Fairdata',
      qvainDataset: 'Describe your dataset, publish it and get a persistent identifier.',
      etsinSearch: 'Your dataset can be discovered and downloaded in Etsin.',
    },
    general: {
      looseActors: {
        warning:
          "Some of the actors' role is marked as provenance but they are not attached in any of existing provenances. Saving the dataset will remove these orphaned actors. Following actors will be removed:",
        question: 'Do you still want to save the dataset?',
        confirm: 'Yes, remove the actors and save',
        cancel: 'No, continue editing',
      },
      looseProvenances: {
        warning: 'You are about to remove actor that is linked to the following provenances:',
        question: 'Removing actor will remove it from these provenances. Do you want to proceed?',
        confirm: 'Yes, remove actor from provenances',
        cancel: "No, don't remove actor",
      },
      langFi: 'Finnish',
      langEn: 'English',
      buttons: {
        edit: 'Edit',
        remove: 'Remove',
        add: 'Add',
        save: 'Save',
        cancel: 'Cancel',
      },
    },
    saveDraft: 'Save Draft',
    submit: 'Save and Publish',
    edit: 'Update Dataset',
    unsavedChanges:
      'Leaving the editor will discard your unsaved changes. Are you sure you want to leave the editor?',
    consent:
      'By using Qvain the user agrees that he or she has asked consent from all persons whose personal information the user will add to the descriptive data and informed them of how they can get their personal data removed. By using Qvain the user agrees to the <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">Terms of Usage</a>.',
    submitStatus: {
      success: 'Dataset published!',
      draftSuccess: 'Draft saved!',
      fail: 'Something went wrong...',
      editFilesSuccess: 'New dataset version has been created!',
      editMetadataSuccess: 'Dataset successfully updated!',
    },
    pasInfo: {
      stateInfo: 'This is a DPS dataset. The state of the dataset is "%(state)s: %(description)s".',
      editable: 'You can edit metadata but cannot add or remove any files.',
      readonly: 'You can view metadata but cannot make any changes.',
    },
    pasState: {
      0: 'Waits for validation',
      10: 'Proposed for digital preservation',
      20: 'Validating',
      30: 'Enriching failed',
      40: 'Check metadata',
      50: 'Validation failed',
      60: 'Metadata updated',
      65: 'Validating metadata',
      70: 'Waits for transfer',
      75: 'Metadata confirmed',
      80: 'Transfer started',
      90: 'Packaging',
      100: 'Packaging failed',
      110: 'Transferring',
      120: 'OK – preserved',
      130: 'Transfer failed',
      140: 'Available',
    },
    useDoiHeader: 'Creation of a DOI',
    useDoiContent:
      'You have selected DOI as primary identifier for your dataset instead of URN. DOI requires a defined issued date and a dataset publisher. A DOI (Digital Object Identifier) will be created and stored in the DataCite Service and it cannot be removed. Are you sure you want to select DOI?',
    useDoiAffirmative: 'Yes',
    useDoiNegative: 'No',
    notCSCUser1:
      'Please make sure that you have a valid CSC account. If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with CSC account. Please do the registration in',
    notCSCUserLink: ' CSC Customer Portal',
    notCSCUser2: ' You can register with or without Haka account.',
    notLoggedIn: 'Please login with your CSC account to use Qvain.',
    titleCreate: 'Create new dataset',
    titleEdit: 'Edit dataset',
    titleLoading: 'Loading dataset',
    titleLoadingFailed: 'Loading dataset failed',

    error: {
      deprecated:
        'Cannot publish dataset because it is deprecated. Please resolve deprecation first.',
      permission: 'Permission error loading dataset',
      missing: 'Dataset not found',
      default: 'Error loading dataset',
    },
    backLink: ' Back to datasets',
    common: {
      save: 'Save',
      cancel: 'Cancel',
    },
    confirmClose: {
      warning: 'You have unsaved changes. Are you sure you want to discard your changes?',
      confirm: 'Yes, discard changes',
      cancel: 'No, continue editing',
    },
    select: {
      placeholder: 'Select option',
      searchPlaceholder: 'Type to search for options',
    },
    organizationSelect: {
      label: {
        addNew: 'Add organization manually',
        name: 'Organization name',
        email: 'Organization email',
        identifier: 'Organization identifier',
      },
      placeholder: {
        name: 'Name',
        email: 'Email',
        identifier: 'e.g http://orcid.org',
      },
      validation: {
        name: 'A name is required',
        email: 'A valid email address is required',
      },
    },
    datasets: {
      title: 'Your Datasets',
      search: {
        hidden: 'Search',
        searchTitle: 'Search from the list (to filter the datasets)',
        placeholder: 'Filter datasets by name',
      },
      help: 'Choose a dataset to edit or create a new dataset',
      createButton: 'Create new dataset',
      createNewVersion: 'Create new version',
      useAsTemplate: 'Use as template',
      state: {
        draft: 'Draft',
        published: 'Published',
        changed: 'Unpublished changes',
      },
      tableRows: {
        id: 'ID',
        title: 'Title',
        version: 'Version',
        modified: 'Modified',
        created: 'Created',
        state: 'Status',
        actions: 'Actions',
        dateFormat: {
          moments: 'A few moments ago',
          oneMinute: '1 minute ago',
          minutes: 'minutes ago',
          oneHour: '1 hour ago',
          hours: 'hours ago',
          oneDay: '1 day ago',
          days: 'days ago',
          oneMonth: '1 month ago',
          months: 'months ago',
          oneYear: '1 year ago',
          years: 'years ago',
        },
      },
      moreActions: 'More',
      moreVersions: {
        one: 'Show 1 more version',
        other: 'Show %(count)s more versions',
      },
      hideVersions: 'Hide old versions',
      oldVersion: 'Old',
      latestVersion: 'Latest',
      deprecated: 'Deprecated',
      editButton: 'Edit',
      editDraftButton: 'Edit draft',
      deleteButton: 'Delete',
      revertButton: 'Revert changes',
      remove: {
        confirm: {
          published: {
            text:
              'Are you sure you want to delete this dataset? Deleting the dataset will remove it from Qvain, and Etsin Search cannot find it anymore. Landing page for the dataset will NOT be removed.',
            ok: 'Delete',
          },
          draft: {
            text:
              'Are you sure you want to delete this draft? The draft will be removed permanently.',
            ok: 'Delete',
          },
          changes: {
            text: 'Are you sure you want to revert all unpublished changes made to this dataset?',
            ok: 'Revert',
          },
          cancel: 'Cancel',
        },
      },
      goToEtsin: 'View in Etsin',
      goToEtsinDraft: 'Preview in Etsin',
      openNewVersion: 'Open new version',
      noDatasets: 'You have no datasets',
      reload: 'Reload',
      loading: 'Loading...',
      errorOccurred: 'An error occurred',
      tableHeader: 'Created datasets',
    },
    description: {
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
    },
    rightsAndLicenses: {
      title: 'Rights And Licenses',
      infoTitle: 'Rights And Licenses info',
      accessType: {
        title: 'Access Type',
        infoText:
          'This field sets how the data in your dataset can be accessed. Whichever option is selected does not affect the visibility of the dataset description (metadata) itself; it only affects the openness of the linked data (files). If you select anything else than "Open", you must also choose a reason for the restriction (field "Restriction Grounds" will appear). If you select "Embargo", please also specify the embargo expiration date ("Embargo expiration date" field will appear).',
        placeholder: 'Select option',
        permitInfo:
          'By default the dataset owner (the original describer) can approve the applications. In addition, functionality is under development to allow chosen representatives (only or in addition to the owner) of the dataset\'s organization to make the approvals. By using the access type "Requires permission" the dataset owner agrees to these upcoming changes.',
      },
      embargoDate: {
        label: 'Embargo expiration date',
        placeholder: 'Date',
        help: 'By default, expiration date will be indefinite if not set.',
      },
      restrictionGrounds: {
        title: 'Restriction Grounds',
        placeholder: 'Select option',
        text: 'When access type is not "Open", you need to define the restriction grounds.',
      },
      license: {
        title: 'License',
        infoText:
          'License is an essential part of the dataset description. The license describes how the dataset can be used. As a default, the recommended CC BY 4.0 license is selected, but you can change it if needed. If you want to add a URL to an existing license page, please type the URL and select the "Other (URL)" option.',
        placeholder: 'Select option',
        other: {
          label: 'URL address',
          help: 'Specify URL address for license',
        },
        addButton: 'Add license',
      },
    },
    actors: {
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
    },
    validationMessages: {
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
            publisher:
              'Actors: Publisher role is mandatory. Note: one actor can have multiple roles.',
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
    },
    files: {
      title: 'Files',
      infoTitle: 'Files info',
      infoText: 'Add text',
      deletedLabel: 'Deleted',
      error: {
        title: 'Error loading files',
        retry: 'Retry',
      },
      dataCatalog: {
        label: 'File origin',
        infoText:
          "Fairdata Services need to know whether you are linking files from IDA or remote resources. You can also publish datasets without any files. In that case, please still select either one. The selection cannot be re-done, so if you are not sure whether you'll add files later, select the one you think you'll need in the future.",
        explanation:
          'Choose "IDA" if the data is stored in Fairdata IDA Service. Choose "Remote resources" if the data is in remote location.',
        doiSelection:
          'I want the published dataset to have a DOI (digital object identifier) instead of a URN.',
        doiSelectedHelp:
          'When the dataset is published, a DOI will be created and stored in the DataCite Service. This operation cannot be undone. The issued date of a dataset that has been published with a DOI cannot be changed afterwards.',
        placeholder: 'Select option',
        ida: 'IDA',
        att: 'Remote resources',
        pas: 'DPS',
      },
      cumulativeState: {
        label: 'Cumulative dataset',
        radio: {
          no:
            'No. (Adding files or folders will automatically create a new version of the dataset.)',
          yes: 'Yes. (New files or folders will be added without a version change.)',
          note:
            'Note! Once the dataset has been submitted, changing the value from "No" to "Yes" will cause a new version of the dataset to be created. Change from "Yes" to "No" will not cause a new version.',
        },
        enabled: {
          state: 'This dataset has been marked as a cumulative dataset.',
          explanation:
            'It means that data is added to it regularly. If data is no longer being added to this dataset, you should turn it non-cumulative.',
          button: 'Turn non-cumulative',
          note:
            'Note! Once changed, turning the dataset back to cumulative will create a new version of the dataset.',
          confirm:
            'Are you sure you want to turn this dataset non-cumulative? If you later wish to change it back to cumulative, a new version will be created!',
          cancel: 'Cancel',
        },
        disabled: {
          state: 'This dataset has been marked non-cumulative.',
          explanation:
            'It means that if new data is added, a new version of the dataset will be created automatically.',
          button: 'Turn cumulative',
          note:
            'Note! Changing the dataset cumulative will create a new version of the dataset. The old version will remain non-cumulative.',
          confirm:
            'Are you sure you want to turn the dataset cumulative (you want to start regularly adding data into it)? A new version will be created and gets a new identifier. The old version stays non-cumulative.',
          cancel: 'Cancel',
        },
        modalHeader: 'Change dataset cumulation',
        closeButton: 'Close',
        changes: 'You need to save your changes to the dataset before you can change this setting.',
      },
      cumulativeStateV2: {
        label: 'Cumulative dataset',
        radio: {
          no:
            'No. (Adding files or folders to a published dataset requires you to create a new version of the dataset.)',
          yes: 'Yes. (New files or folders will be added without a version change.)',
          note:
            'Note! Once the dataset has been published, it cannot be turned cumulative without creating a new version of the dataset.',
        },
        enabled: {
          state: 'This dataset has been marked as a cumulative dataset.',
          explanation:
            'It means that data is added to it regularly. If data is no longer being added to this dataset, you should turn it non-cumulative.',
          button: 'Turn non-cumulative',
          note:
            'Note! Once changed, you need to create a new version of the dataset to turn it back to cumulative.',
        },
        disabled: {
          state: 'This dataset has been marked non-cumulative.',
          explanation:
            'Adding files or folders to a published dataset requires you to create a new version of the dataset.',
          note: 'Changing the dataset cumulative requires creating a new version of the dataset.',
        },
        stateChanged: {
          note: 'The new state will be applied once you save the dataset.',
          button: 'Cancel change',
        },
      },
      responses: {
        fail: 'Something went wrong...',
        changeComplete: 'Action complete.',
        versionCreated: 'A new dataset version has been created with identifier %(identifier)s.',
        openNewVersion: 'Open new version',
      },
      addItemsModal: {
        title: 'Select files from project',
        allSelected: 'All the files and folders in the project are already in the dataset.',
        buttons: {
          save: 'Add files',
          close: 'Close',
        },
        versionInfo:
          'Adding/removing files or folders will create a new version of this dataset when the changes are published. The old version will be tagged as "Old" and the files linked to it will remain untouched.',
      },
      refreshModal: {
        header: 'Refresh folder content',
        noncumulative:
          'If new files have been added to the folder, this will add them to the dataset and create a new version of it. The changes will take effect immediately.',
        cumulative:
          'If new files have been added to the folder, this will add them to the dataset. No new dataset version will be created. The changes will take effect immediately.',
        changes: 'You need to save your changes to the dataset first.',
        buttons: {
          show: 'Refresh folder content',
          ok: 'Ok',
          cancel: 'Cancel',
          close: 'Close',
        },
      },
      fixDeprecatedModal: {
        statusText:
          'This dataset is deprecated. Some of the files in the dataset are no longer available.',
        header: 'Fix Deprecated Dataset',
        help:
          'This will fix the dataset by removing any included files and directories that are no longer available. A new dataset version will be created. The changes will take place immediately.',
        changes: 'You need to save your changes to the dataset first.',
        buttons: {
          show: 'Fix deprecated dataset',
          ok: 'Fix dataset',
          cancel: 'Cancel',
          close: 'Close',
        },
      },
      metadataModal: {
        header: 'Digital Preservation metadata',
        help:
          'Saving the changes will update the file metadata regardless of whether the file is in your dataset or not.',
        csvOptions: 'CSV Options',
        fields: {
          fileFormat: 'File format',
          formatVersion: 'File format version',
          encoding: 'Encoding',
          csvDelimiter: 'Delimiter',
          csvRecordSeparator: 'Record separator',
          csvQuotingChar: 'Quoting character',
          csvHasHeader: 'Has header',
        },
        errors: {
          formatVersionRequired: 'Invalid or missing file format version.',
          formatVersionNotAllowed: 'File format version is not allowed for selected file format.',
          loadingFileFormats: 'Failed to load list of allowed file formats.',
        },
        buttons: {
          add: 'Add Digital Preservation metadata',
          show: 'Edit Digital Preservation metadata',
          delete: 'Remove Digital Preservation metadata',
          close: 'Close',
          save: 'Save changes',
          hideError: 'Continue editing',
        },
        clear: {
          header: 'Remove Digital Preservation metadata',
          help:
            'Are you sure you want to remove Digital Preservation metadata for file %(file)s? The change will take place immediately.',
          cancel: 'Cancel',
          confirm: 'Remove',
        },
        options: {
          delimiter: {
            tab: 'Tab',
            space: 'Space',
            semicolon: 'Semicolon ;',
            comma: 'Comma ,',
            colon: 'Colon :',
            dot: 'Dot .',
            pipe: 'Pipe |',
          },
          header: {
            false: 'No',
            true: 'Yes',
          },
        },
        placeholders: {
          noOptions: 'No options available',
          selectOption: 'Select an option',
          csvQuotingChar: 'Type a character',
        },
      },
      help:
        'Files associated with this dataset. A dataset can only have either IDA files or remote files. File metadata will not be associated with datasets, so remember to save edits to file metadata.',
      ida: {
        title: 'Fairdata IDA files',
        infoText:
          "Project dropdown will show all your IDA projects. Select the project from which you want to link your files. Note! One dataset can have files or folder from only one project. After you have chosen the project, you'll get a list of all files and folders that are FROZEN in that project. Select all files and folders you wish to link to your dataset. If you select a folder, ALL files and subfolders in that folder will be linked. In that case, do not select individual files or subfolders from that folder.",
        help: 'If you have files in Fairdata IDA you can link them from here:',
        button: {
          label: 'Link files from Fairdata IDA',
        },
      },
      projectSelect: {
        placeholder: 'Select project',
        loadError: 'Failed to load project folders, error: ',
        loadErrorNoFiles:
          'No files found. If you wish to make files available here, make sure that you have frozen the project files in IDA.',
      },
      selected: {
        title: 'Selected files',
        readonlyTitle: 'Selected files from project %(project)s',
        none: 'No files or folders have been selected yet.',
        newTag: 'To be added',
        removeTag: 'To be removed',
        hideRemoved: 'Hide removed',
        buttons: {
          edit: 'Edit %(name)s',
          remove: 'Remove %(name)s',
          undoRemove: 'Undo removing %(name)s',
          refresh: 'Refresh %(name)s',
          open: 'Open %(name)s',
          close: 'Close %(name)s',
          select: 'Select %(name)s',
          deselect: 'Deselect %(name)s',
        },
        addUserMetadata: 'Add metadata',
        editUserMetadata: 'Edit metadata',
        deleteUserMetadata: 'Remove metadata',
        form: {
          title: {
            label: 'Title',
            placeholder: 'Title',
          },
          description: {
            label: 'Description',
            placeholder: 'Description',
          },
          use: {
            label: 'Use category',
            placeholder: 'Select option',
          },
          fileType: {
            label: 'File type',
            placeholder: 'Select option',
          },
          identifier: {
            label: 'Identifier',
          },
        },
      },
      existing: {
        title: 'Previously selected files',
        help: {
          noncumulative:
            "These are the files and folders that you have added before. If you have added a folder and the content has changed  in IDA, it's NOT automatically updated into your dataset. All new files need to be manually added. Note the Versioning Rules!",
          cumulative:
            "These are the files and folders that you have added before. If you have added a folder and the content has changed in IDA, it's NOT automatically updated into your dataset. All new files need to be manually added. To be able to remove files, you first need to make the dataset non-cumulative.",
          pasEditable:
            'These are the files in the dataset. You can edit file metadata but cannot add or remove files.',
          pasReadonly:
            'These are the files in the dataset. You can view file metadata but cannot make changes.',
        },
      },
      notificationNewDatasetWillBeCreated: {
        header: 'Editing files and folders',
        content:
          'If you have already published the dataset, removing / adding files or folders will automatically create a new version of the dataset (excluding a published dataset without any files; you can add files/folder one time in the existing version). The old version will be tagged as "Old" and the files linked to it will remain untouched.',
      },
      external: {
        title: 'Remote resources (ATT)',
        infoText:
          'Please insert Title, Use Category and URLs for the remote files. Qvain does not upload or store the files, but the URLs act as active links to the files. Access URL = link to the page where the link / license information is. Download URL = direct link to download the file.',
        help: 'Add link to remote files from here:',
        button: {
          label: 'Add link to remote files',
        },
        addedResources: {
          title: 'Added remote resources',
          none: 'None added',
        },
        form: {
          title: {
            label: 'Title',
            placeholder: 'A Resource',
          },
          useCategory: {
            label: 'Use Category',
            placeholder: 'Select option',
          },
          accessUrl: {
            label: 'Access URL',
            placeholder: 'https://',
            infoText: 'Page where the link to the file / license information can be found',
          },
          downloadUrl: {
            label: 'Download URL',
            placeholder: 'https://',
            infoText: 'Direct link to start the download',
          },
          cancel: {
            label: 'Clear fields',
          },
          save: {
            label: 'Add external file',
          },
          add: {
            label: 'Add',
          },
        },
      },
    },
    history: {
      title: 'Related Material and History',
      tooltip: 'Related Material and History info',
      tooltipContent: {
        relatedResource: {
          title: 'Reference to a related resource',
          paragraph:
            'Refer to related datasets, publications, and other resources that are relevant in understanding this dataset. ',
        },
        provenance: {
          title: 'Provenance',
          paragraph: 'Information about the provenance of the data.',
        },
        infrastructure: {
          title: 'Infrastructure',
          paragraph: 'Services or tools that are used to produce the dataset.',
        },
      },
      relatedResource: {
        title: 'Reference to a related resource',
        description:
          'Refer to related datasets, publications, and other resources that are relevant in understanding this dataset. ',
        noItems: 'No references to a related resources have been added.',
        error: {
          nameRequired: 'Name is required in at least one language.',
          typeRequired: 'Relation type is required.',
        },
        modal: {
          addButton: 'Add reference to a related resource',
          title: {
            add: 'Add reference to a related resource',
            edit: 'Edit reference to a related resource',
          },
          buttons: {
            save: 'Save related resource',
            editSave: 'Apply changes',
            cancel: 'Cancel',
          },
          nameInput: {
            fi: {
              label: 'Name',
              placeholder: 'Name (in Finnish)',
            },
            en: {
              label: 'Name',
              placeholder: 'Name (in English)',
            },
          },
          descriptionInput: {
            fi: {
              label: 'Description',
              placeholder: 'Description (in Finnish)',
            },
            en: {
              label: 'Description',
              placeholder: 'Description (in English)',
            },
          },
          identifierInput: {
            label: 'Identifier',
            placeholder: 'Identifier',
          },
          relationTypeInput: {
            label: 'Relation type',
            placeholder: 'Relation type',
          },
          entityTypeInput: {
            label: 'Entity type',
            placeholder: 'Entity type',
          },
        },
      },
      infrastructure: {
        addButton: 'Add Infrastructure',
        title: 'Infrastructure',
        description: 'Services and tools that are used to produce the dataset.',
        noItems: 'No infrastuctures have been added.',
      },
      provenance: {
        title: 'Provenance',
        description: 'An action or event that the dataset was the subject of.',
        noItems: 'No provenances have been added.',
        error: {
          nameRequired: 'Name required at least in one language.',
          startDateMissing: 'Start date missing',
          endDateMissing: 'End date missing',
        },
        modal: {
          title: {
            add: 'Add Provenance',
            edit: 'Edit Provenance',
          },
          addButton: 'Add Provenance',
          buttons: {
            save: 'Add Provenance',
            editSave: 'Apply changes',
            cancel: 'Cancel',
          },
          nameInput: {
            fi: {
              label: 'Name',
              placeholder: 'Name (in Finnish)',
            },
            en: {
              label: 'Name',
              placeholder: 'Name (in English)',
            },
          },
          descriptionInput: {
            fi: {
              label: 'Description',
              placeholder: 'Description (in Finnish)',
            },
            en: {
              label: 'Description',
              placeholder: 'Description (in English)',
            },
          },
          outcomeDescriptionInput: {
            fi: {
              label: 'Outcome description',
              placeholder: 'Outcome description (in Finnish)',
            },
            en: {
              label: 'Outcome description',
              placeholder: 'Outcome description (in English)',
            },
          },
          periodOfTimeInput: {
            label: 'Period of time',
            startPlaceholder: 'Start date',
            endPlaceholder: 'End date',
          },
          locationInput: {
            label: 'Location',
            noItems: 'No locations have been added.',
            error: {
              nameRequired: 'Name is required',
              altitudeNan: 'Altitude must be a number',
            },
            modal: {
              addButton: 'Add location',
              title: {
                add: 'Add location',
                edit: 'Edit location',
              },
              buttons: {
                addGeometry: 'Add Geometry',
                save: 'Save',
                editSave: 'Update',
                cancel: 'Cancel',
              },
              nameInput: {
                label: 'Name',
                placeholder: 'Name',
              },
              altitudeInput: {
                label: 'Altitude',
                placeholder: 'The altitude of a spatial coverage (meters from WGS84 reference)',
              },
              addressInput: {
                label: 'Address',
                placeholder: 'Full address',
              },
              geometryInput: {
                label: 'Geometry',
                placeholder: 'Geometry using WKT format in WGS84 coordinate system',
              },
              locationInput: {
                label: 'Location',
                placeholder: 'Type to search available options',
              },
            },
          },
          outcomeInput: {
            label: 'Outcome',
            placeholder: 'Outcome',
          },
          usedEntityInput: {
            label: 'Used entities',
            noItems: 'No used entities have been added.',
            modal: {
              addButton: 'Add used entity',
              buttons: {
                save: 'Save',
                editSave: 'Update',
                cancel: 'Cancel',
              },
              title: {
                add: 'Add used entity',
                edit: 'Edit used entity',
              },
              nameInput: {
                fi: {
                  label: 'Name',
                  placeholder: 'Name (in Finnish)',
                },
                en: {
                  label: 'Name',
                  placeholder: 'Name (in English)',
                },
              },
              descriptionInput: {
                fi: {
                  label: 'Description',
                  placeholder: 'Description (in Finnish)',
                },
                en: {
                  label: 'Description',
                  placeholder: 'Description (in English)',
                },
              },
              identifierInput: {
                label: 'Identifier',
                placeholder: 'Identifier',
              },
              relationTypeInput: {
                label: 'Relation type',
                placeholder: 'Relation type',
              },
              entityTypeInput: {
                label: 'Entity type',
                placeholder: 'Entity type',
              },
            },
          },
          actorsInput: {
            label: 'Was associated with',
            placeholder: 'Add associated actor',
            createButton: 'Create new actor',
          },
          lifecycleInput: {
            label: 'Lifecycle event',
            placeholder: 'Lifecycle event',
          },
        },
      },
    },
    project: {
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
          validation: {
            required: 'At least one language is required.',
            string: 'The title must be a string value.',
          },
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
          validation: 'At least one producer organization is required',
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
              validation: 'Contributor role is required',
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
    },
    temporalAndSpatial: {
      title: 'Temporal and Spatial Coverage',
      tooltip: 'Temporal and Spatial Coverage info',
      tooltipContent: {
        spatial: {
          title: 'Spatial coverage',
          paragraph: 'Area covered by the dataset, e.g. places of observations.  ',
        },
        temporal: {
          title: 'Temporal coverage',
          paragraph: 'Time span that is covered by the dataset, e.g. period of observations. ',
        },
      },
      spatial: {
        title: 'Spatial coverage',
        description: 'Area covered by the dataset, e.g. places of observations.',
        noItems: 'No spatial coverage have been added.',
        error: {
          nameRequired: 'Name is required',
          altitudeNan: 'Altitude must be a number',
        },
        modal: {
          addButton: 'Add Spatial coverage',
          title: {
            add: 'Add Spatial coverage',
            edit: 'Edit spatial coverage',
          },
          buttons: {
            addGeometry: 'Add Geometry',
            save: 'Save',
            editSave: 'Apply changes',
            cancel: 'Cancel',
          },
          nameInput: {
            label: 'Name',
            placeholder: 'Name',
          },
          altitudeInput: {
            label: 'Altitude',
            placeholder: 'The altitude of a spatial coverage (meters from WGS84 reference)',
          },
          addressInput: {
            label: 'Address',
            placeholder: 'Full address',
          },
          geometryInput: {
            label: 'Geometry',
            placeholder: 'Geometry using WKT format in WGS84 coordinate system',
          },
          locationInput: {
            label: 'Location',
            placeholder: 'Type to search available options',
          },
        },
      },
      temporal: {
        title: 'Temporal coverage',
        description: 'Time span that is covered by the dataset, e.g. period of observations. ',
        addButton: 'Add temporal coverage',
        error: {
          startDateMissing: 'Start date is missing.',
          endDateMissing: 'End date is missing',
        },
        modal: {
          durationInput: {
            label: 'Period of time',
            startPlaceholder: 'Start date',
            endPlaceholder: 'End date',
          },
        },
      },
    },
  },
  slogan: 'Research data finder',
  stc: 'Skip to content',
  stsd: 'Skip to submit dataset',
  tombstone: {
    removedInfo: 'The dataset has been removed',
    deprecatedInfo: 'The dataset has been deprecated',
    urlToNew: 'A new version of this dataset is available.',
    urlToOld: 'An older (published) version of this dataset is available.',
    linkTextToNew: 'You can open the new version via this link.',
    linkTextToOld: 'You can open the version via this link.',
  },
  userAuthenticationError: {
    header: 'Login unsuccessful.',
    content:
      'Please make sure that you have a valid CSC account. If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with CSC account. Please see more instructions in: https://docs.csc.fi/#accounts/how-to-create-new-user-account/',
  },
  userHomeOrganizationErrror: {
    header: 'Login unsuccessful.',
    content:
      'You have a verified CSC account, but your account does not seem to have a home organization. Please contact the CSC Helpdesk to set a home organization for your CSC account.',
  },
  footer: {
    fairdata: {
      title: 'Fairdata',
      text:
        'The Fairdata services are offered by the <strong>Ministry of Education and Culture</strong> and produced by <strong>CSC – IT Center for Science Ltd.</strong>',
    },
    information: {
      title: 'Information',
      terms: 'Terms and Policies',
      termsUrl: 'https://www.fairdata.fi/en/terms-and-policies/',
      contracts: 'Contracts and Privacy',
      contractsUrl: 'https://www.fairdata.fi/en/contracts-and-privacy/',
    },
    accessibility: {
      title: 'Accessibility',
      statement: 'Accessibility statement',
      statementUrls: {
        fairdata: 'https://www.fairdata.fi/en/accessibility',
        etsin: 'https://www.fairdata.fi/en/etsin-accessibility',
        qvain: 'https://www.fairdata.fi/en/qvain-accessibility',
      },
    },
    contact: {
      title: 'Contact',
    },
    follow: {
      title: 'Follow',
      news: "What's new",
      newsUrl: 'https://www.fairdata.fi/en/news/',
    },
  },
}

export default english
