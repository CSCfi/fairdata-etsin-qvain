import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import { Field } from '../../../general/section'
import ProvenanceFieldContent from './ProvenanceFieldContent'

const brief = {
  title: 'qvain.history.provenance.title',
  description: 'qvain.history.provenance.description',
}

const Provenance = () => (
  <Field brief={brief}>
    <ProvenanceFieldContent />
  </Field>
)

export default withFieldErrorBoundary(observer(Provenance), brief.title)
