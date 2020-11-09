import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { PRESERVATION_STATE, PRESERVATION_STATE_COLOR } from '../../../../utils/constants'
import Label from '../../general/card/label'

const TablePasState = ({ preservationState }) => {
  let text = null
  let color = PRESERVATION_STATE_COLOR.DEFAULT
  if (PRESERVATION_STATE[preservationState]) {
    text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
    color = PRESERVATION_STATE[preservationState].color
  }
  return (
    <>
      <Translate content="qvain.files.dataCatalog.pas" component={PasLabel} color={color} />
      {text}
    </>
  )
}

const PasLabel = styled(Label)`
  margin-left: 10px;
  text-transform: uppercase;
`

const PasText = styled.span`
  margin-left: 10px;
  font-size: 0.8em;
  :before {
    content: '(';
  }
  :after {
    content: ')';
  }
`

TablePasState.propTypes = {
  preservationState: PropTypes.number.isRequired,
}

export default TablePasState
