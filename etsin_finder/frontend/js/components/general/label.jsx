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
