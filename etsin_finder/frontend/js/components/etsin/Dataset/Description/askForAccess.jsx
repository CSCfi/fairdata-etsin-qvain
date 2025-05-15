import { observer } from 'mobx-react'
import React from 'react'

import { useStores } from '@/stores/stores'
import AccessModal from './AccessModal'
import REMSButton from './REMSButton'

const AskForAccess = () => {
  const {
    Env: { Flags, applicationState },
    Access,
    Etsin: {
      EtsinDataset: { setShowAccessModal },
    },
  } = useStores()

  const onClick = () => {
    setShowAccessModal(true)
  }

  if (!Flags.flagEnabled('ETSIN.REMS')) {
    return null
  }
  if (!Access.restrictions.showREMSbutton) {
    return null
  }
  return (
    <>
      <REMSButton applicationState={applicationState} onClick={onClick} />
      <AccessModal />
    </>
  )
}

export default observer(AskForAccess)
