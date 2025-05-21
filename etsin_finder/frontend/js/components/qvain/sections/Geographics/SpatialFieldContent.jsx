import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import Form from './Form'
import { InfoTextLarge } from '@/components/qvain/general/V2'

const SpatialFieldContent = () => {
  const {
    Qvain: { Spatials: Field },
  } = useStores()
  return (
    <SectionContentWrapper>
      <Translate component={InfoTextLarge} content={'qvain.geographics.infoText.section'} />
      <FieldList fieldName="Spatials" />
      <FieldListAdd fieldName="Spatials" form={{ Form, props: { Field } }} />
    </SectionContentWrapper>
  )
}

export default observer(SpatialFieldContent)
