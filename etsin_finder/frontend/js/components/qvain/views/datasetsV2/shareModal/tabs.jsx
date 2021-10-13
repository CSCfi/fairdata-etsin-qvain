import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useStores } from '../../../utils/stores'
import { Tab, TabRow } from '../common'

export const Tabs = () => {
  const {
    QvainDatasetsV2: {
      share: { tabs },
    },
  } = useStores()

  return (
    <ModalTabRow>
      {Object.entries(tabs.options).map(([id, label]) => (
        <Translate
          component={ModalTab}
          content={label}
          key={id}
          aria-selected={tabs.active === id}
          onClick={() => tabs.setActive(id)}
        />
      ))}
    </ModalTabRow>
  )
}

const ModalTab = styled(Tab)`
  border-radius: 0;
  border-top: 1px solid ${p => p.theme.color.medgray};
  margin-bottom: -4px;
  flex-basis: 0;
  flex-grow: 1;
`

const ModalTabRow = styled(TabRow)`
  padding-left: 0;
  gap: 0;
`

export default observer(Tabs)
