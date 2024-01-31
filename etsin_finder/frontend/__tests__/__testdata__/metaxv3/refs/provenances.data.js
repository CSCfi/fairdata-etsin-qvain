import { spatial_a } from './spatials.data'

export const lifecycle_event_a = {
  id: '51779aac-ea09-436b-a8e7-0419066c1cd1',
  url: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event/code/destroyed',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event',
  pref_label: { en: 'Destroyed', fi: 'Tuhottu' },
}

export const event_outcome_a = {
  id: '509ee605-7a85-4d09-98e9-f4c96efae4e8',
  url: 'http://uri.suomi.fi/codelist/fairdata/event_outcome/code/success',
  in_scheme: 'http://uri.suomi.fi/codelist/fairdata/event_outcome',
  pref_label: { en: 'Success', fi: 'Onnistunut', sv: 'Framgångsrik' },
}

export const provenance_a = {
  id: 2,
  title: { en: 'This thing happened' },
  description: { en: 'And it was great' },
  spatial: spatial_a,
  lifecycle_event: lifecycle_event_a,
  event_outcome: event_outcome_a,
  outcome_description: { en: 'Destruction complete' },
  is_associated_with: [],
}
