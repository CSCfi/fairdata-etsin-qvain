// import { observables } from 'mobx'
import uuid from 'uuid/v4'
import Field from './qvain.field'

const RelatedResource = (
  uiid = uuid(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  relationType = undefined,
  entityType = undefined
  ) => ({ uiid, name, description, identifier, relationType, entityType })

class RelatedResources extends Field {
  constructor(Parent) {
    super(Parent, RelatedResource, 'relatedResources')
  }

  toBackend = () =>
    this.Parent.relatedResources.map((rr) => ({
    entity: {
      title: rr.name,
      description: rr.description,
      identifier: rr.identifier || '',
      type: { identifier: rr.entityType.url }
    },
    relation_type: { identifier: rr.relationType.url }
  }))
}

export const RelationType = (label, url) => ({
  label,
  url,
})

export const RelatedResourceModel = (rr) => ({
  uiid: uuid(),
  name: rr.entity.title,
  description: rr.entity.description,
  identifier: rr.entity.identifier,
  relationType: rr.relation_type
    ? RelationType(rr.relation_type.pref_label, rr.relation_type.identifier)
    : undefined,
  entityType: rr.entity
    ? RelationType(rr.entity.type.pref_label, rr.entity.type.identifier)
    : undefined
})

export default RelatedResources
