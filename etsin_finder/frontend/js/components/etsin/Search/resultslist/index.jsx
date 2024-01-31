import React from 'react'
import { observer } from 'mobx-react'

import Loader from '@/components/general/loader'
import { useStores } from '@/stores/stores'

import ListItem from './listItem'

const ResultsList = () => {
  const {
    ElasticQuery,
    Etsin: {
      Search: { results },
    },
  } = useStores()

  const renderList = () => results?.map(single => <ListItem key={single.id} item={single} />)

  return (
    <div>
      <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
      {renderList()}
    </div>
  )
}

export default observer(ResultsList)
