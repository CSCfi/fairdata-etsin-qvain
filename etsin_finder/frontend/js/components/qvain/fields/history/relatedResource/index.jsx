import React from 'react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import { Field } from '../../../general/section'
import RelatedResourceContent from './relatedResourceContent'

const brief = {
  title: 'qvain.history.relatedResource.title',
  description: 'qvain.history.relatedResource.description',
}

export const RelatedResource = () => (
  <Field brief={brief}>
    <RelatedResourceContent />
  </Field>
)

export default withFieldErrorBoundary(RelatedResource, brief.title)
