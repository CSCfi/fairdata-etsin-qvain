import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Field } from '../../../general/section'
import ProvenanceFieldContent from './ProvenanceFieldContent'

const brief = {
  title: 'qvain.history.provenance.title',
  description: 'qvain.history.provenance.description',
}

const Provenance = ({ Stores }) => {
  const Store = Stores.Qvain
  const { lang } = Stores.Locale
  return (
    <Field brief={brief}>
      <ProvenanceFieldContent Store={Store} lang={lang} />
    </Field>
  )
}

Provenance.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Provenance))
