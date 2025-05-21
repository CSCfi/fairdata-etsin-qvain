import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import Modal from '@/components/general/modal'
import Content from './content'

const ManualDownloadModal = ({ Packages }) => (
  <Modal
    isOpen={!!Packages.manualDownloadUrlGetter}
    contentLabel="confirm-package-creation"
    customStyles={modalStyle}
    onRequestClose={Packages.closeManualDownloadModal}
  >
    <Translate component={Title} content="dataset.dl.manualDownload.title" />
    <Content Packages={Packages} />
  </Modal>
)

ManualDownloadModal.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const Title = styled.h1`
  text-align: center;
  padding-bottom: 0.5em;
  border-bottom: 2px solid ${p => p.theme.color.lightgray};
  margin-bottom: 0.5em;
`

const modalStyle = {
  content: {
    width: '700px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
  },
}

export default observer(ManualDownloadModal)
