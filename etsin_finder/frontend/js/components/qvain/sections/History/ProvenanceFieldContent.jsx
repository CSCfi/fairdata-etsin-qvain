import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import { useStores } from '@/stores/stores'
import Form from './Form'
import { InfoTextLarge } from '../../general/V2'

const ProvenanceFieldContent = () => {
  const {
    Qvain: { Provenances: Field },
    Locale: { lang },
  } = useStores()

  return (
    <SectionContentWrapper>
      <Translate component={InfoTextLarge} content="qvain.historyV2.infoText" />
      <FieldList fieldName="Provenances" lang={lang} />
      <FieldListAdd fieldName="Provenances" form={{ Form, props: { Field } }} />
    </SectionContentWrapper>
  )
}

export default observer(ProvenanceFieldContent)
