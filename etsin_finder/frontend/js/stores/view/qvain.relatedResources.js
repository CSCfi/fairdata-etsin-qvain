// import { observables } from 'mobx'
import uuid from 'uuid/v4'
import Field from './qvain.field'

const RelatedResource = (
  uiid = uuid(),
  name = { fi: '', en: '', und: '' },
  description = { fi: undefined, en: undefined },
  identifier = undefined,
  relationType = undefined
  ) => ({ uiid, name, description, identifier, relationType })

class RelatedResources extends Field {
  constructor(Parent) {
    super(Parent, RelatedResource, 'relatedResources')
  }
}

export const RelationType = (label, url) => ({
  label,
  url,
})

export default RelatedResources
