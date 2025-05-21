import { observer } from 'mobx-react'
import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'

import { useStores } from '@/stores/stores'

const FunderTypeSelect = () => {
  const {
    Qvain: { ProjectV2: Field },
  } = useStores()
  return (
    <ModalReferenceInput
      Field={Field}
      inputId="project-fundertype-select"
      datum="funderType"
      model={Field.FunderTypeModel}
      metaxIdentifier="funder_type"
      translationsRoot="qvain.projectV2"
      isClearable={false}
    />
  )
}

export default observer(FunderTypeSelect)
