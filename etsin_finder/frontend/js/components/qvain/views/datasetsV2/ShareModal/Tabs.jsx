import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { useStores } from '../../../utils/stores'
import { Tab, TabRow } from '../common'

export const Tabs = () => {
  const {
    QvainDatasets: {
      share: { tabs, getTabItemCount },
    },
  } = useStores()

  return (
    <ModalTabRow>
      {Object.entries(tabs.options).map(([id, label]) => (
        <ModalTab
          key={id}
          aria-selected={tabs.active === id}
          onClick={() => tabs.setActive(id)}
          className={`tab-${id}`}
        >
          <Translate content={label} />
          <ItemCount {...getTabItemCount(id)} />
        </ModalTab>
      ))}
    </ModalTabRow>
  )
}

const ItemCount = ({ count }) => {
  if (!count) {
    return null
  }
  return <StyledItemCount>({count})</StyledItemCount>
}

ItemCount.propTypes = {
  count: PropTypes.number,
}

ItemCount.defaultProps = {
  count: undefined,
}

const StyledItemCount = styled.span`
  margin-left: 0.5rem;
`

const ModalTab = styled(Tab)`
  border-radius: 0;
  margin-bottom: -4px;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalTabRow = styled(TabRow)`
  padding-left: 0;
  gap: 0;
`

export default observer(Tabs)
