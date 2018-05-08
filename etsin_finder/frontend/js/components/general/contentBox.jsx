import styled from 'styled-components'

const ContentBox = styled.div`
  overflow-x: hidden;
  padding: 1.4em;
  border: 2px solid ${props => props.theme.color.lightgray};
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.6em;
  }
`

export default ContentBox
