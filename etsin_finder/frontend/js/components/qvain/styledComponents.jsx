import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InvertedButton } from '../general/button'
import { Container, StickySubHeader, StickySubHeaderWrapper } from './general/card'

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

export const ButtonContainer = styled.div`
  text-align: center;
  padding-top: 2px;
  min-width: 300px;
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

export const LinkBackContainer = styled.div`
  text-align: ${(props) => props.position};
  white-space: nowrap;
  margin-top: 8px;
  width: 40%;
`

export const LinkBack = styled(Link)`
  color: black;
  margin-left: 40px;
  display: flex;
  align-items: center;
  height: 100%;
  margin-top: 0;
`

export const LinkText = styled.span`
  font-size: 18px;
  padding-left: 5px;
  color: #007fad;
`

export const LinkBackArrow = styled(FontAwesomeIcon)`
  margin-bottom: 0.23em;
`

export const CustomSubHeader = styled(StickySubHeader)`
  justify-content: flex-start;
`
