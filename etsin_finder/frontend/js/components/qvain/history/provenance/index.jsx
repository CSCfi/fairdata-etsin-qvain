import React from 'react'
import { Field } from '../../general/section'
import ProvenanceFieldContent from './ProvenanceFieldContent'

const brief = {
    title: 'qvain.history.provenance.title',
    description: 'qvain.history.provenance.description'
}

const Provenance = () => (
  <Field brief={brief}>
    <ProvenanceFieldContent />
  </Field>
    )

export default Provenance
