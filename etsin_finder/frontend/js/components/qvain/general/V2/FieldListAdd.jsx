import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import Modal from '@/components/general/modal'
import Button from '@/components/general/button'
import ModalContent from '@/components/qvain/general/V2/ModalContent'
import { useStores } from '@/stores/stores'
import { modalStyle } from './index'
import withCustomProps from '@/utils/withCustomProps'

const FieldListAdd = ({ fieldName, form, styling: { contentLabel, position, hideButton } }) => {
  const [confirm, setConfirm] = useState(false)
  const {
    Qvain: {
      [fieldName]: { translationsRoot, clearInEdit, hasChanged, create, inEdit, readonly },
    },
  } = useStores()

  const Field = useStores().Qvain[fieldName]

  const onConfirm = () => {
    setConfirm(false)
    clearInEdit()
  }

  const requestClose = () => {
    if (hasChanged) setConfirm(true)
    else onConfirm()
  }

  const onConfirmCancel = () => {
    setConfirm(false)
  }

  const modalControls = {
    confirm,
    requestClose,
    onConfirmCancel,
    onConfirm,
  }

  return (
    <>
      {inEdit && (
        <Modal
          isOpen
          onRequestClose={requestClose}
          contentLabel={contentLabel}
          customStyles={modalStyle}
          labelledBy={`modal-header-${fieldName}`}
        >
          <ModalContent
            Field={Field}
            fieldName={fieldName}
            form={form}
            modalControls={modalControls}
          />
        </Modal>
      )}
      {!hideButton && (
        <ButtonContainer position={position}>
          <AddNewButton type="button" onClick={create} disabled={readonly}>
            <Translate content={`${translationsRoot}.modal.addButton`} />
          </AddNewButton>
        </ButtonContainer>
      )}
    </>
  )
}

FieldListAdd.propTypes = {
  fieldName: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  styling: PropTypes.shape({
    contentLabel: PropTypes.string,
    position: PropTypes.string,
    hideButton: PropTypes.bool,
  }),
}

FieldListAdd.defaultProps = {
  styling: {
    contentLabel: '',
    position: 'left',
    hideButton: false,
  },
}

const ButtonContainer = withCustomProps(styled.div)`
  text-align: ${props => props.position};
  margin-top: 0.5rem;
  margin-bottom: 0;
  > button {
    margin: 0;
  }
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 0.2em;
  margin-bottom: 0.4em;
`

export default observer(FieldListAdd)
