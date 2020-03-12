import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export const FormField = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`

export const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: solid 1px #cccccc;
  padding: 8px;
  color: #000;
  margin-bottom: 20px;
`

export const Textarea = styled.textarea`
  width: 100%;
  border-radius: 3px;
  border: solid 1px #cccccc;
  padding: 8px;
  color: #000;
  margin-bottom: 20px;
`

export const CustomSelect = styled(Select)`
  margin-bottom: 20px;
`

export const Label = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: block;
`

export const LabelLarge = styled.label`
  font-size: 1.2em;
  line-height: calc(1.5 * 1.2em);
  font-weight: 700
`

export const RadioContainer = styled.div`
  display: inline-block;
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 10px;
  cursor: pointer;
`

export const RadioInput = styled.input`
  position: absolute;
  z-index: 1;
`

export const CheckboxStyles = styled.input`
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  padding: 11px;
  line-height: 0;
  white-space: nowrap;
  vertical-align: bottom;

  :not(:disabled) {
    cursor: pointer;
  }
`

export const Checkbox = props => <CheckboxStyles {...props} type="checkbox" />

export const HelpField = styled.span`
  font-weight: 200;
  font-family: 'Lato', sans-serif;
`

export const HelpIconStyles = styled(FontAwesomeIcon)`
  :hover {
    color: ${props => props.theme.color.primary};
  }
`

export const NoStyleButton = styled.button`
  border: none;
  background-color: unset;
`

export const HelpIcon = props => (
  <NoStyleButton {...props} type="button">
    <HelpIconStyles icon={faInfoCircle} />
  </NoStyleButton>
)

export const SelectedFilesTitle = styled.label`
  display: block;
  font-weight: 600;
  color: #4f4f4f;
  margin-bottom: 8px;
  text-transform: uppercase;
`
