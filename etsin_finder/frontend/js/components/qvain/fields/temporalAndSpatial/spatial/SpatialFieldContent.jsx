import React from 'react'
import { observer } from 'mobx-react'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'
import { useStores } from '../../../utils/stores'

const SpatialFieldContent = () => {
  const { Qvain: Store } = useStores()

  return (
    <>
      <FieldList Field={Store.Spatials} />
      <FieldListAdd
        Field={Store.Spatials}
        handleSave={() => handleSave(Store.Spatials)}
        Form={Form}
      />
    </>
  )
}

export default observer(SpatialFieldContent)
