import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'
import { useStores } from '../../../utils/stores'

const translationsRoot = 'qvain.temporalAndSpatial.spatial'

const SpatialFieldContent = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()

  return (
    <>
      <FieldList Field={Store.Spatials} lang={lang} translationsRoot={translationsRoot} />
      <FieldListAdd
        Store={Store}
        Field={Store.Spatials}
        translationsRoot={translationsRoot}
        handleSave={() => handleSave(Store.Spatials, translationsRoot)}
        Form={Form}
      />
    </>
  )
}

export default observer(SpatialFieldContent)
