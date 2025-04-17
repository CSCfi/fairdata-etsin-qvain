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
import search from './search'

const english = {
  changepage: 'Navigated to page: %(page)s',
  dataset: {
    additionalInformation: 'Additional information',
    access_modal: {
      title: 'Apply for Data Access',
      terms: 'Terms for Data Access',
      license: 'License',
      accept: 'I agree to',
      acceptTerms: 'the terms for data access and',
      acceptLicense: {
        one: 'the license.',
        other: 'the licenses.',
      },
      submit: 'Submit',
    },
    access_login: 'Login to apply for access',
    access_unavailable: 'Unavailable',
    access_denied: 'Application denied',
    access_draft: 'Application in draft state',
    access_request_sent: 'Access request sent',
    access_granted: 'Access granted',
    access_rights_title: {
      none: '',
      open: 'Open',
      login: 'Requires login in Fairdata service',
      embargo: 'Embargo',
      permit: 'Requires applying permission in Fairdata service',
      restricted: 'Restricted use',
    },
    access_rights_description: {
      none: '',
      open: 'Anyone can access the data.',
      login: 'Users have to log in to access the data.',
      embargo: 'Data can be accessed only after the embargo has expired.',
      permit:
        'Data can be accessed only by applying for permission. You need to be logged in to be able to fill-in the application.',
      restricted: 'Data cannot be accessed.',
      custom: 'Description: ',
    },
    restriction_grounds: 'Restriction grounds: ',
    access_permission: 'Ask for access',
    access_locked: 'Restricted Access',
    access_open: 'Open Access',
    access_rights: 'Access',
    catalog_publisher: 'Catalog publisher',
    citation: {
      sidebar: 'Citation / Reference',
      title: 'Cite dataset',
      titleShort: 'Cite',
      recommended: 'Recommended',
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
      json: 'In Metax datamodel (JSON)',
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
      downloadDisabledForDraft: 'Download is disabled for drafts',
      downloading: 'Downloading...',
      source: 'External source page',
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
        idaUnavailable:
          'Data downloads are temporarily unavailable due to a maintenance break. More information about maintenance breaks: <a href="https://www.fairdata.fi/huoltokatko/">https://www.fairdata.fi/huoltokatko/</a>',
        unknownError:
          'There was an error using the download service. If the problem persists check our <a href="https://www.fairdata.fi/en/maintenance/">maintenance page</a> for more information.',
      },
      manualDownload: {
        title: 'Other download options',
        ariaLabel: 'Show other download options',
        description: `Etsin download can be initiated via the following commands.
        Please note that these are <em>only single use</em>, as every download needs to be authorized separately.
        Commands are valid for 72 hours.`,
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
        tooLarge: 'Download is not available due to large size of the download.',
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
        external: 'Resource information',
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
        external: 'Resource Information',
      },
      item: 'item %(item)s',
      name: 'Name',
      size: 'Size',
      remote: 'Remote resources',
      checksum: 'Checksum (%(insertable)s)',
      id: 'ID',
      accessUrl: 'Access URL',
      downloadUrl: 'Download URL',
      title: 'Title',
      type: 'Type',
      go_to_original: 'Go to original',
      sliced: 'Some files are not displayed in this view due to large amount of files',
      cumulativeDatasetLabel: 'Dataset is growing',
      cumulativeDatasetTooltip: {
        header: 'Growing dataset',
        info: 'This dataset is still growing, be aware of this when you cite it or use it. Temporal coverage should be mentioned. No existing files can, however, be removed or changed.',
      },
    },
    embargo_date: 'Embargo expires',
    events_idn: {
      deleted_versions: {
        title: 'Deleted versions',
        date: 'Delete date',
        version: 'Version',
        link_to_dataset: 'Link to dataset',
      },
      events: {
        title: 'Events',
        event: 'Event type',
        who: 'Who',
        when: 'When',
        where: 'Where',
        event_title: 'Title',
        description: 'Title and Description',
        outcome_description: 'Show outcome description',
        deletionTitle: 'Dataset deletion',
        deletionEvent: 'Deleted',
        deletionOfDatasetVersion: 'Deleted dataset version: ',
        deletionIdentifier: 'Identifier of deleted dataset: ',
      },
      preservationEvent: {
        useCopy: {
          title: 'Copy created into Digital Preservation',
          descriptionDate: 'Copy created: %(date)s.',
          descriptionLink: 'Click here to open the Digital Preservation Service version',
        },
        preservedCopy: {
          title: 'Created in Digital Preservation',
          descriptionDate: 'Created: %(date)s.',
          descriptionLink: 'Click here to open the use copy',
        },
      },
      deprecations: {
        event: 'Deprecated',
        title: 'Data removed',
        description: 'Original data removed from Fairdata IDA',
      },
      other_idn: 'Other identifiers',
      origin_identifier: 'Origin dataset identifier',
      relations: {
        title: 'Relations',
        type: 'Type',
        name: 'Title and Description',
        description: 'Show Description',
        idn: 'Identifier',
      },
      versions: {
        title: 'Versions',
        type: 'Type',
        number: 'Number',
        name: 'Title',
        idn: 'Identifier',
        types: {
          older: 'Older',
          latest: 'Latest',
          newer: 'Newer',
        },
      },
    },
    map: {
      geographic_name: 'Geographical name',
      full_address: 'Full address',
      alt: 'Altitude (m)',
    },
    description: 'Description',
    doi: 'DOI',
    field_of_science: 'Field of Science',
    file_types: 'Data Type',
    funder: 'Funder',
    goBack: 'Go back',
    identifier: 'Identifier',
    catalog_alt_text: 'Logo for %(title)s, link takes you to catalog publisher website',
    infrastructure: 'Infrastructure',
    issued: 'Release date: %(date)s',
    metadata: 'Dataset metadata',
    metrics: {
      title: 'Metrics',
      toolTip: `Views and downloads are recorded as they occur.<br>
        Etsin updates the amounts for an individual dataset once per day.<br>
        <a target="_blank" href="https://www.fairdata.fi/en/dataset-views-and-downloads/">More info</a>`,
      tooltipLabel: 'Metrics information.',
      totalViews: 'Views (total)',
      totalDownloads: 'Downloads (total)',
    },
    modified: 'Dataset modification date: %(date)s',
    keywords: 'Keywords',
    subjectHeading: 'Subject heading',
    license: 'License',
    otherLicense:
      'License information for this dataset is indistinct. Please contact the dataset owner / rights holder for more information.',
    loading: 'Loading dataset',
    harvested: 'Harvested',
    cumulative: 'Cumulative',
    go_to_original: 'Go to original location',
    permanent_link: 'Permanent link to this page',
    project: {
      project_area: 'Projects and Funding',
      project_title: 'Project',
      name: 'Project Name',
      identifier: 'Project Identifier',
      sourceOrg: 'Participating Organizations',
      funding: 'Funding',
      has_funder_identifier: 'Funding Identifier',
      funder: 'Funder Organization',
      funder_plural: 'Funder Organizations',
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
    version: { number: 'Version %(number)s', old: '(Old)', label: 'Dataset version selector' },
    agent: {
      contributor_role: 'Contributor role',
      contributor_type: 'Contributor type',
      member_of: 'Member of',
      parent: 'Is part of',
      homepage: 'Homepage',
    },
    language: 'Language',
    fairdataPas: 'Fairdata DPS',
    storedInPas:
      "This dataset is stored in Fairdata's Digital Preservation Service (data not accessible via Etsin).",
    pasDatasetVersionExists:
      "This is a use copy of this dataset. A copy is also stored in Fairdata's Digital Preservation Service. ",
    originalDatasetVersionExists: 'There is an existing use copy of the dataset. ',
    linkToPasDataset: "Click here to open the Digital preservation Service's version.",
    linkToOriginalDataset: 'Click here to open the use copy.',
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
    notFound: "Sorry! The page couldn't be found.",
    notLoaded:
      'Sorry, we are having some technical difficulties at the moment. Please, try again later.',
    invalidIdentifier: 'Invalid identifier',
    undefined: 'Sorry! An error occurred.',
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
      SRhide: 'hide notice',
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
    titleV3: 'Search datasets',
    count: '(%(count)s total)',
    title: 'Search datasets',
    title1: 'What is Etsin?',
    title2: 'How can I get access to the datasets?',
    para1:
      'Etsin enables you to find research datasets from all fields of science. Etsin contains information about the datasets and metadata in the national Finnish Fairdata services. We also currently harvest information from the Language Bank of Finland, the Finnish Social Science Data archive and the Finnish Environmental Institute, and new sources will be included.',
    para2:
      'The published metadata on the dataset is open to everyone. The data owner decides how and by whom the underlying research data can be accessed. Etsin works independently of actual data storage location and contains no research datasets. Datasets can be described and published through the <a href="https://qvain.fairdata.fi">Qvain service</a>.<br><br>Read more about the Finnish Fairdata services on the <a href="https://fairdata.fi">Fairdata.fi</a> pages.',
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
  },
  nav: {
    login: 'Login',
    logout: 'Logout',
    logoutNotice: 'Logged out. Close browser to also logout from HAKA',
    data: 'Data',
    dataset: 'Dataset',
    datasets: 'Datasets',
    events: 'Identifiers and events',
    maps: 'Maps',
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
  search,
  slogan: 'Research data finder',
  stc: 'Skip to content',
  stsd: 'Skip to submit dataset',
  tombstone: {
    removedInfo: 'The dataset has been removed',
    deprecatedInfo:
      'The dataset has been deprecated. This means that although the metadata of this dataset is still available, the data with which it was originally published does not exist any more.',
    urlToNew: 'A new version of this dataset is available.',
    urlToRelated:
      'A related available dataset has been linked to this dataset with relation type "%(type)s".',
    urlToOtherIdentifier:
      'The dataset has another available persistent identifier in Fairdata Service (%(identifier)s).',
    urlToOld: 'An older (published) version of this dataset is available.',
    linkTextToNew: 'You can open the new version via this link.',
    linkTextToRelated: 'You can open the related dataset via this link.',
    linkTextToOtherIdentifier: 'You can open that dataset via this link.',
    linkTextToOld: 'You can open the version via this link.',
  },
  loginError: {
    header: 'Login unsuccessful',
    missingUserName:
      'Please make sure that you have a valid CSC account. If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with CSC account. Please see more instructions in: https://docs.csc.fi/#accounts/how-to-create-new-user-account/',
    missingOrganization:
      'You have a verified CSC account, but your account does not seem to have a home organization. Please contact the CSC Helpdesk to set a home organization for your CSC account.',
  },
  footer: {
    fairdata: {
      title: 'Fairdata',
      text: 'The Fairdata services are offered by the <strong>Ministry of Education and Culture</strong> and produced by <strong>CSC – IT Center for Science Ltd.</strong>',
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
