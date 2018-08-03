{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

import styled from 'styled-components'

import checkColor from '../../styles/styledUtils'

const Label = styled.div`
  padding: 0.3em 0.6em 0.4em;
  border-radius: 0.2em;
  background: ${props => (props.color ? checkColor(props.color) : props.theme.color.gray)};
  color: white;
  width: min-content;
  display: inline-block;
  margin: ${props => (props.noMargin ? 0 : '0 0.7em 0 0')};
`

export default Label
