import React from 'react'
import Translate from 'react-translate-component'

import InfrastructureSelection from './InfrastructureSelection'
import { useStores } from '@/stores/stores'
import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import { Field } from '../../../general/section'

const brief = {
  title: 'qvain.history.infrastructure.title',
  description: 'qvain.history.infrastructure.description',
}

const Infrastructure = () => {
  const {
    Qvain: { originalHasInfrastructures },
  } = useStores()

  // hide infrastructure field if dataset doesn't have existing ones
  if (!originalHasInfrastructures) {
    return null
  }

  return (
    <Field brief={brief} labelFor="infrastructure-select">
      <Translate component="p" content="qvain.history.infrastructure.addingDisabled" />
      <InfrastructureSelection />
    </Field>
  )
}

export default withFieldErrorBoundary(Infrastructure, brief.title)
