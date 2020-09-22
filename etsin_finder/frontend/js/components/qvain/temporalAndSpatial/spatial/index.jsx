import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Field from '../../general/section/field'
import SpatialFieldContent from './SpatialFieldContent'

const brief = {
  title: 'qvain.temporalAndSpatial.spatial.title',
  description: 'qvain.temporalAndSpatial.spatial.description',
}

const Spatial = ({ Stores }) => {
  const Store = Stores.Qvain
  const { lang } = Stores.Locale
  return (
    <Field brief={brief}>
      <SpatialFieldContent Store={Store} lang={lang} />
    </Field>
  )
}

Spatial.propTypes = {
  Stores: PropTypes.PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Spatial))
