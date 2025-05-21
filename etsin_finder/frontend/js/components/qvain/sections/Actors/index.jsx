import Section from '@/components/qvain/general/V2/Section'
import ActorsInfoTooltip from './ActorsInfoTooltip'
import ActorModal from './Modal'
import ActorsField from './Field'

export const translations = {
  title: 'qvain.actors.title',
  tooltip: 'qvain.actors.infoTitle',
}

export const ActorsBase = () => {
  const components = {
    tooltipContent: ActorsInfoTooltip,
  }

  return (
    <Section sectionName="Actors" components={components}>
      <ActorModal />
      <ActorsField />
    </Section>
  )
}

export default ActorsBase
