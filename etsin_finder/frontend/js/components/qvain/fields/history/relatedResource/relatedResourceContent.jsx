import React from 'react'
import { observer } from 'mobx-react'
import ResourcesSearchField from './resourceSearchField'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import Form from './form'
import handleSave from './handleSave'
import { useStores } from '../../../utils/stores'
import FlaggedComponent from '../../../../general/flaggedComponent'

const RelatedResourceContent = () => {
  const {
    Qvain: Store,
    Locale: { lang },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()
  const Field = Store.RelatedResources
  const translationsRoot = Field.translationsRoot
  return (
    <>
      <FieldList Field={Field} lang={lang} translationsRoot={translationsRoot} />
      <FlaggedComponent flag="CROSSREF_API">
        <ResourcesSearchField />
      </FlaggedComponent>
      <FieldListAdd
        translationsRoot={translationsRoot}
        Store={Store}
        Field={Field}
        Form={Form}
        handleSave={handleSave}
        hideButton={flagEnabled('CROSSREF_API')}
      />
    </>
  )
}

export default observer(RelatedResourceContent)
