import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import AccessModal from './AccessModal'
import REMSButton from './REMSButton'

const AskForAccess = () => {
  const {
    Env: { Flags },
    Access: { restrictions },
    Etsin: {
      EtsinDataset: {
        rems: { setShowModal },
      },
    },
  } = useStores()

  const onClick = () => {
    setShowModal(true)
  }

  if (!Flags.flagEnabled('ETSIN.REMS')) {
    return null
  }
  if (!restrictions.showREMSbutton) {
    return null
  }
  return (
    <>
      <REMSButton applicationState={restrictions.applicationState} onClick={onClick} />
      <AccessModal />
    </>
  )
}

export default observer(AskForAccess)
