import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import FieldList from '../../general/fieldList'
import FieldListAdd from '../../general/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'

const translationsRoot = 'qvain.temporalAndSpatial.spatial'

const SpatialFieldContent = ({ Store, lang }) => (
  <>
    <FieldList
      Field={Store.Spatials}
      lang={lang}
      elements={Store.spatials}
      translationsRoot={translationsRoot}
    />
    <FieldListAdd
      Store={Store}
      Field={Store.Spatials}
      translationsRoot={translationsRoot}
      handleSave={() => handleSave(Store.Spatials, translationsRoot)}
      Form={Form}
    />
  </>
)

SpatialFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default observer(SpatialFieldContent)
