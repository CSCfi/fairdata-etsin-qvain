import { observer } from 'mobx-react'

import Section from '@/components/qvain/general/V2/Section'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import TemporalFieldContent from './TemporalFieldContent'

export const brief = {
  title: 'qvain.timePeriod.title',
}

const TimePeriod = () => (
  <Section sectionName="TimePeriod">
    <TemporalFieldContent />
  </Section>
)

export default withFieldErrorBoundary(observer(TimePeriod), brief.title)
