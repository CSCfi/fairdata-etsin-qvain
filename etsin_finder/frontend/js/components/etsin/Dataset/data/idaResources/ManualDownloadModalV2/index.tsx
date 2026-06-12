import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import type Packages from '@/stores/view/packages'

import Modal from '@/components/general/modal'
import Content from './Content'

const ManualDownloadModal = ({ Packages }: { Packages: Packages }) => (
  <Modal
    isOpen={!!Packages.manualDownloadUrlGetter}
    contentLabel="confirm-package-creation"
    customStyles={modalStyle}
    onRequestClose={Packages.closeManualDownloadModal}
  >
    <Translate component={Title} content="dataset.dl.manualDownload.title" />
    <Scroll>
      <Content Packages={Packages} />
    </Scroll>
  </Modal>
)

ManualDownloadModal.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const Title = styled.h1`
  text-align: center;
  padding-bottom: 0.25em;
  border-bottom: 2px solid ${p => p.theme.color.lightgray};
  margin-bottom: 0.25em;
  margin-top: -0.5em;
`

const Scroll = styled.div`
  overflow: auto;
  max-width: 100%;
`

const modalStyle = {
  content: {
    width: '700px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    paddingRight: '1rem',
  },
}

export default observer(ManualDownloadModal)
