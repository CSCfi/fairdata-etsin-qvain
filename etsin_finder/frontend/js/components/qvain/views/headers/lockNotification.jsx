import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '../../utils/stores'
import Loader from '../../../general/loader'
import Button from '../../../general/button'

const LockNotification = () => {
  const {
    Qvain: { Lock, original },
  } = useStores()

  if (!Lock.enabled || !original || Lock.haveLock || Lock.isInitialLoad) {
    return null
  }

  const editButton = (
    <EditButton onClick={() => Lock.request({ force: true })}>
      <Translate content="qvain.lock.force" />
      {Lock.isLoadingForced && <Loader active color="white" size="1.1em" spinnerSize="3px" />}
    </EditButton>
  )

  if (Lock.lockUser) {
    return (
      <LockText>
        <Translate content="qvain.lock.unavailable" with={{ user: Lock.lockUser }} />
        {editButton}
      </LockText>
    )
  }

  return (
    <LockText>
      <Translate content="qvain.lock.error" />
      {editButton}
    </LockText>
  )
}

const EditButton = styled(Button)`
  display: inline-flex;
  flex-wrap: no-wrap;
  gap: 0.5em;
  align-items: center;
`

const LockText = styled.div`
  background-color: ${props => props.theme.color.primaryLight};
  text-align: center;
  width: 100%;
  color: ${props => props.theme.color.primaryDark};
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 300px;
  padding: 0.25em;
`

export default observer(LockNotification)
