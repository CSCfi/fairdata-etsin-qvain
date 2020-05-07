import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { InvertedButton } from '../general/button'
import { Container, StickySubHeader } from './general/card'

export const STSD = styled.button`
  background: ${(p) => p.theme.color.primary};
  color: #fafafa;
  max-height: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  letter-spacing: 2px;
  transition: 0.2s ease;
  &:focus {
    text-decoration: underline;
    padding: 0.5em;
    max-height: 3em;
  }
`
export const SubHeaderTextContainer = styled.div`
  white-space: nowrap;
`
export const LinkBackContainer = styled.div`
  text-align: right;
  width: 100%;
  white-space: nowrap;
`
export const LinkBack = styled(Link)`
  color: #fff;
  margin-right: 40px;
`
export const ButtonContainer = styled.div`
  text-align: center;
  padding-top: 2px;
`

export const SubmitButton = styled(InvertedButton)`
  background: #fff;
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
  border-color: #007fad;
  border: 1px solid;
`

export const Form = styled.form`
  margin-bottom: 20px;
`
export const SubmitContainer = styled(Container)`
  padding-bottom: 25px;
  margin: 15px;
`
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

export const LinkText = styled.span`
  font-size: 18px;
  padding-left: 5px;
  padding-top: 2px;
  line-height: 1;
`

export const CustomSubHeader = styled(StickySubHeader)`
  justify-content: flex-start;
`
export const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}
