import React from 'react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import withCustomProps from '@/utils/withCustomProps'

export const ModalHeader = styled.h2`
  display: flex;
  justify-content: center;
  line-height: 1.25;
`
export const ModalLabel = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1rem;
  color: #222;
  margin-bottom: 0;
`

export const Title = styled.label`
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  color: #222;
  margin-top: 0.5rem;
`

export const TitleSmall = styled.label`
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  color: #222;
  margin-top: 0.5rem;
`

export const InfoText = withCustomProps(styled.span)`
  display: relative;
  margin-top: ${({ weight = 0.5 }) => weight * -0.55}rem;
  font-size: 0.875rem;
`
export const InfoTextLarge = withCustomProps(styled.p)`
  margin-top: ${({ weight = 3 }) => weight * -0.55}rem;
  font-size: 1rem;
  padding-bottom: 1rem;
  margin: 0;
`

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: end;
  margin-top: auto;
`
export const ModalDivider = styled.div`
  border-top: 1px solid #b5b5b5;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

export const Divider = styled.div`
  padding-top: 1rem;
`

export const modalStyle = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    maxHeight: '95vh',
    minWidth: '300px',
    maxWidth: '750px',
    margin: '0.5em',
    border: 'none',
    padding: '1.5rem 2.5rem',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`

export const FormContainer = styled(FieldGroup)`
  overflow-y: auto;
  max-height: 85%;
  overflow-x: hidden;
`

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FieldInput = styled.input`
  width: 100%;
  border-radius: 3px;
  border: solid 1px #cccccc;
  padding: 8px;
  color: #000;
  display: block;
`

export const FieldLabel = styled.label`
  font-size: 1.125rem;
  margin-right: auto;
  display: block;
`

const RequiredStyle = styled.span`
  color: #222;
  padding-left: 0.25rem;
`

export function Required() {
  return <RequiredStyle>*</RequiredStyle>
}

export function RequiredText(props) {
  return <Translate {...props} component={InfoText} content="qvain.required" />
}

export function RequiredTextTitleOrDescription(props) {
  return <Translate {...props} component={InfoText} content="qvain.requiredTitleOrDescription" />
}

export const TextArea = styled.textarea`
  width: 100%;
  border-radius: 3px;
  min-height: 14rem;
  border: solid 1px #cccccc;
  padding: 8px;
  color: #000;
  display: block;
  resize: vertical;
`
export const NarrowTextArea = styled(TextArea)`
  min-height: 6rem;
`
