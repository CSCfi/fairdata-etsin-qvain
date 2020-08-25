import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Field from '../../general/section/field'
import TemporalFieldContent from './temporalFieldContent'

const brief = {
    title: 'qvain.temporalAndSpatial.temporal.title',
    description: 'qvain.temporalAndSpatial.temporal.description',
}

const Temporal = ({ Stores }) => {
  const Store = Stores.Qvain
  const { lang } = Stores.Locale
     return (
       <Field brief={brief}>
         <TemporalFieldContent Store={Store} lang={lang} />
       </Field>
     )
}

Temporal.propTypes = {
  Stores: PropTypes.PropTypes.object.isRequired
}

export default inject('Stores')(observer(Temporal))
