import styled, { css } from 'styled-components'
import { InvertedButton, Button } from '@/components/general/button'

const submitButton = css`
  border: 3px solid ${props => props.theme.color.primary};
  border-radius: 5px;
  font-size: 1.3em;
  font-weight: 700;
  padding: 0.25rem 2rem;
  margin-bottom: 0;
`

export const PublishButton = styled(Button)`
  ${submitButton}
`

export const SaveButton = styled(InvertedButton)`
  ${submitButton}
`
