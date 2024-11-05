const project = {
  noItems: 'No projects have been added.',
  infoText: 'A project in which the dataset was created.',
  modal: {
    title: {
      add: 'Add project',
      edit: 'Edit project',
    },
    addButton: 'Add project',
    buttons: {
      save: 'Add project',
      editSave: 'Apply changes',
      cancel: 'Cancel',
    },
    section: {
      title: {
        funding: 'Funding',
        project: 'Project details',
      },
    },
  },
  fields: {
    title: {
      en: {
        label: 'Project name (in English)',
        infoText: 'Name of the project in English',
      },
      fi: {
        label: 'Project name (in Finnish)',
        infoText: 'Name of the project in Finnish',
      },
    },
    project_identifier: {
      label: 'Project identifier',
      infoText:
        'Add project identifier. It is recommended to use persistent identifiers, if available',
    },
    participating_organizations: {
      title: 'Participating organizations',
      infoText: 'Organizations that have participated in the project',
      noItems: 'No organizations added',
      buttons: {
        save: 'Add organization',
      },
      organization: {
        infoText: 'Organization',
      },
      department: {
        infoText: 'Department',
      },
      subdepartment: {
        infoText: 'Subdepartment',
      },
    },
    funding: {
      funder: {
        title: 'Funder',
      },
      fields: {
        funding_identifier: {
          label: 'Funding identifier',
          infoText:
            'Unique funding  (decision) identifier. It is recommended to use persistent identifiers, if available.',
        },
        funder: {
          fields: {
            funder_type: {
              label: 'Funding type',
              infoText: 'Project funding type',
            },
            organization: {
              label: 'Funder organization',
              infoText: 'Organization that funds the project',
              organization: {
                infoText: 'Organization',
              },
              department: {
                infoText: 'Department',
              },
              subdepartment: {
                infoText: 'Subdepartment',
              },
            },
          },
        },
      },
    },
  },
  inputs: {
    organization: {
      levels: {
        organization: 'Organization',
        department: 'Department',
        subdepartment: 'Subdepartment',
      },
    },
  },
}

export default project
