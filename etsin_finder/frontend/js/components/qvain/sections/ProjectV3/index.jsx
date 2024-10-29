import React from 'react'
import Translate from 'react-translate-component'

import { useStores } from '@/stores/stores'
import Section, { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import { InfoTextLarge } from '@/components/qvain/general/V2'
import List from '@/components/qvain/general/V3/section/List'
import ListAdd from '@/components/qvain/general/V3/section/ListAdd'

const Project = () => {
  const {
    Qvain: { Projects },
  } = useStores()

  return (
    <Section sectionName="Projects">
      <SectionContentWrapper>
        <Translate component={InfoTextLarge} content="qvain.project.infoText" />
        <List model={Projects} />
        <ListAdd model={Projects} />
      </SectionContentWrapper>
    </Section>
  )
}

export default Project
