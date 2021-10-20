import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { useStores } from '../../../utils/stores'
import { Tab, TabRow } from '../common'
import Loader from '../../../../general/loader'

export const Tabs = () => {
  const {
    QvainDatasetsV2: {
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

const ItemCount = ({ count, loading }) => {
  if (count === undefined) {
    return null
  }
  if (loading) {
    return (
      <LoaderWrapper>
        <Loader active size="12pt" spinnerSize="0.15em" />
      </LoaderWrapper>
    )
  }
  return <StyledItemCount>({count})</StyledItemCount>
}

ItemCount.propTypes = {
  count: PropTypes.number,
  loading: PropTypes.bool,
}

ItemCount.defaultProps = {
  count: undefined,
  loading: false,
}

const StyledItemCount = styled.span`
  margin-left: 0.5rem;
`

const LoaderWrapper = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
`

const ModalTab = styled(Tab)`
  border-radius: 0;
  border-top: 1px solid ${p => p.theme.color.medgray};
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
