import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { Label } from '../../../general/modal/form'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from '../../../temporalAndSpatial/spatial/handleSave'
import Form from '../../../temporalAndSpatial/spatial/form'
import { useStores } from '../../../utils/stores'

const translationsRoot = 'qvain.history.provenance.modal.locationInput'
const translations = {
  label: `${translationsRoot}.label`,
}

const Location = () => {
  const {
    Qvain: { Provenances: Store },
    Locale: { lang },
  } = useStores()
  const Field = Store.inEdit.spatials

  if (!Field) return null

  return (
    <>
      <Translate component={Label} content={translations.label} htmlFor="location-input" />
      <FieldList
        Store={Store}
        Field={Field}
        fieldIdentifier="spatials"
        lang={lang}
        translationsRoot={translationsRoot}
        disableNoItemsText
      />
      <FieldListAdd
        Store={Store}
        Field={Field}
        Form={Form}
        translationsRoot={translationsRoot}
        handleSave={() => handleSave(Field, translationsRoot)}
        position="left"
        hideButton={!!Field.storage.length}
      />
    </>
  )
}

export default observer(Location)
