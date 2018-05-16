import styled from 'styled-components'

const Separator = styled.div`
  width: 100%;
  height: ${props => (props.height ? props.height : '1px')};
  margin: ${props => (props.margin ? props.margin : '1em')} 0em;
  background-color: ${props => props.theme.color.lightgray};
`
export const VerticalSeparator = styled.div`
  height: ${props => (props.height ? props.height : '100%')};
  width: ${props => (props.width ? props.width : '1px')};
  margin: ${props => (props.margin ? props.margin : '0em 1em')};
  background-color: ${props => props.theme.color.lightgray};
`

export default Separator
