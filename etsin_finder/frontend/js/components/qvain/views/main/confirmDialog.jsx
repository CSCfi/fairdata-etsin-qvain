import PropTypes from 'prop-types'
import { ConfirmDialog } from '../../general/modal/confirmClose'
import Modal from '../../../general/modal'

const ConfirmModal = props => {
  if (!props.show) return null

  return (
    <Modal isOpen contentLabel="Warning" customStyles={modalStyle}>
      <ConfirmDialog {...props} />
    </Modal>
  )
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
}

const modalStyle = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minHeight: '65vh',
    maxHeight: '95vh',
    minWidth: '300px',
    maxWidth: '600px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}

export default ConfirmModal
