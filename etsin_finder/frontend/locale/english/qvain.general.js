const general = {
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
}

export default general
