import ErrorBoundary from '@/components/general/errorBoundary'
import Modal from '@/components/general/modal'
import { useStores } from '@/stores/stores'
import ApplicationModalContent from './ApplicationModalContent'

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible', // allow REMS state tooltip to be partially outside the modal
    maxWidth: '90vw',
    minWidth: '70vw',
    minHeight: '90vh',
    maxHeight: '90vh',
  },
}

const ApplicationModal = () => {
  const {
    Qvain: {
      REMSApplications: { setSelectedApplication },
    },
  } = useStores()
  return (
    <Modal
      isOpen
      customStyles={customStyles}
      onRequestClose={() => setSelectedApplication(null)}
      contentLabel="Application detail"
    >
      <ErrorBoundary>
        <ApplicationModalContent />
      </ErrorBoundary>
    </Modal>
  )
}

export default ApplicationModal
