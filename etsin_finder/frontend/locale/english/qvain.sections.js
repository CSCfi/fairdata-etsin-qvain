const sections = {
  dataOrigin: {
    title: 'Data Origin',
    buttons: {
      ida: {
        title: 'Ida',
        description: 'Choose "Ida" if the data is stored in Fairdata IDA service',
      },
      att: {
        title: 'Remote resources',
        description: 'Choose "Remote Resources" if the data is in remote location',
      },
      pas: {
        inProcess: {
          title: 'Digital preservation',
          description: 'Dataset is in process to be stored in Digital Preservation Service',
        },
        done: {
          title: 'In digital preservation',
          description: 'Dataset is stored in Digital Preservation Service',
        },
      },
    },
  },
  description: {
    title: 'Description',
  },
  actors: {
    title: 'Actors',
  },
  publications: {
    title: 'Related publications and other material',
  },
  geographics: {
    title: 'Geographical area',
  },
  timePeriod: {
    title: 'Time period',
  },
  infrastructure: {
    title: 'Infrastructure',
  },
  history: {
    title: 'History and events (provenance)',
  },
  projectV2: {
    title: 'Project and funding',
  },
}

export default sections
