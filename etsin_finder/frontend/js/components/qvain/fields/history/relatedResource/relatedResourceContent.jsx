import React from 'react'
import { observer } from 'mobx-react'
import ResourcesSearchField from './resourceSearchField'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import Form from './form'
import { useStores } from '../../../utils/stores'
import FlaggedComponent from '../../../../general/flaggedComponent'

const RelatedResourceContent = () => {
  const {
    Qvain: { RelatedResources: Field },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()

  return (
    <>
      <FieldList Field={Field} />
      <FlaggedComponent flag="CROSSREF_API">
        <ResourcesSearchField />
      </FlaggedComponent>
      <FieldListAdd Field={Field} Form={Form} hideButton={flagEnabled('CROSSREF_API')} />
    </>
  )
}

export default observer(RelatedResourceContent)
