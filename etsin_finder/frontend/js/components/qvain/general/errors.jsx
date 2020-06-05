import styled from 'styled-components'
import { Container } from './card'

export const ErrorContainer = styled(Container)`
  background-color: #ffebe8;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`

export const ErrorLabel = styled.p`
  font-weight: bold;
  display: inline-block;
  vertical-align: top;
`

export const ErrorContent = styled.div`
  max-width: 1140px;
  width: 100%;
  text-align: left;
  display: inline-block;
  white-space: pre-line;
`

export const ErrorButtons = styled.div`
  margin-bottom: -2em;
  margin-top: 1em;
  > button:first-child {
    margin: 0;
  }
`
