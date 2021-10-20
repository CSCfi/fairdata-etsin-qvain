const datasets = {
  title: 'Your datasets',
  search: {
    hidden: 'Search',
    searchTitle: 'Search from the list (to filter the datasets)',
    placeholder: 'Filter datasets by name',
  },
  help: 'Choose a dataset to edit or create a new dataset',
  createButton: 'Create a new dataset',
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
    share: 'Share',
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
    share: 'Share',
    createNewVersion: 'Create new version',
    useAsTemplate: 'Use as template',
    revert: 'Revert changes',
    delete: 'Delete',
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
  noDatasets: 'You have no datasets',
  reload: 'Reload',
  loading: 'Loading...',
  errorOccurred: 'An error occurred',
  tableHeader: 'Created datasets',
  tabs: {
    all: 'All datasets',
  },
  share: {
    title: 'Share with people',
    tabs: {
      invite: 'Invite',
      members: 'Members',
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
    },
    members: {
      roles: {
        owner: 'Owner',
        editor: 'Editor',
      },
      remove: 'Remove',
      labels: {
        permissions: 'Members',
        projectMembers: 'Project members',
      },
    },
  },
  previousVersions: {
    label: 'Previous versions',
    show: 'Show previous versions',
    hide: 'Hide previous versions',
  },
}
export default datasets
