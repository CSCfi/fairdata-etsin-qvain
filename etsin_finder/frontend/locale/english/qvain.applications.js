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
    approveOrRejectInfo:
      'Approving an application will allow the applying user to access data in the related dataset. ' +
      'If an application is rejected, the user can create a new application to request access again.',
    comment: 'Add comment (shown to applicant)',
    approve: 'Approve',
    reject: 'Reject',
    return: 'Request changes',
    returnInfo: 'Request the user to make changes to their application and submit it again. ',
    close: 'Close application',
    closeInfo:
      'An application can be closed if it is no longer relevant. ' +
      'If the application had been approved, closing the application will also remove the approval.',
  },
}

export default applications
