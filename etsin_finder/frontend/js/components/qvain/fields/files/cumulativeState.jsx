import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import axios from 'axios'

import { ContainerSubsectionBottom } from '../../general/card'
import { CUMULATIVE_STATE } from '../../../../utils/constants'
import { getResponseError } from '../../utils/responseError'
import urls from '../../utils/urls'
import { LabelLarge, FormField, RadioInput, Label, HelpField } from '../../general/modal/form'

import Modal from '../../../general/modal'
import { TableButton, DangerButton } from '../../general/buttons'

import { Button as CumulativeStateButton } from '../../../general/button'

import Response from './response'
import { useStores } from '../../utils/stores'

const CumulativeState = () => {
  const {
    Qvain: {
      hasBeenPublished,
      cumulativeState: currentState,
      setCumulativeState,
      changed,
      setChanged,
      original,
      setOriginal,
    },
    Env: { metaxApiV2 },
  } = useStores()
  const [response, setResponse] = useState()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => {
    if (loading) {
      return
    }
    setModalOpen(false)
    setResponse(null)
  }

  const handleToggleCumulativeState = () => {
    if (!hasBeenPublished) {
      // only published datasets can be toggled with the RPC
      return
    }
    setResponse(null)
    setLoading(true)

    const newState =
      currentState === CUMULATIVE_STATE.YES ? CUMULATIVE_STATE.CLOSED : CUMULATIVE_STATE.YES

    const obj = {
      identifier: original.identifier,
      cumulative_state: newState,
    }

    let postUrl
    if (metaxApiV2) {
      postUrl = urls.v2.rpc.changeCumulativeState()
    } else {
      postUrl = urls.v1.rpc.changeCumulativeState()
    }
    axios
      .post(postUrl, obj)
      .then(res => {
        const data = res.data || {}
        setResponse({ new_version_created: data.new_version_created })
        // when a new version is created, the cumulative_state of the current version remains unchanged
        if (!data.new_version_created) {
          setCumulativeState(newState)
          setChanged(false)
        }

        const getUrl = metaxApiV2
          ? urls.v2.dataset(original.identifier)
          : urls.v1.dataset(original.identifier)

        console.log(getUrl)

        axios.get(getUrl).then(getRes => {
          const { data: getData } = getRes

          console.log(getData)
          setOriginal({ ...getData })
        })
      })
      .catch(err => {
        setResponse({ error: getResponseError(err) })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const stateKey = currentState === CUMULATIVE_STATE.YES ? 'enabled' : 'disabled'

  let content = null
  if (!hasBeenPublished) {
    // cumulative state can be assigned directly for new datasets
    content = (
      <div>
        <FormField>
          <RadioInput
            id="cumulativeStateNo"
            name="cumulativeState"
            onChange={() => setCumulativeState(0)}
            type="radio"
            checked={currentState === 0}
          />
          <Label htmlFor="cumulativeStateNo">
            <Translate content="qvain.files.cumulativeState.radio.no" />
          </Label>
        </FormField>
        <FormField>
          <RadioInput
            id="cumulativeStateYes"
            name="cumulativeState"
            onChange={() => setCumulativeState(1)}
            type="radio"
            checked={currentState === 1}
          />
          <Label htmlFor="cumulativeStateYes">
            <Translate content="qvain.files.cumulativeState.radio.yes" />
          </Label>
        </FormField>

        <HelpField>
          <Translate component="p" content="qvain.files.cumulativeState.radio.note" />
        </HelpField>
      </div>
    )
  } else {
    // existing datasets need to use the RPC for changing cumulative state
    const note = changed
      ? 'qvain.files.cumulativeState.changes'
      : `qvain.files.cumulativeState.${stateKey}.note`
    content = (
      <div>
        <p>
          <Translate component="strong" content={`qvain.files.cumulativeState.${stateKey}.state`} />{' '}
          <Translate content={`qvain.files.cumulativeState.${stateKey}.explanation`} />
        </p>
        <p>
          <CumulativeStateButton
            disabled={changed}
            type="button"
            onClick={() => setModalOpen(true)}
          >
            <Translate
              component={CumulativeStateButtonText}
              content={`qvain.files.cumulativeState.${stateKey}.button`}
            />
          </CumulativeStateButton>
        </p>
        <HelpField>
          <Translate component="p" content={note} />
        </HelpField>
      </div>
    )
  }

  let modalContent
  if (loading || response) {
    modalContent = (
      <>
        <Response response={response} requestClose={closeModal} />
        <TableButton disabled={loading} onClick={closeModal}>
          <Translate content={'qvain.files.cumulativeState.closeButton'} />
        </TableButton>
      </>
    )
  } else {
    modalContent = (
      <>
        <Translate component="p" content={`qvain.files.cumulativeState.${stateKey}.confirm`} />
        <TableButton onClick={closeModal}>
          <Translate content={`qvain.files.cumulativeState.${stateKey}.cancel`} />
        </TableButton>
        <DangerButton onClick={handleToggleCumulativeState}>
          <Translate content={`qvain.files.cumulativeState.${stateKey}.button`} />
        </DangerButton>
      </>
    )
  }

  return (
    <ContainerSubsectionBottom>
      <LabelLarge htmlFor="cumulativeStateSelect">
        <Translate content="qvain.files.cumulativeState.label" />
      </LabelLarge>
      {content}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="changeCumulativeStateModal"
      >
        <Translate component="h3" content="qvain.files.cumulativeState.modalHeader" />
        {modalContent}
      </Modal>
    </ContainerSubsectionBottom>
  )
}

export const CumulativeStateButtonText = styled.span`
  text-align: center;
  color: inherit;
  font-weight: 400;
  text-transform: none;
`

export default observer(CumulativeState)
