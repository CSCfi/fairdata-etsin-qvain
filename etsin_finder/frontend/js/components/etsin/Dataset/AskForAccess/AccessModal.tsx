import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'

import Modal from '@/components/general/modal'
import { useStores } from '@/utils/stores'
import AccessModalTabs from './AccessModalTabs'
import NewREMSApplication from './NewREMSApplication'
import REMSApplication from './REMSApplication'
import ErrorBoundary from '@/components/general/errorBoundary'
import styled from 'styled-components'

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
    Locale: { translate },
    Etsin: {
      EtsinDataset: {
        dataset,
        rems: {
          setShowModal,
          showModal,
          fetchApplicationBase,
          fetchApplications,
          tabs,
          applicationsError,
        },
      },
      fetchData,
    },
  } = useStores()

  const prevShowModal = useRef<boolean>()

  useEffect(() => {
    // Fetch applications + application template when modal is opened
    if (dataset && showModal) {
      fetchApplicationBase()
      fetchApplications()
    }
  }, [dataset, showModal, fetchApplicationBase, fetchApplications])

  useEffect(() => {
    // When access modal is closed, reload dataset to update permissions
    if (prevShowModal.current && !showModal && dataset?.id) {
      fetchData(dataset.id)
    }
    prevShowModal.current = showModal
  }, [showModal, fetchData, dataset?.id])

  if (!dataset) {
    return null
  }

  const application = tabs.activeValue

  let content
  if (applicationsError) {
    content = <ErrorDiv>{translate('dataset.access_modal.loadingFailed')}</ErrorDiv>
  } else if (application) {
    content = <REMSApplication application={application} key={application['application/id']} />
  } else {
    content = <NewREMSApplication />
  }
  return (
    <Modal
      isOpen={showModal}
      customStyles={customStyles}
      contentLabel="Etsin REMS Application Modal"
      onRequestClose={() => setShowModal(false)}
    >
      <ErrorBoundary>
        <AccessModalTabs />
        {content}
      </ErrorBoundary>
    </Modal>
  )
}

AccessModal.propTypes = {}

const ErrorDiv = styled.div`
  display: flex;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25em;
  color: white;
  background: ${p => p.theme.color.error};
`

export default observer(AccessModal)
