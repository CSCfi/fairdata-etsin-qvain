import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { Title, FieldGroup } from '@/components/qvain/general/V2'
import FieldList from '@/components/qvain/general/V2/ModalFieldList'
import FieldListAdd from '@/components/qvain/general/V2/ModalFieldListAdd'
import Form from '@/components/qvain/sections/Geographics/Form'

const LocationInput = () => {
  const {
    Qvain: { Provenances: Store, readonly },
  } = useStores()
  const Field = Store.inEdit.locations
  if (!Field) return null
  const root = Field.translationsRoot

  return (
    <FieldGroup>
      <Translate component={Title} content={`${root}.label`} htmlFor="location-input" />
      <FieldList
        storage={Field.storage}
        edit={Field.edit}
        remove={Field.remove}
        translationsRoot={root}
        readonly={readonly}
        disableNoItemsText
        nameGetter={Field.getItemLabel}
      />
      <FieldListAdd
        Field={Field}
        fieldName="Location"
        form={{ Form, props: { Field } }}
        isOpen={!!Field.inEdit}
        translationsRoot={root}
        position="left"
        hideButton={!!Field.storage.length}
      />
    </FieldGroup>
  )
}

export default observer(LocationInput)
