import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import Section from '@/components/qvain/general/V2/Section'
import SpatialFieldContent from './SpatialFieldContent'

const brief = {
  title: 'qvain.sections.geographics.title',
  description: 'qvain.sections.geographics.description',
}

const Spatial = () => (
  <Section sectionName="Geographics">
    <SpatialFieldContent />
  </Section>
)

export default withFieldErrorBoundary(Spatial, brief.title)
