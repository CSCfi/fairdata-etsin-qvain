import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import Form from './Form'
import { useStores } from '@/stores/stores'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import FieldList from '@/components/qvain/general/V2/FieldList'
import { FieldGroup, Title } from '@/components/qvain/general/V2'

export const ExternalResources = () => {
  const {
    Qvain: {
      ExternalResources: { translationsRoot },
    },
  } = useStores()

  return (
    <FieldGroup>
      <Translate component={Title} content={`${translationsRoot}.title`} />
      <FieldList id="att-catalog-list" fieldName="ExternalResources" />
      <FieldListAdd
        id="att-catalog-list-add"
        fieldName="ExternalResources"
        form={{ Form, props: {} }}
        styling={{ contentLabel: `${translationsRoot}.contentLabel` }}
      />
    </FieldGroup>
  )
}

export default observer(ExternalResources)
