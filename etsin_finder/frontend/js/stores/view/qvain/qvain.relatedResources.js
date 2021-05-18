import { makeObservable } from 'mobx'
// import { observables } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import Field from './qvain.field'

export const RelatedResource = (
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  relationType = undefined,
  entityType = undefined
) => ({ uiid, name, description, identifier, relationType, entityType })

class RelatedResources extends Field {
  constructor(Parent) {
    super(Parent, RelatedResource, RelatedResourceModel, 'relatedResources')
    makeObservable(this)
  }

  relatedResourceToBackend = rr => ({
    entity: {
      title: rr.name,
      description: rr.description,
      identifier: rr.identifier || '',
      type: rr.entityType ? { identifier: rr.entityType.url } : undefined,
    },
    relation_type: { identifier: (rr.relationType || {}).url },
  })

  toBackend = () => this.storage.map(this.relatedResourceToBackend)

  fromBackend = (dataset, Qvain) => this.fromBackendBase(dataset.relation, Qvain)
}

export const RelatedResourceModel = rr => ({
  uiid: uuidv4(),
  name: fillUndefinedMultiLangProp(rr.entity.title),
  description: fillUndefinedMultiLangProp(rr.entity.description),
  identifier: rr.entity.identifier,
  relationType: rr.relation_type
    ? RelationType(rr.relation_type.pref_label, rr.relation_type.identifier)
    : undefined,
  entityType:
    rr.entity && rr.entity.type
      ? RelationType(rr.entity.type.pref_label, rr.entity.type.identifier)
      : undefined,
})

export const RelationType = (label, url) => ({
  label,
  url,
})

export const fillUndefinedMultiLangProp = (prop = {}) => {
  if (prop.fi === undefined) prop.fi = ''
  if (prop.en === undefined) prop.en = ''
  if (prop.und === undefined) prop.und = ''
  return prop
}

export default RelatedResources
