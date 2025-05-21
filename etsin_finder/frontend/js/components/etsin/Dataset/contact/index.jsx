import { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { InvertedButton } from '@/components/etsin/general/button'
import Splash from '@/components/etsin/general/splash'
import ContactForm from './contactForm'
import Modal from '@/components/general/modal'
import { useStores } from '@/stores/stores'

const Contact = () => {
  const {
    Env: { metaxV3Url },
    Etsin: {
      EtsinDataset: { identifier, emailInfo, isRems },
    },
    Locale: { translate },
  } = useStores()

  const [modalOpen, setModal] = useState(false)
  const [splashOpen, setSplash] = useState(false)

  const recipients = () => {
    const recipientLabels = {
      CONTRIBUTOR: 'dataset.contributor.snglr',
      CREATOR: 'dataset.creator.snglr',
      CURATOR: 'dataset.curator',
      PUBLISHER: 'dataset.publisher',
      RIGHTS_HOLDER: 'dataset.rights_holder',
    }
    const recipientList = []
    for (const o in emailInfo) {
      if (emailInfo[o]) {
        if (o.toUpperCase() !== 'CONTRIBUTOR') {
          recipientList.push({
            label: <Translate content={recipientLabels[o.toUpperCase()]} />,
            value: o,
          })
        }
      }
    }
    return recipientList
  }

  const closeModal = (e, sent = false) => {
    setSplash(sent)
    setModal(false)
    if (sent) {
      setTimeout(() => {
        setSplash(false)
      }, 1200)
    }
  }

  return (
    <>
      <InvertedButton onClick={() => setModal(true)}>
        <Translate content="dataset.contact.send" />
      </InvertedButton>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        customStyles={customStyles}
        contentLabel="Contact"
      >
        <h2>
          <Translate content="dataset.contact.contact" />
        </h2>
        {/* TEMPORARY: rems won't be needed in contact later. */}
        {isRems && (
          <Notice>
            <Translate content="dataset.contact.access" />
          </Notice>
        )}
        <ContactForm
          close={closeModal}
          datasetID={identifier}
          recipientsList={recipients()}
          translations={translate('dataset.contact')}
          metaxV3Url={metaxV3Url}
        />
      </Modal>
      <Splash visible={splashOpen}>
        <Translate content="dataset.contact.success" component="h1" aria-live="assertive" />
      </Splash>
    </>
  )
}

const Notice = styled.p`
  margin-bottom: 0;
  color: ${p => p.theme.color.error};
  font-style: italic;
`

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

export default observer(Contact)
