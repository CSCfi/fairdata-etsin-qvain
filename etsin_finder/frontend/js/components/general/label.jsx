import styled from 'styled-components'

const Label = styled.div`
  padding: 0.3em 0.6em 0.4em;
  border-radius: 0.2em;
  background: ${props => (props.color ? props.color : props.theme.color.gray)};
  color: white;
  width: min-content;
  display: inline-block;
  margin: ${props => (props.noMargin ? 0 : '0 0.7em 0 0')};
`

export default Label
