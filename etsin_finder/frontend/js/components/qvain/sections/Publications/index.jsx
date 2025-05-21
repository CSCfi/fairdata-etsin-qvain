import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import Section from '@/components/qvain/general/V2/Section'
import RelatedResourceContent from './RelatedResourceContent'

const brief = {
  title: 'qvain.publications.title',
  description: 'qvain.publications.description',
}

export const RelatedResource = () => (
  <Section sectionName="Publications">
    <RelatedResourceContent />
  </Section>
)

export default withFieldErrorBoundary(RelatedResource, brief.title)
