import { makeObservable, action, computed } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

import * as yup from 'yup'
import { RESOURCE_ENTITY_TYPE, RELATION_TYPE } from '@/utils/constants'

import Field from './qvain.field'
import { touch } from './track'

const parseDoiUrl = doi => `https://doi.org/${doi}`

// RELATED RESOURCE
export const relatedResourceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string().typeError('qvain.validationMessages.publications.nameRequired'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.publications.nameRequired')
      .required('qvain.validationMessages.publications.nameRequired'),
  }),
  en: yup.string().typeError('qvain.validationMessages.publications.nameRequired'),
})

export const relatedResourceTypeSchema = yup
  .object()
  .required('qvain.validationMessages.publications.typeRequired')

export const entityTypeSchema = yup
  .object()
  .required('qvain.validationMessages.publications.entityTypeRequired')

export const relatedResourceSchema = yup.object().shape({
  name: relatedResourceNameSchema,
  relationType: relatedResourceTypeSchema,
  entityType: entityTypeSchema,
})

export const RelatedResource = ({
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  relationType = undefined,
  entityType = undefined,
} = {}) => ({ uiid, name, description, identifier, relationType, entityType })

export const Publication = ({
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  relationType = RELATION_TYPE.RELATED_DATASET,
  entityType = RESOURCE_ENTITY_TYPE.PUBLICATION,
} = {}) => ({ uiid, name, description, identifier, relationType, entityType })

class RelatedResources extends Field {
  constructor(Parent) {
    super(Parent, RelatedResource, RelatedResourceModel, 'relatedResources')
    makeObservable(this)
  }

  schema = relatedResourceSchema

  @computed get translationsRoot() {
    return this.Parent.Env.Flags.flagEnabled('QVAIN.EDITOR_V2')
      ? 'qvain.publications'
      : 'qvain.history.relatedResource'
  }

  @action
  prefillInEdit = data => {
    const modifiedData = {
      name: { fi: data.label, en: data.label },
      identifier: parseDoiUrl(data.DOI),
      description: { fi: data.abstract || '', en: data.abstract || '', und: data.abstract || '' },
      entityType: RESOURCE_ENTITY_TYPE.PUBLICATION,
      relationType: RELATION_TYPE.RELATED_DATASET,
    }

    this.create(modifiedData)
  }

  @action
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

  fromBackend = (dataset, Qvain) => {
    if (dataset.relation) {
      dataset.relation.forEach(r => {
        touch(r.entity?.type, r.relation_type)
      })
    }
    this.fromBackendBase(dataset.relation, Qvain)
  }

  @action.bound createPublication() {
    this.setChanged(false)
    this.inEdit = Publication()
  }

  @action.bound createOtherResource() {
    this.create()
    this.inEdit.otherResource = true
  }

  @computed get publications() {
    return this.storage.filter(
      resource => resource.entityType?.url === RESOURCE_ENTITY_TYPE.PUBLICATION.url
    )
  }

  @computed get otherResources() {
    return this.storage.filter(
      resource => resource.entityType?.url !== RESOURCE_ENTITY_TYPE.PUBLICATION.url
    )
  }

  @computed get publicationInEdit() {
    return (
      this.inEdit &&
      !this.inEdit.otherResource &&
      this.inEdit.entityType?.url === RESOURCE_ENTITY_TYPE.PUBLICATION.url
    )
  }

  @computed get otherResourceInEdit() {
    return (
      this.inEdit &&
      (this.inEdit.otherResource ||
        this.inEdit.entityType?.url !== RESOURCE_ENTITY_TYPE.PUBLICATION.url)
    )
  }
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
  const values = {
    fi: prop.fi || '',
    en: prop.en || '',
    und: prop.und || '',
  }
  return values
}

export default RelatedResources
