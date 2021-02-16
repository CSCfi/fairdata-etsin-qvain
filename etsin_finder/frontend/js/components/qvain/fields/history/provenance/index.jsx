import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import { Field } from '../../../general/section'
import ProvenanceFieldContent from './ProvenanceFieldContent'
import { useStores } from '../../../utils/stores'

const brief = {
  title: 'qvain.history.provenance.title',
  description: 'qvain.history.provenance.description',
}

const Provenance = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()
  return (
    <Field brief={brief}>
      <ProvenanceFieldContent Store={Store} lang={lang} />
    </Field>
  )
}

export default withFieldErrorBoundary(observer(Provenance), brief.title)
