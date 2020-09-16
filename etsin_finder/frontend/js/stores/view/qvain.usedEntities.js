// import { observables } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import Field from './qvain.field'

const UsedEntity = (
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  entityType = undefined
) => ({ uiid, name, description, identifier, entityType })

class UsedEntities extends Field {
  constructor(Qvain, usedEntities = []) {
    super(UsedEntity, UsedEntityModel, 'usedEntities', Qvain.readonly)
    this.Qvain = Qvain
    this.fromBackend(usedEntities, Qvain)
  }

  clone = () => this

  usedEntityToBackend = ue => ({
    title: ue.name,
    description: ue.description,
    identifier: ue.identifier || '',
    type: ue.entityType ? { identifier: (ue.entityType.url || {}).url } : undefined,
  })

  toBackend = () => this.storage.map(this.usedEntityToBackend)
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
  if (prop.fi === undefined) prop.fi = ''
  if (prop.en === undefined) prop.en = ''
  if (prop.und === undefined) prop.und = ''
  return prop
}

export default UsedEntities
