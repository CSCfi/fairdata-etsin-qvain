import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import Modal from '@/components/general/modal'
import { useStores } from '@/utils/stores'
import AccessModalTabs from './AccessModalTabs'
import NewREMSApplication from './NewREMSApplication'
import REMSApplication from './REMSApplication'

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible', // allow REMS state tooltip to be partially outside the modal
    maxWidth: '800px',
    minWidth: '60vw',
    minHeight: '70vh',
  },
}

const AccessModal = () => {
  const {
    Etsin: {
      EtsinDataset: {
        dataset,
        rems: { setShowModal, showModal, fetchApplicationBase, fetchApplications, tabs },
      },
      fetchDataset,
    },
  } = useStores()

  const prevShowModal = useRef()

  useEffect(() => {
    // Fetch applications + application template when modal is opened
    if (dataset && showModal) {
      fetchApplicationBase()
      fetchApplications()
    }
  }, [dataset, showModal, fetchApplicationBase, fetchApplications])

  useEffect(() => {
    // When access modal is closed, reload dataset in the background to update permissions
    if (prevShowModal.current && !showModal && dataset?.id) {
      fetchDataset(dataset.id)
    }
    prevShowModal.current = showModal
  }, [showModal, fetchDataset, dataset?.id])

  if (!dataset) {
    return null
  }

  const application = tabs.activeValue
  return (
    <Modal
      isOpen={showModal}
      customStyles={customStyles}
      contentLabel="Citation Modal"
      onRequestClose={() => setShowModal(false)}
    >
      <AccessModalTabs />
      {application ? (
        <REMSApplication application={application} key={application['application/id']} />
      ) : (
        <NewREMSApplication />
      )}
    </Modal>
  )
}

AccessModal.propTypes = {}

export default observer(AccessModal)
