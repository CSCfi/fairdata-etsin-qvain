import React from 'react'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import Section from '@/components/qvain/general/V2/Section'
import { useStores } from '@/stores/stores'
import InfrastructureSelection from './InfrastructureSelection'

function Infrastructure() {
  const {
    Qvain: { originalHasInfrastructures },
  } = useStores()

  return originalHasInfrastructures ? <Selection /> : null
}

function Selection() {
  return (
    <Section sectionName="Infrastructure">
      <InfrastructureSelection />
    </Section>
  )
}

export default withFieldErrorBoundary(Infrastructure, 'qvain.infrastructure.title')
