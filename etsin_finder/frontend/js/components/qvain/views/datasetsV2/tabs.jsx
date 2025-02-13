import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '../../utils/stores'
import { Tab, TabRow } from './common'

export const Tabs = () => {
  const {
    QvainDatasets: { tabs },
  } = useStores()

  return (
    <TabRow>
      {Object.entries(tabs.options).map(([id, label]) => (
        <Translate
          component={Tab}
          content={label}
          key={id}
          aria-selected={tabs.active === id}
          onClick={() => tabs.setActive(id)}
        />
      ))}
    </TabRow>
  )
}

export default observer(Tabs)
