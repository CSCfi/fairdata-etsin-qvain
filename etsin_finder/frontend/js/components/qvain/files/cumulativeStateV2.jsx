import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { Paragraph, ContainerSubsectionBottom } from '../general/card'
import { CUMULATIVE_STATE } from '../../../utils/constants'
import { LabelLarge, FormField, RadioInput, Label, HelpField } from '../general/form'
import { Button } from '../../general/button'

class CumulativeState extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleToggleNewCumulativeState = () => {
    const { newCumulativeState, setNewCumulativeState, isCumulative } = this.props.Stores.Qvain
    const offState = isCumulative ? CUMULATIVE_STATE.CLOSED : CUMULATIVE_STATE.NO
    if (newCumulativeState === CUMULATIVE_STATE.YES) {
      setNewCumulativeState(offState)
    } else {
      setNewCumulativeState(CUMULATIVE_STATE.YES)
    }
  }

  render() {
    const {
      cumulativeState,
      newCumulativeState,
      setCumulativeState,
      setNewCumulativeState,
      hasBeenPublished,
      original,
    } = this.props.Stores.Qvain
    const canChangeCumulativeState = !hasBeenPublished || cumulativeState === CUMULATIVE_STATE.YES
    let content = null
    if (!hasBeenPublished) {
      // Show radio toggle for new datasets and new unpublished drafts.
      // Cumulative state can be assigned directly for new datasets,
      // existing datasets need to use RPC.
      const setter = original ? setNewCumulativeState : setCumulativeState
      const state = original ? newCumulativeState : cumulativeState
      content = (
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
              <Translate content="qvain.files.cumulativeStateV2.radio.no" />
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
              <Translate content="qvain.files.cumulativeStateV2.radio.yes" />
            </Label>
          </FormField>

          <HelpField>
            <Translate component="p" content="qvain.files.cumulativeStateV2.radio.note" />
          </HelpField>
        </>
      )
    } else {
      // Published datasets need to use the RPC for changing cumulative state and have restrictions for allowed values.
      const stateKey = newCumulativeState === CUMULATIVE_STATE.YES ? 'enabled' : 'disabled'
      const stateChanged = cumulativeState !== newCumulativeState
      const stateOrChangeKey = stateChanged ? 'stateChanged' : stateKey
      content = (
        <>
          <Paragraph>
            <Translate
              component="strong"
              content={`qvain.files.cumulativeStateV2.${stateKey}.state`}
            />{' '}
            <Translate content={`qvain.files.cumulativeStateV2.${stateKey}.explanation`} />
            {canChangeCumulativeState && (
              <CumulativeStateButton type="button" onClick={this.handleToggleNewCumulativeState}>
                <Translate content={`qvain.files.cumulativeStateV2.${stateOrChangeKey}.button`} />
              </CumulativeStateButton>
            )}
          </Paragraph>
          <Paragraph>
            <Translate
              component={HelpField}
              content={`qvain.files.cumulativeStateV2.${stateOrChangeKey}.note`}
            />
          </Paragraph>
        </>
      )
    }

    return (
      <ContainerSubsectionBottom>
        <LabelLarge htmlFor="cumulativeStateSelect">
          <Translate content="qvain.files.cumulativeStateV2.label" />
        </LabelLarge>
        {content}
      </ContainerSubsectionBottom>
    )
  }
}

export const CumulativeStateButton = styled(Button)`
  display: block;
  margin-left: 0;
`

export default inject('Stores')(observer(CumulativeState))
