import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { PRESERVATION_STATE } from '../../../utils/constants'
import Label from '../general/card/label'

const TablePasState = ({ preservationState }) => {
  let text
  switch (preservationState) {
    case 0:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 10:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 20:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 30:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 50:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 60:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 70:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 75:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 80:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 90:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 100:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 110:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 120:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 130:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    case 140:
      text = <Translate content={`qvain.pasState.${preservationState}`} component={PasText} />
      break
    default:
      text = null
      break
  }
  return (
    <>
      <PasLabel color={PRESERVATION_STATE[preservationState].color}>PAS</PasLabel>
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
