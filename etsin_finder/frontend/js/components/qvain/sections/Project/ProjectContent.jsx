import React from 'react'
import Translate from '@/utils/Translate'

import { InfoTextLarge } from '@/components/qvain/general/V2'
import { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import { useStores } from '@/stores/stores'

import Form from './Form'

const ProjectContent = () => {
  const {
    Qvain: { ProjectV2: Field },
  } = useStores()
  return (
    <SectionContentWrapper>
      <Translate component={InfoTextLarge} content="qvain.projectV2.infoText" />
      <FieldList fieldName="ProjectV2" />
      <FieldListAdd fieldName="ProjectV2" form={{ Form, props: { Field } }} />
    </SectionContentWrapper>
  )
}

export default ProjectContent
