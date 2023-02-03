const files = {
  title: 'Files',
  infoTitle: 'Files info',
  infoText: 'Add text',
  deletedLabel: 'Deleted',
  filterRow: {
    filter: 'Filter',
    placeholder: 'Filter items by name',
    noMatches: 'No matching items in folder.',
  },
  error: {
    title: 'Error loading files',
    retry: 'Retry',
    noFiles: 'The project does not have any files.',
  },
  dataCatalog: {
    label: 'File origin',
    infoText: `The Fairdata Services need to know whether you are
    including files from IDA or remote resources.
    You can also publish datasets without any files.
    In that case, please still select the most appropriate option.
    The selection cannot be changed, so if you are not sure whether
    you will add files later, select the option you think you will need in the future.`,
    explanation:
      'Choose "IDA" if the data is stored in Fairdata IDA Service. Choose "Remote resources" if the data is in remote location.',
    doiSelection:
      'I want the published dataset to have a DOI (digital object identifier) instead of a URN.',
    doi: 'DOI',
    placeholder: 'Select option',
    ida: 'IDA',
    att: 'Remote resources',
    pas: 'DPS',
  },
  cumulativeState: {
    label: 'Cumulative dataset',
    radio: {
      no: 'No. (Adding files or folders to a published dataset requires you to create a new version of the dataset.)',
      yes: 'Yes. (New files or folders will be added without a version change.)',
      note: 'Note! Once the dataset has been published, it cannot be turned cumulative without creating a new version of the dataset.',
    },
    enabled: {
      state: 'This dataset has been marked as a cumulative dataset.',
      explanation:
        'It means that data is added to it regularly. If data is no longer being added to this dataset, you should turn it non-cumulative.',
      button: 'Turn non-cumulative',
      note: 'Note! Once changed, you need to create a new version of the dataset to turn it back to cumulative.',
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
    noProject: 'The selected project does not exist or has no files.',
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
    help: 'This will fix the dataset by removing any included files and directories that are no longer available. A new dataset version will be created. The changes will take place immediately.',
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
    help: 'Saving the changes will update the file metadata regardless of whether the file is in your dataset or not.',
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
      show: 'Show Digital Preservation metadata',
      edit: 'Edit Digital Preservation metadata',
      delete: 'Remove Digital Preservation metadata',
      close: 'Close',
      save: 'Save changes',
      hideError: 'Continue editing',
    },
    clear: {
      header: 'Remove Digital Preservation metadata',
      help: 'Are you sure you want to remove Digital Preservation metadata for file %(file)s? The change will take place immediately.',
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
  help: 'Files associated with this dataset. A dataset can only have either IDA files or remote files. File metadata will not be associated with datasets, so remember to save edits to file metadata.',
  ida: {
    title: 'Fairdata IDA files',
    infoText: `When including files from IDA, first select your project in IDA.
    You can then see the project's frozen data.
    Select the files and folders that you want to include to the dataset.
    If you select a folder, note that all files within that folder will be included.
    `,
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
      show: 'Show %(name)s',
      remove: 'Remove %(name)s',
      undoRemove: 'Undo removing %(name)s',
      refresh: 'Refresh %(name)s',
      open: 'Open %(name)s',
      close: 'Close %(name)s',
      select: 'Select %(name)s',
      deselect: 'Deselect %(name)s',
    },
    addUserMetadata: 'Add metadata',
    showUserMetadata: 'Show metadata',
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
      applyUseCategoryToChildren: 'Copy selected Use Category to all files and subfolders',
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
  // extRes V2
  remoteResources: {
    title: 'Remote resources',
    noItems: 'None added',
    modal: {
      title: {
        add: 'Add remote resource',
        edit: 'Edit remote resource',
      },
      buttons: {
        save: 'Add remote resource',
        editSave: 'Apply changes',
        cancel: 'Cancel',
      },
      addButton: 'Add remote resource',
    },
  },
  external: {
    title: 'Remote resources',
    infoText: `Please insert Title, Use Category and URLs for the remote files.
    Qvain does not upload or store remote files, but the URLs will be used to provide active links to the files.
    Access URL = link to the page where the link / license information is. Download URL = direct link to download the file.
    `,
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
        label: 'Add external resource',
      },
      edit: {
        label: 'Update external resource',
      },
      add: {
        label: 'Add',
      },
    },
  },
  sort: {
    label: 'Sort by',
    date: 'Date',
    name: 'Name',
  },
}

export default files
