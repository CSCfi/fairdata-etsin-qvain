import actors from './qvain.actors'
import datasets from './qvain.datasets'
import description from './qvain.description'
import files from './qvain.files'
import general from './qvain.general'
import history from './qvain.history'
import home from './qvain.home'
import nav from './qvain.nav'
import project from './qvain.project'
import rightsAndLicenses from './qvain.rightsAndLicenses'
import temporalAndSpatial from './qvain.temporalAndSpatial'
import validationMessages from './qvain.validationMessages'

const qvainEnglish = {
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
    render: 'There was an error displaying the dataset',
    component: 'There was an error rendering %(field)s',
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
  },
  actors,
  datasets,
  description,
  files,
  general,
  history,
  home,
  nav,
  project,
  rightsAndLicenses,
  temporalAndSpatial,
  validationMessages,
}

export default qvainEnglish
