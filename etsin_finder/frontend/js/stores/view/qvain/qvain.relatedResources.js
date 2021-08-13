import { makeObservable, observable, action } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

import * as yup from 'yup'

import Field from './qvain.field'
import { touch } from './track'

const parseDoiUrl = doi => `https://doi.org/${doi}`

// RELATED RESOURCE
export const relatedResourceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string().typeError('qvain.validationMessages.history.relatedResource.nameRequired'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.history.relatedResource.nameRequired')
      .required('qvain.validationMessages.history.relatedResource.nameRequired'),
  }),
  en: yup.string().typeError('qvain.validationMessages.history.relatedResource.nameRequired'),
})

export const relatedResourceTypeSchema = yup
  .object()
  .required('qvain.validationMessages.history.relatedResource.typeRequired')

export const RelatedResource = ({
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  identifier = undefined,
  relationType = undefined,
  entityType = undefined,
} = {}) => ({ uiid, name, description, identifier, relationType, entityType })

class RelatedResources extends Field {
  constructor(Parent) {
    super(Parent, RelatedResource, RelatedResourceModel, 'relatedResources')
    makeObservable(this)
  }

  nameSchema = relatedResourceNameSchema

  typeSchema = relatedResourceTypeSchema

  @observable translationsRoot = 'qvain.history.relatedResource'

  @action
  prefillInEdit = data => {
    const modifiedData = {
      name: { fi: data.label, en: data.label },
      identifier: parseDoiUrl(data.DOI),
      description: { fi: data.abstract || '', en: data.abstract || '', und: data.abstract || '' },
      entityType: {
        label: { fi: 'Julkaisu', en: 'Publication', und: 'Julkaisu' },
        url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/publication',
      },
      relationType: {
        label: { fi: 'Liittyvä aineisto', en: 'Related dataset', und: 'Liittyvä aineisto' },
        url: 'http://purl.org/dc/terms/relation',
      },
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
