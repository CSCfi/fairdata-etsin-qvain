import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'

import ModalInstance from './ModalInstance.v3'

const ModalManager = () => {
  const {
    Qvain: {
      Modals: { modals },
    },
  } = useStores()

  return modals.map(modal => <ModalInstance key={modal.itemId} modal={modal} />)
}

export default observer(ModalManager)
