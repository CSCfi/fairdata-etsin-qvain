import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import Form from './Form'
import { useStores } from '@/stores/stores'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import FieldList from '@/components/qvain/general/V2/FieldList'
import { FieldGroup, Title } from '@/components/qvain/general/V2'

export const DaasCatalog = () => {
  const {
    Qvain: {
      DaasResources: { translationsRoot },
    },
  } = useStores()

  return (
    <FieldGroup>
      <Translate component={Title} content={`${translationsRoot}.title`} />
      <FieldList id="daas-catalog-list" fieldName="DaasResources" />
      <FieldListAdd
        id="daas-catalog-list-add"
        fieldName="DaasResources"
        form={{ Form, props: {} }}
        styling={{ contentLabel: `${translationsRoot}.contentLabel` }}
      />
    </FieldGroup>
  )
}

export default observer(DaasCatalog)
