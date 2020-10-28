import React from 'react'
import { observer } from 'mobx-react'
import Field from '../../general/section/field'
import TemporalFieldContent from './temporalFieldContent'
import { useStores } from '../../utils/stores'

const brief = {
  title: 'qvain.temporalAndSpatial.temporal.title',
  description: 'qvain.temporalAndSpatial.temporal.description',
}

const Temporal = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()
  return (
    <Field brief={brief}>
      <TemporalFieldContent Store={Store} lang={lang} />
    </Field>
  )
}

export default observer(Temporal)
