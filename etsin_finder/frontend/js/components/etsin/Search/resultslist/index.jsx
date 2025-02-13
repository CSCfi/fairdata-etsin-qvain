import React from 'react'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'

import ListItem from './listItem'

const ResultsList = () => {
  const {
    Etsin: {
      Search: { results },
    },
  } = useStores()

  const renderList = () => results?.map(single => <ListItem key={single.id} item={single} />)
  return (
    <div>
      {renderList()}
    </div>
  )
}

export default observer(ResultsList)
