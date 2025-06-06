const datasets = {
  title: 'Your datasets',
  search: {
    hidden: 'Search',
    label: 'Search',
    searchTitle: 'Search from the list (to filter the datasets)',
    placeholder: 'Filter datasets by name',
    searchTitleShort: 'Search datasets',
  },
  sort: {
    label: 'Sort by:',
    title: 'Title',
    status: 'Status',
    owner: 'Owner',
    dateCreated: 'Date',
  },
  help: 'Choose a dataset to edit or create a new dataset',
  createButton: 'Describe a dataset',
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
    edit: 'Edit',
    share: 'Add editors',
    preview: 'Preview',
    owner: 'Owner',
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
  owner: {
    me: 'Me',
    project: 'Project',
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
  actions: {
    edit: 'Edit',
    editDraft: 'Edit draft',
    goToEtsin: 'View in Etsin',
    goToEtsinDraft: 'Preview in Etsin',
    share: 'Add editors',
    createNewVersion: 'Create new version',
    useAsTemplate: 'Use as template',
    revert: 'Revert changes',
    delete: 'Delete',
  },
  shortActions: {
    edit: 'Edit',
    editDraft: 'Edit',
    goToEtsin: 'Preview',
    goToEtsinDraft: 'Preview',
    share: 'Editors',
  },
  remove: {
    confirm: {
      published: {
        text: 'Are you sure you want to delete this dataset? Deleting the dataset will remove it from Qvain, and Etsin Search cannot find it anymore. Landing page for the dataset will NOT be removed.',
        ok: 'Delete',
      },
      draft: {
        text: 'Are you sure you want to delete this draft? The draft will be removed permanently.',
        ok: 'Delete',
      },
      changes: {
        text: 'Are you sure you want to revert all unpublished changes made to this dataset?',
        ok: 'Revert',
      },
      cancel: 'Cancel',
    },
  },
  openNewVersion: 'Open new version',
  noDatasets: 'You have no datasets.',
  noMatchingDatasets: 'No matching datasets found.',
  reload: 'Reload',
  loading: 'Loading...',
  errorOccurred: 'An error occurred',
  tableHeader: 'Created datasets',
  tabs: {
    all: 'All datasets',
  },
  share: {
    title: 'Share metadata editing rights',
    tabs: {
      invite: 'Invite',
      members: 'Members',
    },
    errors: {
      loadingPermissions: 'Error retrieving data. Please try again.',
    },
    invite: {
      users: {
        label: 'Users',
        placeholder: 'Add users',
        help: 'Type to search users by name, username or email.',
        empty: 'No matching users found.',
        searchError: 'There was an error searching for users.',
        searching: 'Loading...',
      },
      roles: {
        editor: 'as Editor',
      },
      message: {
        label: 'Message',
        placeholder: 'Type here to send a message with the invite.',
      },
      button: 'Invite',
      confirm: {
        warning: 'You have an unsent invitation. Do you want to discard the invitation?',
        confirm: 'Yes, discard invitation',
        cancel: 'No, continue editing',
      },
      results: {
        success: 'Successfully shared editing rights with',
        fail: 'There was an error sharing editing rights with',
        close: 'Close',
      },
    },
    members: {
      roles: {
        owner: 'Owner',
        creator: 'Creator',
        editor: 'Editor',
      },
      remove: 'Remove',
      labels: {
        permissions: 'Members',
        projectMembers: 'Project members',
      },
      updateError: 'There was an error updating user permissions. Please try again.',
      projectHelp:
        'Project members are automatically granted editing rights. Project members can be changed via My CSC.',
      projectHelpLabel: 'Info',
    },
    remove: {
      warning: 'You are about to remove editing rights from user %(user)s. Are you sure?',
      loseAccessWarning:
        'You will no longer be able to edit the dataset after this action. Please check to confirm.',
      confirm: 'Remove',
      cancel: 'Cancel',
    },
  },
  previousVersions: {
    label: 'Previous versions',
    show: 'Show previous versions',
    hide: 'Hide previous versions',
  },
}
export default datasets
