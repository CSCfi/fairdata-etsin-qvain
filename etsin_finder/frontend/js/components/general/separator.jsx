import styled from 'styled-components'

const Separator = styled.div`
  width: 100%;
  height: ${props => (props.height ? props.height : '1px')};
  margin: ${props => (props.margin ? props.margin : '1em')} 0em;
  background-color: ${props => props.theme.color.lightgray};
`

export default Separator
