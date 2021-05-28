/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import qvain from './qvain'

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
    citation: {
      sidebar: 'Citation / Reference',
      title: 'Cite dataset',
      titleShort: 'Cite',
      buttonTitle: 'Copy Citation/References',
      copyButton: 'Copy',
      copyButtonTooltip: 'Copy to clipboard',
      copyButtonTooltipSuccess: 'Citation copied to clipboard',
      warning:
        'Automatically generated citations may contain errors. Always check the provided citations.',
    },
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
      infoLabel: 'Format information',
      infoText:
        'Datacite without validation: The dataset is shown in Datacite Format but without validation; mandatory fields might be missing. Dataset does not necessarily meet all Datacite requirements.',
      datacite: 'In Datacite datamodel (XML)',
      fairdata_datacite: 'In Datacite datamodel without validation (XML)',
      metax: 'In Metax datamodel (JSON)',
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
      source: 'Source',
      commonSource: 'Go to the original source',
      fileAmount: '%(amount)s objects',
      close_modal: 'Close info modal',
      customMetadata: 'Metadata',
      info_header: 'Other info related to file',
      loading: 'Loading folder',
      loaded: 'Folder loaded',
      errors: {
        serviceUnavailable:
          'The download service is currently unavailable. If the problem persists check our <a href="https://www.fairdata.fi/en/maintenance/">maintenance page</a> for more information.',
        unknownError:
          'There was an error using the download service. If the problem persists check our <a href="https://www.fairdata.fi/en/maintenance/">maintenance page</a> for more information.',
      },
      manualDownload: {
        title: 'Other download options',
        ariaLabel: 'Show other download options',
        description: `Etsin download can be initiated via the following commands.
        Please note that these are <em>only single use</em>, as every download needs to be authorized separately.`,
        error: 'There was an error authorizing download.',
        copyButton: 'Copy',
        copyButtonTooltip: 'Copy to clipboard',
        copyButtonTooltipSuccess: 'Copied to clipboard',
      },
      packages: {
        createForAll: 'Download all',
        create: 'Download',
        pending: 'Generating',
        pendingTooltip:
          'Download package is being generated. When the button turns green the download can be started.',
        loading: 'Loading',
        modal: {
          generate: {
            header: 'Generate download?',
            main: `To begin downloading, a download package needs to be generated by Etsin. For larger
            downloads it may take minutes or even hours. The download button will turn green when
            download can be started.`,
            additional: "You may leave Etsin. It won't interrupt the generation process.",
          },
          pending: {
            header: 'Download generation ongoing',
            main: `Etsin is currently generating a download package.
              For larger downloads it may take minutes or even hours.
              The download button will turn green when download can be started.`,
          },
          success: {
            header: 'Download generated',
            main: 'The package is now ready for download.',
          },
          additionalEmail:
            'If you want to be notified when the download can be started, please enter your email address.',
          emailPlaceholder: 'Email',
          buttons: {
            ok: 'Generate',
            cancel: 'Cancel',
            close: 'Close',
            submitEmail: 'Submit email',
          },
        },
      },
      objectCount: {
        one: '1 object',
        other: '%(count)s objects',
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
    catalog_alt_text: 'Logo for %(title)s, link takes you to catalog publisher website',
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
    validationMessages: {
      email: {
        string: 'The email must be a string value.',
        max: 'The email address is too long.',
        email: 'Please insert a valid email address.',
      },
    },
  },
  error: {
    cscLoginRequired: 'This page requires you to be logged in with a CSC account.',
    notFound:
      'Sorry, we are having some technical difficulties at the moment. Please, try again later.',
    notLoaded: "Sorry! The page couldn't be found.",
    undefined: 'Sorry! An error occured.',
    details: {
      showDetails: 'Show details',
      hideDetails: 'Hide details',
    },
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
  qvain,
}

export default english
