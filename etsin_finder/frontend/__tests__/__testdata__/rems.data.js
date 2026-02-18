export const automaticREMSApplicationBase = {
  'application/licenses': [
    {
      'license/id': 4,
      'license/type': 'text',
      'license/title': {
        en: 'Terms for data access',
        fi: 'Käyttöluvan ehdot',
      },
      'license/text': {
        en: 'Terms here',
        fi: 'Käyttöluvan ehdot',
      },
      is_data_access_terms: true,
    },
    {
      'license/id': 1,
      'license/type': 'link',
      'license/title': {
        en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        fi: 'Käyttöluvan ehdot',
      },
      'license/link': {
        en: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        fi: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
      is_data_access_terms: false,
    },
    {
      'license/id': 5,
      'license/type': 'link',
      'license/title': {
        en: 'License name',
        fi: 'Lisenssin nimi',
      },
      'license/link': {
        en: 'https://license.url',
        fi: 'https://license.url',
      },
      is_data_access_terms: false,
    },
  ],
  forms: [],
}

export const approvedApplication = {
  'application/workflow': {
    'workflow/id': 24,
    'workflow/type': 'workflow/decider',
    'workflow.dynamic/handlers': [
      {
        userid: 'approver-bot',
        name: 'Approver Bot',
        email: null,
      },
      {
        userid: 'handler',
        name: 'Hannah Handler',
        email: 'handler@example.com',
      },
    ],
  },
  'application/external-id': '2025/17',
  'application/first-submitted': '2025-03-05T14:43:35.064Z',
  'application/blacklist': [],
  'application/id': 123,
  'application/applicant': {
    userid: 'elsa',
    name: 'Elsa Roleless',
    email: 'elsa@example.com',
  },
  'application/todo': 'new-application',
  'application/members': [],
  'application/resources': [
    {
      'catalogue-item/end': null,
      'catalogue-item/expired': false,
      'catalogue-item/enabled': true,
      'resource/id': 23,
      'catalogue-item/title': {
        fi: 'Joku aineisto 3',
        en: 'Some dataset 3',
      },
      'catalogue-item/infourl': {},
      'resource/ext-id': 'urn:nbn:fi:jotain',
      'catalogue-item/start': '2025-03-05T14:42:02.792Z',
      'catalogue-item/archived': false,
      'catalogue-item/id': 29,
    },
  ],
  'application/accepted-licenses': {
    elsa: [4, 1, 5],
  },
  'application/forms': [],
  'application/invited-members': [],
  'application/description': '',
  'application/generated-external-id': '2025/17',
  'application/permissions': [
    'application.command/invite-member',
    'application.command/request-review',
    'see-everything',
    'application.command/redact-attachments',
    'application.command/invite-reviewer',
    'application.command/change-applicant',
    'application.command/add-licenses',
    'application.command/remove-member',
    'application.command/request-decision',
    'application.command/uninvite-member',
    'application.command/remark',
    'application.command/add-member',
    'application.command/return',
    'application.command/assign-external-id',
    'application.command/close',
    'application.command/change-resources',
  ],
  'application/last-activity': '2025-03-05T14:43:35.064Z',
  'application/events': [
    {
      'application/external-id': '2025/17',
      'event/actor-attributes': {
        userid: 'elsa',
        name: 'Elsa Roleless',
        email: 'elsa@example.com',
      },
      'application/id': 28,
      'event/time': '2025-03-05T14:42:35.126Z',
      'workflow/type': 'workflow/decider',
      'application/resources': [
        {
          'resource/ext-id': 'urn:nbn:fi:jotain',
          'catalogue-item/id': 29,
        },
      ],
      'application/forms': [
        {
          'form/id': 49,
        },
      ],
      'event/visibility': 'visibility/public',
      'workflow/id': 24,
      'event/actor': 'elsa',
      'event/type': 'application.event/created',
      'event/id': 114,
      'application/licenses': [
        {
          'license/id': 8,
        },
      ],
    },
    {
      'event/id': 115,
      'event/type': 'application.event/licenses-accepted',
      'event/time': '2025-03-05T14:42:43.203Z',
      'event/actor': 'elsa',
      'application/id': 28,
      'event/actor-attributes': {
        userid: 'elsa',
        name: 'Elsa Roleless',
        email: 'elsa@example.com',
      },
      'application/accepted-licenses': [8],
      'event/visibility': 'visibility/public',
    },
    {
      'event/actor-attributes': {
        userid: 'elsa',
        name: 'Elsa Roleless',
        email: 'elsa@example.com',
      },
      'application/id': 28,
      'event/time': '2025-03-05T14:43:35.039Z',
      'application/field-values': [
        {
          value: 'jeejee toimiihan tämä',
          field: 'testi1',
          form: 49,
        },
      ],
      'event/visibility': 'visibility/public',
      'event/actor': 'elsa',
      'event/type': 'application.event/draft-saved',
      'event/id': 116,
      'application/duo-codes': [],
    },
    {
      'event/id': 117,
      'event/type': 'application.event/submitted',
      'event/time': '2025-03-05T14:43:35.064Z',
      'event/actor': 'elsa',
      'application/id': 28,
      'event/actor-attributes': {
        userid: 'elsa',
        name: 'Elsa Roleless',
        email: 'elsa@example.com',
      },
      'event/visibility': 'visibility/public',
    },
  ],
  'application/roles': ['handler'],
  'application/attachments': [],
  'application/licenses': [
    {
      'license/id': 4,
      'license/type': 'text',
      'license/title': {
        en: 'Terms for data access',
        fi: 'Käyttöluvan ehdot',
      },
      'license/text': {
        en: 'Terms here',
        fi: 'Käyttöluvan ehdot',
      },
    },
    {
      'license/id': 1,
      'license/type': 'link',
      'license/title': {
        en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        fi: 'Käyttöluvan ehdot',
      },
      'license/link': {
        en: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        fi: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
    },
    {
      'license/id': 5,
      'license/type': 'link',
      'license/title': {
        en: 'License name',
        fi: 'Lisenssin nimi',
      },
      'license/link': {
        en: 'https://license.url',
        fi: 'https://license.url',
      },
    },
  ],
  'application/created': '2025-03-05T14:42:35.126Z',
  'application/state': 'application.state/submitted',
  'application/modified': '2025-03-05T14:43:35.039Z',
}

// REMS application with form
export const manualREMSApplicationBase = {
  'application/licenses': [
    {
      'license/id': 4,
      'license/type': 'text',
      'license/title': {
        en: 'Terms for data access',
        fi: 'Käyttöluvan ehdot',
      },
      'license/text': {
        en: 'Terms here',
        fi: 'Käyttöluvan ehdot',
      },
      is_data_access_terms: true,
    },
    {
      'license/id': 1,
      'license/type': 'link',
      'license/title': {
        en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        fi: 'Käyttöluvan ehdot',
      },
      'license/link': {
        en: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        fi: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
      is_data_access_terms: false,
    },
  ],
  'application/forms': [
    {
      'form/internal-name': 'Data access request form',
      'form/fields': [
        {
          'field/title': {
            fi: 'Projektin kuvaus',
            en: 'Description of your research project',
          },
          'field/type': 'text',
          'field/id': 'project_description',
          'field/max-length': null,
          'field/optional': false,
        },
        {
          'field/title': {
            fi: 'Toimenpiteet luvattoman pääsyn estämiseksi pyydettyyn dataan',
            en: 'Procedures to prevent unauthorized access to the requested data',
          },
          'field/type': 'text',
          'field/id': 'access_control',
          'field/max-length': null,
          'field/optional': true,
        },
        {
          'field/title': {
            fi: 'Muut henkilöt joiden oletetaan saavan pääsyn dataan',
            en: 'Other persons presumed to get access to the requested data',
          },
          'field/type': 'text',
          'field/id': 'other_persons',
          'field/max-length': null,
          'field/optional': true,
        },
      ],
      'form/title': 'Data access request form',
      organization: {
        'organization/id': 'csc',
        'organization/short-name': {
          fi: 'CSC',
          en: 'CSC',
        },
        'organization/name': {
          fi: 'CSC – TIETEEN TIETOTEKNIIKAN KESKUS OY',
          en: 'CSC – IT CENTER FOR SCIENCE LTD.',
        },
      },
      'form/errors': null,
      'form/id': 12,
      'form/external-title': {
        fi: 'Datan lupahakemus',
        en: 'Data access request form',
      },
    },
  ],
}

// Application list does not have licenses
const applicationCopy = { ...approvedApplication }
delete applicationCopy['application/licenses']

const applicationTemplate = {
  'application/workflow': {
    'workflow/id': 1,
    'workflow/type': 'workflow/default',
  },
  'application/blacklist': [],
  'application/applicant': {
    userid: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
  },
  'workflow.dynamic/handlers': [
    {
      userid: 'rejecter-bot',
      name: 'Rejecter Bot',
      email: null,
    },
    {
      userid: 'owner',
      name: 'Owner',
      email: 'owner@example.com',
      'handler/active?': true,
    },
    {
      userid: 'fd_manual',
      name: '',
      email: '',
    },
    {
      userid: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      'handler/active?': true,
    },
  ],
  'application/todo': null,
  'application/members': [],
  'application/resources': [
    {
      'catalogue-item/end': null,
      'catalogue-item/expired': false,
      'catalogue-item/enabled': true,
      'resource/id': 14,
      'catalogue-item/title': {
        en: 'REMS Dataset manual',
      },
      'catalogue-item/infourl': {
        en: 'https://etsin.fairdata.fi/dataset/4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0',
      },
      'resource/ext-id': 'metax:4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0',
      'catalogue-item/start': '2026-02-02T10:41:04.080Z',
      'catalogue-item/archived': false,
      'catalogue-item/id': 21,
    },
  ],
  'application/accepted-licenses': {
    testuser: [1, 2],
  },
  'application/forms': [
    {
      'form/id': 13,
      'form/title': 'Data access request form',
      'form/internal-name': 'Data access request form',
      'form/external-title': {
        fi: 'Datan lupahakemus',
        en: 'Data access request form',
      },
      'form/fields': [
        {
          'field/private': false,
          'field/title': {
            fi: 'Tutkimusprojektin kuvaus',
            en: 'Description of your research project',
          },
          'field/visible': true,
          'field/type': 'text',
          'field/value': 'projekti',
          'field/id': 'project_description',
          'field/max-length': null,
          'field/optional': false,
        },
        {
          'field/private': false,
          'field/title': {
            fi: 'Menettelyt luvattoman pääsyn estämiseksi pyydettyihin tietoihin',
            en: 'Procedures to prevent unauthorized access to the requested data',
          },
          'field/visible': true,
          'field/type': 'text',
          'field/value': 'procedures',
          'field/id': 'access_control',
          'field/max-length': null,
          'field/optional': true,
        },
        {
          'field/private': false,
          'field/title': {
            fi: 'Muut henkilöt joiden oletetaan saavan pääsyn pyydettyihin tietoihin',
            en: 'Other persons presumed to get access to the requested data',
          },
          'field/visible': true,
          'field/type': 'text',
          'field/value': 'persons',
          'field/id': 'other_persons',
          'field/max-length': null,
          'field/optional': true,
        },
      ],
    },
  ],
  'application/licenses': [
    {
      'license/type': 'link',
      'license/link': {
        fi: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        en: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
      'license/title': {
        fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
        en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      },
      'license/id': 1,
      'license/enabled': true,
      'license/archived': false,
      is_data_access_terms: false,
    },
    {
      'license/text': {
        en: 'access policy',
      },
      'license/type': 'text',
      'license/title': {
        en: 'Terms for data access',
        fi: 'Datan luvituksen käyttöehdot',
      },
      'license/id': 2,
      'license/enabled': true,
      'license/archived': false,
      is_data_access_terms: true,
    },
  ],

  'application/events': [
    {
      'application/external-id': '2026/42',
      'event/actor-attributes': {
        userid: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
      },
      'application/id': 53,
      'event/time': '2026-02-11T07:44:11.420Z',
      'workflow/type': 'workflow/default',
      'application/resources': [
        {
          'resource/ext-id': 'metax-dev-jori:fd3b75f2-06f8-4276-8e8e-f8934b34cd60',
          'catalogue-item/id': 26,
        },
      ],
      'application/forms': [
        {
          'form/id': 13,
        },
      ],
      'event/visibility': 'visibility/public',
      'workflow/id': 12,
      'event/actor': 'testuser',

      'event/id': 201,
      'application/licenses': [
        {
          'license/id': 9,
        },
        {
          'license/id': 12,
        },
      ],
    },
    {
      'event/id': 202,

      'event/time': '2026-02-11T07:44:11.452Z',
      'event/actor': 'testuser',
      'application/id': 53,
      'event/actor-attributes': {
        userid: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
      },
      'application/field-values': [
        {
          value: 'projekti',
          field: 'project_description',
          form: 13,
        },
        {
          value: 'procedures',
          field: 'access_control',
          form: 13,
        },
        {
          value: 'persons',
          field: 'other_persons',
          form: 13,
        },
      ],
      'event/visibility': 'visibility/public',
    },
    {
      'event/id': 203,

      'event/time': '2026-02-11T07:44:11.476Z',
      'event/actor': 'testuser',
      'application/id': 53,
      'event/actor-attributes': {
        userid: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
      },
      'application/accepted-licenses': [12, 9],
      'event/visibility': 'visibility/public',
    },
    {
      'event/id': 204,

      'event/time': '2026-02-11T07:44:11.491Z',
      'event/actor': 'testuser',
      'application/id': 53,
      'event/actor-attributes': {
        userid: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
      },
      'event/visibility': 'visibility/public',
    },
    {
      'event/actor-attributes': {
        userid: 'owner',
        name: 'Owner',
        email: 'owner@example.com',
      },
      'application/id': 53,
      'event/time': '2026-02-11T07:44:11.509Z',
      'application/comment': 'Instructions for reviewers: approver instructions',
      'event/visibility': 'visibility/handling-users',
      'event/public': false,
      'event/actor': 'owner',

      'event/id': 205,
    },
  ],
  'application/invited-members': [],
  'application/description': '',
  'application/permissions': [
    'application.command/copy-as-new',
    'application.command/invite-member',
    'application.command/submit',
    'application.command/remove-member',
    'application.command/accept-licenses',
    'application.command/uninvite-member',
    'application.command/delete',
    'application.command/save-draft',
    'application.command/change-resources',
  ],
  'application/last-activity': '2026-02-02T10:41:26.602Z',
  'application/attachments': [],
  'application/created': '2026-02-02T10:41:26.602Z',
  'application/state': 'application.state/submitted',
  'application/modified': '2026-02-02T10:41:26.602Z',
}

const eventTemplate = {
  'event/id': 0,
  'event/type': 'application.event/sometype',
  'event/time': '2026-02-11T07:44:11.491Z',
  'event/actor': 'testuser',
  'application/id': 0,
  'event/actor-attributes': {
    userid: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
  },
  'event/visibility': 'visibility/public',
}

export class ApplicationBuilder {
  seq = 0
  eventSeq = 0
  applications = []
  applicationsById = {}

  constructor() {
    this.handleGet = this.handleGet.bind(this)
    this.handlePost = this.handlePost.bind(this)
  }

  build({ roles = ['handler'], state = 'application.state/submitted' } = {}) {
    this.seq += 1
    const id = this.seq
    const extId = `2026/${id}`
    let application = JSON.parse(JSON.stringify(applicationTemplate))

    const eventProps = [
      {
        'event/type': 'application.event/created',
      },
      {
        'event/type': 'application.event/draft-saved',
      },
      {
        'event/type': 'application.event/licenses-accepted',
      },
      {
        'event/type': 'application.event/submitted',
      },
      {
        'event/type': 'application.event/remarked',
        'event/actor-attributes': {
          userid: 'owner',
          name: 'Owner',
          email: 'owner@example.com',
        },
        'application/comment': 'Instructions for reviewers: approver instructions',
        'event/visibility': 'visibility/handling-users',
        'event/public': false,
        'event/actor': 'owner',
      },
    ]
    const events = []
    for (const event of eventProps) {
      this.eventSeq += 1
      const now = new Date()
      events.push({
        ...eventTemplate,
        ...event,
        'event/id': this.eventSeq,
        'application/id': id,
        'event/time': now.toISOString(),
      })
    }

    application = {
      ...application,
      'application/id': id,
      'application/external-id': extId,
      'application/generated-external-id': extId,
      'application/roles': roles,
      'application/state': state,
    }

    this.applications.push(application)
    this.applicationsById[id] = application
    return application
  }

  re = {
    applications: new RegExp('https://metaxv3:443/v3/rems/applications/(?<id>[\\d]+)'),
    approve: new RegExp('https://metaxv3:443/v3/rems/applications/(?<id>[\\d]+)/approve'),
    reject: new RegExp('https://metaxv3:443/v3/rems/applications/(?<id>[\\d]+)/reject'),
    close: new RegExp('https://metaxv3:443/v3/rems/applications/(?<id>[\\d]+)/close'),
    return: new RegExp('https://metaxv3:443/v3/rems/applications/(?<id>[\\d]+)/return'),
  }

  handleGet(request) {
    const match = this.re.applications.exec(request.url)
    if (match) {
      const application = this.applicationsById[match.groups.id]
      if (application) {
        return [200, application]
      } else {
        return [404, 'not found!']
      }
    }

    if (request.url == 'https://metaxv3:443/v3/rems/applications/') {
      return [200, this.applications]
    }
    if (request.url == 'https://metaxv3:443/v3/rems/applications?roles=handler') {
      return [200, this.applications.filter(a => a['application/roles'].includes('handler'))]
    }

    return [200, []]
  }

  handlePost(request) {
    let application, action
    for (const a of ['approve', 'reject', 'close', 'return']) {
      const match = this.re[a].exec(request.url)
      if (match) {
        application = this.applicationsById[match.groups.id]
        action = a
        if (!application) {
          return [400, 'not found!']
        }
        break
      }
    }

    if (action === 'approve') {
      application['application/state'] = 'application.state/approved'
      return [200, { success: true }]
    } else if (action === 'reject') {
      application['application/state'] = 'application.state/rejected'
      return [200, { success: true }]
    } else if (action === 'close') {
      application['application/state'] = 'application.state/closed'
      return [200, { success: true }]
    } else if (action === 'return') {
      application['application/state'] = 'application.state/returned'
      return [200, { success: true }]
    }
    return [500, 'fail']
  }

  register(mockAdapter) {
    mockAdapter.onGet(RegExp('^https://metaxv3:443/v3/rems/applications.*')).reply(this.handleGet)
    mockAdapter.onPost(RegExp('^https://metaxv3:443/v3/rems/applications.*')).reply(this.handlePost)
  }
}

export const approvedApplicationList = [applicationCopy]
