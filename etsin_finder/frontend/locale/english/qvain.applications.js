// Qvain REMS applications handling
const applications = {
  notFound: 'No matching applications for data access found.',
  table: {
    application: 'Application',
    dataset: 'Dataset',
    applicant: 'Applicant',
    status: 'Status',
    view: 'View',
  },
  filters: {
    title: 'Filter applications:',
    all: 'All',
    todo: 'Waiting for review',
    handled: 'Handled',
  },
  modal: {
    application: 'Application',
    applicant: 'Applicant',
    dataset: 'Data access application for dataset',
    all: 'All',
    todo: 'Waiting for review',
    handled: 'Handled',
    tabs: {
      details: 'Details',
      events: 'Events',
    },
    terms: 'Accepted terms and licenses',
    instructions: 'Instructions',
    comment: 'Comment',
  },
  actions: {
    title: 'Actions',
    approveOrReject: 'Approve or reject',
    approveOrRejectLong: 'Approve or reject application',
    comment: 'Add comment (shown to applicant)',
    approve: 'Approve',
    reject: 'Reject',
    close: 'Close application',
  },
}

export default applications
