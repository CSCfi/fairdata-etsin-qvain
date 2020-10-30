import React from 'react'
import { observer } from 'mobx-react'
import FieldList from '../../general/section/fieldList'
import FieldListAdd from '../../general/section/fieldListAdd'
import Form from './form'
import handleSave from './handleSave'
import { useStores } from '../../utils/stores'

const RelatedResourceContent = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()
  const translationsRoot = 'qvain.history.relatedResource'
  const Field = Store.RelatedResources
  return (
    <>
      <FieldList Field={Field} lang={lang} translationsRoot={translationsRoot} />
      <FieldListAdd
        translationsRoot={translationsRoot}
        Store={Store}
        Field={Field}
        Form={Form}
        handleSave={handleSave}
      />
    </>
  )
}

export default observer(RelatedResourceContent)
