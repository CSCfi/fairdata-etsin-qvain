import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useStores } from '../../utils/stores'

// If we have a PAS dataset, show information on current state.
const PasState = () => {
  const {
    Qvain: { isPas, readonly, preservationState, original },
    Env,
  } = useStores()

  if (!isPas) {
    return null
  }

  if (Env?.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
    let key = null
    if (original?.preservation_pas_process_running) {
      key = 'processRunning'
    } else if (original?.preservation_pas_package_created) {
      key = 'packageCreated'
    }
    return (
      <PasInfoText>
        {preservationState > 0 && (
          <Translate
            content="qvain.pasInfo.stateInfo"
            with={{
              state: preservationState,
              description: <Translate content={`qvain.pasState.${preservationState}`} />,
            }}
          />
        )}
        {key && (
          <>
            <br />
            <Translate content={`qvain.pasInfoV3.${key}`} />
          </>
        )}
      </PasInfoText>
    )
  }

  const key = readonly ? 'readonly' : 'editable'
  return (
    <PasInfoText>
      <Translate
        content="qvain.pasInfo.stateInfo"
        with={{
          state: preservationState,
          description: <Translate content={`qvain.pasState.${preservationState}`} />,
        }}
      />{' '}
      <Translate content={`qvain.pasInfo.${key}`} />
    </PasInfoText>
  )
}

const PasInfoText = styled.div`
  background-color: #e8ffeb;
  text-align: center;
  width: 100%;
  color: green;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 300px;
  padding: 0.25em;
`

export default observer(PasState)
