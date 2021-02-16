import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Field from '../../../general/section/field'
import TemporalFieldContent from './temporalFieldContent'
import { useStores } from '../../../utils/stores'

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

export default withFieldErrorBoundary(observer(Temporal), brief.title)
