import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '../../utils/stores'

// If we have a deprecated dataset, show information and button for fixing it.
const DeprecatedState = () => {
  const { deprecated } = useStores().Qvain
  if (!deprecated) {
    return null
  }
  return (
    <DeprecationInfoText>
      <Translate content="qvain.files.deprecated" />
    </DeprecationInfoText>
  )
}

const DeprecationInfoText = styled.div`
  background-color: ${props => props.theme.color.error};
  text-align: center;
  width: 100%;
  color: white;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 300px;
  padding: 0.25em;
`

export default observer(DeprecatedState)
