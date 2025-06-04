import { observer } from 'mobx-react'
import { useEffect } from 'react'

import Modal from '@/components/general/modal'
import { useStores } from '@/utils/stores'
import AccessModalContent from './AccessModalContent'

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxWidth: '800px',
    minWidth: '60vw',
  },
}

const AccessModal = () => {
  const {
    Etsin: {
      EtsinDataset: {
        dataset,
        rems: { setShowModal, showModal, fetchApplicationData },
      },
    },
  } = useStores()

  useEffect(() => {
    if (dataset && showModal) {
      fetchApplicationData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, showModal])

  if (!dataset) {
    return null
  }

  return (
    <Modal
      isOpen={showModal}
      customStyles={customStyles}
      contentLabel="Citation Modal"
      onRequestClose={() => setShowModal(false)}
    >
      <AccessModalContent />
    </Modal>
  )
}

AccessModal.propTypes = {}

export default observer(AccessModal)
