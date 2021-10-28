import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { Label } from '../../../../general/modal/form'
import FieldList from '../../../../general/section/fieldList'
import FieldListAdd from '../../../../general/section/fieldListAdd'
import Form from '../../relatedResource/form'
import { useStores } from '../../../../utils/stores'

const UsedEntity = () => {
  const {
    Qvain: { Provenances: Store },
    Locale: { lang },
  } = useStores()
  const Field = Store.inEdit.usedEntities

  if (!Field) return null

  return (
    <>
      <Translate
        component={Label}
        content={`${Field.translationsRoot}.label`}
        htmlFor="used-entity-input"
      />
      <FieldList Store={Store} Field={Field} lang={lang} disableNoItemsText />
      <div id="used-entity-input">
        <FieldListAdd
          Store={Store}
          Field={Field}
          Form={Form}
          formProps={{ hideRelationType: true }}
          position="left"
        />
      </div>
    </>
  )
}

export default observer(UsedEntity)
