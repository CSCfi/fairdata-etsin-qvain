import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { useStores } from '@/stores/stores'
import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import Form from './Form'
import { InfoTextLarge } from '@/components/qvain/general/V2'

const SpatialFieldContent = () => {
  const {
    Qvain: { Spatials: Field },
  } = useStores()
  return (
    <>
      <Translate component={InfoTextLarge} content={'qvain.geographics.infoText.section'} />
      <FieldList fieldName="Spatials" />
      <FieldListAdd fieldName="Spatials" form={{ Form, props: { Field } }} />
    </>
  )
}

export default observer(SpatialFieldContent)
