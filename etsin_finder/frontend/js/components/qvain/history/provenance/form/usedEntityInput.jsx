import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { Label } from '../../../general/modal/form'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from '../../relatedResource/handleSave'
import Form from '../../relatedResource/form'
import { useStores } from '../../../utils/stores'

const translationsRoot = 'qvain.history.provenance.modal.usedEntityInput'
const translations = {
  label: `${translationsRoot}.label`,
}

const Location = () => {
  const {
    Qvain: { Provenances: Store },
    Locale: { lang },
  } = useStores()
  const Field = Store.inEdit.usedEntities

  if (!Field) return null

  return (
    <>
      <Translate component={Label} content={translations.label} htmlFor="used-entity-input" />
      <FieldList
        Store={Store}
        Field={Field}
        fieldIdentifier="usedEntities"
        lang={lang}
        translationsRoot={translationsRoot}
        disableNoItemsText
      />
      <div id="used-entity-input">
        <FieldListAdd
          Store={Store}
          Field={Field}
          Form={Form}
          formProps={{ hideRelationType: true }}
          translationsRoot={translationsRoot}
          handleSave={() => handleSave(Field, { noRelationType: true })}
          position="left"
        />
      </div>
    </>
  )
}

export default observer(Location)
