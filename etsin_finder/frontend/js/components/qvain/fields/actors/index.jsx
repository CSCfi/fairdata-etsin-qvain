import React from 'react'

import ActorsInfoTooltip from './actorsInfoTooltip'
import ActorModal from './modal'
import { Section } from '../../general/section'
import ActorsField from './field'

export const translations = {
  title: 'qvain.actors.title',
  tooltip: 'qvain.actors.infoTitle',
}

export const ActorsBase = () => {
  const components = {
    tooltipContent: ActorsInfoTooltip,
  }

  return (
    <Section translations={translations} components={components} isRequired>
      <ActorModal />
      <ActorsField />
    </Section>
  )
}

export default ActorsBase
