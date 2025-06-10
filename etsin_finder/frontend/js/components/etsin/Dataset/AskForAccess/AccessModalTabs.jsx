import { parseISO } from 'date-fns'

import { Tab, TabRow } from '@/components/general/Tab'
import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const getLabel = (translate, id, val) => {
  if (!val) {
    return translate('dataset.access_modal.createApplication')
  }
  const date = parseISO(val['application/created'])
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${
    val['application/id']
  }`
  return (
    <>
      {translate('dataset.access_modal.application')}
      <pre>{dateStr}</pre>
    </>
  )
}

const AccessModalTabs = () => {
  const {
    Etsin: {
      EtsinDataset: {
        rems: { tabs },
      },
    },
    Locale: { translate },
  } = useStores()

  if (!tabs.options || Object.keys(tabs.options).length === 0) {
    return null
  }

  return (
    <Wrapper>
      <ModalTabRow>
        {Object.entries(tabs.options).map(([id, value]) => (
          <ModalTab key={id} aria-selected={tabs.active === id} onClick={() => tabs.setActive(id)}>
            {getLabel(translate, id, value)}
          </ModalTab>
        ))}
      </ModalTabRow>
    </Wrapper>
  )
}

const ModalTab = styled(Tab)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  flex-wrap: wrap;
  line-height: 1.5;
  column-gap: 0.5rem;
`

const ModalTabRow = styled(TabRow)`
  flex-grow: 1;
  padding-left: 0;
  gap: 0;
`

const Wrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: stretch;
  margin-bottom: 0.5rem;
`

export default observer(AccessModalTabs)
