{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import { useState } from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import Modal from '../components/general/modal'
import { useStores } from '../stores/stores'

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

const LoginErrorModal = () => {
  const {
    Auth: { user, logout },
  } = useStores()

  const [modalOpen, setModalOpen] = useState(true)

  let error
  if (user.loggedIn) {
    if (!user.name) {
      error = 'loginError.missingUserName'
    } else if (!user.homeOrganizationId) {
      error = 'loginError.missingOrganization'
    }
  }

  if (!error) {
    return null
  }

  const close = () => {
    logout()
    setModalOpen(false)
  }

  return (
    <div className="search-page">
      <Modal
        isOpen={modalOpen}
        onRequestClose={close}
        customStyles={customStyles}
        contentLabel="LoginError"
      >
        <Translate content="loginError.header" component="h2" />
        <Translate content={error} component="p" />
      </Modal>
    </div>
  )
}

export default observer(LoginErrorModal)
