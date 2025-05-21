import { observer } from 'mobx-react'
import { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios' // from 'axios' // import AbortClient from '@/utils/AbortClient'

import Translate from '@/utils/Translate'
import Modal from '@/components/general/modal'
import { useStores } from '@/utils/stores'
import License from '../Sidebar/special/license'
import { Checkbox } from '@/components/qvain/general/modal/form'
import { SaveButton } from '@/components/qvain/general/buttons'
import { useIsMounted } from '@/utils/useIsMounted'

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxWidth: '800px',
    minWidth: '50vw',
  },
}

const AccessModal = () => {
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const isMounted = useIsMounted()
  const {
    Etsin: {
      fetchData,
      EtsinDataset: { identifier, dataset, showAccessModal, setShowAccessModal, accessRights },
    },
    Env,
  } = useStores()

  if (!dataset) {
    return null
  }

  const submit = async () => {
    try {
      setLoading(true)
      await axios.post(Env.metaxV3Url('datasetREMSApplications', identifier))
      setShowAccessModal(false)
      await fetchData(identifier)
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  const hasTerms = false // todo: implement terms for data access
  const licenseCount = accessRights?.license?.length || 0

  return (
    <Modal
      isOpen={showAccessModal}
      customStyles={customStyles}
      contentLabel="Citation Modal"
      onRequestClose={() => setShowAccessModal(false)}
    >
      <Translate component="h1" content="dataset.access_modal.title" />
      {hasTerms && <Translate component="h2" content="dataset.access_modal.terms" />}
      <Translate component="h2" content="dataset.access_modal.license" />
      <List>
        {accessRights?.license?.map(l => (
          <ListItem key={l.url}>
            <License license={l} />
          </ListItem>
        ))}
      </List>
      <AcceptItem>
        <Checkbox
          id="accept-access-terms"
          data-testid="accept-access-terms"
          disabled={loading}
          value={accepted}
          onClick={() => setAccepted(!accepted)}
        />
        <CheckLabel htmlFor="accept-access-terms">
          <Translate content="dataset.access_modal.accept" />{' '}
          {hasTerms && (
            <>
              <Translate content="dataset.access_modal.acceptTerms" />{' '}
            </>
          )}
          <Translate content="dataset.access_modal.acceptLicense" with={{ count: licenseCount }} />
        </CheckLabel>
      </AcceptItem>
      <Buttons>
        <Translate
          component={SaveButton}
          content="dataset.access_modal.submit"
          data-testid="submit-access-application"
          onClick={submit}
          disabled={loading || !accepted}
        />
      </Buttons>
    </Modal>
  )
}

AccessModal.propTypes = {}

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li`
  :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const AcceptItem = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
`

const CheckLabel = styled.label`
  padding: 0 1rem;
  flex-grow: 1;
`

const Buttons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`

export default observer(AccessModal)
