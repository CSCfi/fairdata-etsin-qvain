import styled from 'styled-components'
import { darken } from 'polished'

import { Link } from 'react-router-dom'
import { InvertedButton } from '../../../general/button'
import { Container, StickySubHeader } from '../../general/card'

export const SkipToSubmitDataset = styled.button.attrs({
  type: 'button',
})`
  background: ${p => p.theme.color.primary};
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

export const ButtonContainer = styled.div`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
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

export const LinkBackContainer = styled.div`
  text-align: ${props => props.position};
  white-space: nowrap;
`

export const LinkBack = styled(Link)`
  margin-left: 30px;
  color: #007fad;
  display: inline-flex;
  align-items: center;
  height: 100%;
  margin-top: 0;
`

export const LinkText = styled.span`
  color: ${props => props.theme.color.linkColor};
  font-size: 18px;
  padding-left: 5px;
  line-height: 1;
  &:hover {
    color: ${props => darken(0.1, props.theme.color.linkColor)};
  }
`

export const CustomSubHeader = styled(StickySubHeader)`
  background-color: ${props => props.theme.color.superlightgray};
  justify-content: flex-start;
`
export const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

// According to the HTML spec, pressing enter in a text input causes implicit
// form submission, i.e. the first submit button in the form is clicked.
// Prevent this by adding a disabled submit button to the beginning of the form.
export const DisableImplicitSubmit = styled.button.attrs({
  type: 'submit',
  disabled: true,
  'aria-hidden': true,
})`
  display: none;
`
