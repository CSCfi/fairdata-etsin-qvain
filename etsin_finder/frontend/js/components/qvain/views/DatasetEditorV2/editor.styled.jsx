import styled from 'styled-components'
import { Container } from '../../general/card'

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

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const SubmitContainer = styled(Container)`
  padding-bottom: 25px;
  margin: 15px;
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

export const Right = styled.div`
  display: flex;
  justify-content: right;
`

export const Left = styled.div`
  display: flex;
  justify-content: left;
`

export const Separator = styled.div`
  margin-top: 1.5rem;
`
