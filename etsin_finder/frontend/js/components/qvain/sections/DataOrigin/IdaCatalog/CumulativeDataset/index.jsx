import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { FieldGroup, Title } from '@/components/qvain/general/V2'
import { Paragraph } from '@/components/qvain/general/card'
import { CUMULATIVE_STATE } from '@/utils/constants'
import { FormField, RadioInput, Label, HelpField } from '@/components/qvain/general/modal/form'
import { Button } from '@/components/general/button'
import { useStores } from '@/stores/stores'

const CumulativeDataset = () => {
  const {
    Qvain: {
      cumulativeState,
      isCumulative,
      newCumulativeState,
      setCumulativeState,
      setNewCumulativeState,
      isNewVersion,
      hasBeenPublished,
      original,
      Files,
    },
  } = useStores()

  const offState = isCumulative ? CUMULATIVE_STATE.CLOSED : CUMULATIVE_STATE.NO
  const canChangeCumulativeState = !hasBeenPublished || cumulativeState === CUMULATIVE_STATE.YES

  const handleToggleNewCumulativeState = () => {
    if (newCumulativeState === CUMULATIVE_STATE.YES) {
      setNewCumulativeState(offState)
    } else {
      setNewCumulativeState(CUMULATIVE_STATE.YES)
    }
  }

  const getUnpublishedContent = () => {
    // Show radio toggle for new datasets and new unpublished drafts.
    // Cumulative state can be assigned directly for new datasets,
    // existing datasets need to use RPC.
    const setter = original ? setNewCumulativeState : setCumulativeState
    const state = original ? newCumulativeState : cumulativeState
    return (
      <>
        <FormField>
          <RadioInput
            id="cumulativeStateNo"
            name="cumulativeState"
            onChange={() => setter(0)}
            type="radio"
            checked={state === CUMULATIVE_STATE.NO}
          />
          <Label htmlFor="cumulativeStateNo">
            <Translate content="qvain.files.cumulativeState.radio.no" />
          </Label>
        </FormField>
        <FormField>
          <RadioInput
            id="cumulativeStateYes"
            name="cumulativeState"
            onChange={() => setter(1)}
            type="radio"
            checked={state === CUMULATIVE_STATE.YES}
          />
          <Label htmlFor="cumulativeStateYes">
            <Translate content="qvain.files.cumulativeState.radio.yes" />
          </Label>
        </FormField>

        <HelpField>
          <Translate component="p" content="qvain.files.cumulativeState.radio.note" />
        </HelpField>
      </>
    )
  }

  const getPublishedContent = () => {
    // Published datasets need to use the RPC for changing cumulative state and have restrictions for allowed values.
    const stateKey = newCumulativeState === CUMULATIVE_STATE.YES ? 'enabled' : 'disabled'
    const stateChanged = cumulativeState !== newCumulativeState
    const stateOrChangeKey = stateChanged ? 'stateChanged' : stateKey
    const hasFiles = Files.root?.directChildCount > 0

    return (
      <>
        <Paragraph>
          <Translate component="strong" content={`qvain.files.cumulativeState.${stateKey}.state`} />{' '}
          {(stateKey === 'enabled' || !hasFiles) && (
            <Translate content={`qvain.files.cumulativeState.${stateKey}.explanation`} />
          )}
          {canChangeCumulativeState && (
            <CumulativeStateButton type="button" onClick={handleToggleNewCumulativeState}>
              <Translate content={`qvain.files.cumulativeState.${stateOrChangeKey}.button`} />
            </CumulativeStateButton>
          )}
        </Paragraph>
        <Paragraph>
          <Translate
            component={HelpField}
            content={`qvain.files.cumulativeState.${stateOrChangeKey}.note`}
          />
        </Paragraph>
      </>
    )
  }

  const content =
    hasBeenPublished && !isNewVersion ? getPublishedContent() : getUnpublishedContent()

  return (
    <FieldGroup>
      <Title htmlFor="cumulativeStateSelect">
        <Translate content="qvain.files.cumulativeState.label" />
      </Title>
      {content}
    </FieldGroup>
  )
}

export const CumulativeStateButton = styled(Button)`
  display: block;
  margin-left: 0;
`

export default observer(CumulativeDataset)
