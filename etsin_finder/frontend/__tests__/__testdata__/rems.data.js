export const remsApplicationBase = {
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

// Application list does not have licenses
const applicationCopy = { ...approvedApplication }
delete applicationCopy['application/licenses']
export const approvedApplicationList = [applicationCopy]
