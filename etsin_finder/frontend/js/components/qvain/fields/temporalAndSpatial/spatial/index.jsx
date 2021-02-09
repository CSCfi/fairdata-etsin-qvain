import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Field from '../../../general/section/field'
import SpatialFieldContent from './SpatialFieldContent'
import { useStores } from '../../../utils/stores'

const brief = {
  title: 'qvain.temporalAndSpatial.spatial.title',
  description: 'qvain.temporalAndSpatial.spatial.description',
}

const Spatial = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()
  return (
    <Field brief={brief}>
      <SpatialFieldContent Store={Store} lang={lang} />
    </Field>
  )
}

export default withFieldErrorBoundary(observer(Spatial), brief.title)
