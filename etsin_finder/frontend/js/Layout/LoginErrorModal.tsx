import { useState } from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import Modal from '../components/general/modal'
import { useStores } from '../stores/stores'
import { LOGINERRORS } from '@/utils/constants'
import type { StringTranslationKey } from '@/stores/view/locale'

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

const LoginErrorModal = () => {
  const {
    Auth: { isAuthenticated, logout, loginError },
  } = useStores()

  const [modalOpen, setModalOpen] = useState(true)

  if (isAuthenticated) {
    return null
  }

  let error: StringTranslationKey | undefined
  if (loginError == LOGINERRORS.MISSING_FAIRDATA_USER) {
    error = 'loginError.missingUserName'
  } else if (loginError == LOGINERRORS.MISSING_ORGANIZATION) {
    error = 'loginError.missingOrganization'
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
