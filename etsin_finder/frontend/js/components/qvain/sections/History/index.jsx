import { observer } from 'mobx-react'

import SectionV2 from '@/components/qvain/general/V2/Section'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import ProvenanceFieldContent from './ProvenanceFieldContent'

const brief = {
  title: 'qvain.sections.history.title',
}

const Provenance = () => (
  <SectionV2 sectionName="History">
    <ProvenanceFieldContent />
  </SectionV2>
)

export default withFieldErrorBoundary(observer(Provenance), brief.title)
