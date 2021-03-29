import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Modal from '../../../general/modal'
import Button, { InvertedButton } from '../../../general/button'
import { Input } from '../../common/formItems'
import FlaggedComponent from '../../../general/flaggedComponent'

const ConfirmPackageModal = ({ Packages }) => (
  <Modal
    isOpen={!!Packages.confirmModalCallback}
    contentLabel="confirm-package-creation"
    customStyles={modalStyle}
    onRequestClose={Packages.closeConfirmModal}
  >
    <Translate component={Header} content="dataset.dl.packages.modal.header" />
    <Translate component="p" content="dataset.dl.packages.modal.main" />
    <FlaggedComponent
      flag="DOWNLOAD_API_V2.EMAIL.FRONTEND"
      whenDisabled={<Translate component="p" content="dataset.dl.packages.modal.additional" />}
    >
      <p>
        <Translate component={EmailText} content="dataset.dl.packages.modal.additionalEmail" />
        <Translate
          component={EmailInput}
          type="text"
          attributes={{ placeholder: 'dataset.dl.packages.modal.emailPlaceholder' }}
        />
      </p>
    </FlaggedComponent>

    <Buttons>
      <Translate
        component={InvertedButton}
        content="dataset.dl.packages.modal.cancel"
        color="success"
        onClick={Packages.closeConfirmModal}
      />
      <Translate
        component={Button}
        content="dataset.dl.packages.modal.ok"
        color="success"
        onClick={Packages.confirmModalCallback}
      />
    </Buttons>
  </Modal>
)

ConfirmPackageModal.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const EmailInput = styled(Input)`
  height: 2em;
  padding: 0.5em;
`

const EmailText = styled.span`
  margin-right: 0.5em;
`

const Header = styled.h2`
  text-align: center;
  border-bottom: 1px solid ${p => p.theme.color.lightgray};
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin: -1rem;
  margin-top: -0.5rem;
  align-self: center;
  width: 75%;
  > * {
    margin: 0.5rem;
    border-radius: 0;
    padding: 0.75rem 2rem;
  }
`

const modalStyle = {
  content: {
    minWidth: '300px',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
}

export default observer(ConfirmPackageModal)
