import { makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import Field from './qvain.field'
import { relatedResourceNameSchema } from './qvain.relatedResources'
import { touch } from './track'

export const UsedEntityTemplate = (
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  entityType = undefined
) => ({ uiid, name, description, identifier, entityType })

class UsedEntities extends Field {
  constructor(Qvain, entities = []) {
    super(Qvain, UsedEntityTemplate, UsedEntityModel, 'usedEntities')
    makeObservable(this)

    this.fromBackend({ used_entity: entities }, Qvain)
  }

  clone = () => this

  usedEntityToBackend = ue => ({
    title: ue.name,
    description: ue.description,
    identifier: ue.identifier || '',
    type: ue.entityType ? { identifier: (ue.entityType || {}).url } : undefined,
  })

  toBackend = () => this.storage.map(this.usedEntityToBackend)

  fromBackend = (data, Qvain) => {
    if (data.used_entity !== undefined) {
      data.used_entity.forEach(element => {
        touch(element.type)
      })
    }
    return this.fromBackendBase(data.used_entity, Qvain)
  }

  nameSchema = relatedResourceNameSchema
}

export const UsedEntityModel = ue => ({
  uiid: uuidv4(),
  name: fillUndefinedMultiLangProp(ue.title),
  description: fillUndefinedMultiLangProp(ue.description),
  identifier: ue.identifier,
  entityType: ue.type ? EntityType(ue.type.pref_label, ue.type.identifier) : undefined,
})

export const EntityType = (label, url) => ({
  label,
  url,
})

export const fillUndefinedMultiLangProp = (prop = {}) => {
  const values = {
    fi: prop.fi || '',
    en: prop.en || '',
    und: prop.und || '',
  }
  return values
}

export default UsedEntities
