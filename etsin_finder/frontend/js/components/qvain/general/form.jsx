import styled from 'styled-components';
import Select from 'react-select';

export const FormField = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`

export const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eceeef;
  padding: 8px;
  color: #808080;
  margin-bottom: 20px;
`

export const Textarea = styled.textarea`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eceeef;
  padding: 8px;
  color: #808080;
  margin-bottom: 20px;
`;

export const CustomSelect = styled(Select)`
  margin-bottom: 20px;
`

export const Label = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: block;
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

export const Checkbox = styled.input`
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  padding: 11px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
`

export const HelpField = styled.span`
  font-weight: 200;
  font-family: "Lato"
`
