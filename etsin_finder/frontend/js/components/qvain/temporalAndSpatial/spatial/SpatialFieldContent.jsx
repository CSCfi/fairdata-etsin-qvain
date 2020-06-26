import React from 'react'
import PropTypes from 'prop-types'
import FieldList from '../../general/fieldList'
import FieldListAdd from '../../general/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'

const translationsRoot = 'qvain.temporalAndSpatial.spatial'

const SpatialFieldContent = ({ Store, lang }) => (
  <>
    <FieldList Store={Store} Field={Store.Spatials} fieldIdentifier="spatials" lang={lang} />
    <FieldListAdd
      Store={Store}
      Field={Store.Spatials}
      translationsRoot={translationsRoot}
      handleSave={handleSave}
      Form={Form}
    />
  </>
)

SpatialFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
}

export default SpatialFieldContent
