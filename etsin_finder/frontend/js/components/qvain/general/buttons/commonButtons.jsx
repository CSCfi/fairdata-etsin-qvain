import styled from 'styled-components'

import Button from '../../../general/button'

export const TableButton = styled(Button)`
  padding: 0;
  margin: 0;
  min-width: 84px;
  max-width: 6.5em;
  flex-grow: 1;
  height: 42px;
  background-color: #fff;
  border-radius: 4px;
  border: ${props => `solid 1px ${props.theme.color.dark}`};
  font-size: 16px;
  line-height: 1.31;
  color: ${props => `${props.theme.color.dark}`};
  &:hover {
    background-color: #ccc;
  }
`

export const CancelButton = styled(Button)`
  background-color: ${props => props.theme.color.lightgray};
  border-radius: 4px;
  border: ${props => `solid 1px ${props.theme.color.primary}`};
  font-size: 20px;
  font-weight: bold;
  color: ${props => `${props.theme.color.primary}`};
  padding: 10px 20px;
  &:hover {
    background-color: #ccc;
  }
`

export const SaveButton = styled(Button)`
  border-radius: 4px;
  border: ${props => `solid 1px ${props.theme.color.primary}`};
  background-color: ${props => `${props.theme.color.primary}`};
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-left: 20px;
  padding: 10px 25px;
  &:hover {
    background-color: ${props => props.theme.color.primaryDark};
  }
`

export const DangerButton = styled(Button)`
  border-radius: 4px;
  border: 1px solid ${props => (props.disabled ? '#ddb6b6' : '#db0000')};
  background-color: ${props => (props.disabled ? '#ddb6b6' : '#db0000')};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  color: #fff;
  margin-left: 20px;
  padding: 10px 25px;
  &:hover {
    background-color: ${props => (props.disabled ? '#ddb6b6' : '#ff4c4c')};
  }
`

export const DangerCancelButton = styled(Button)`
  min-width: 84px;
  max-width: 16.5em;
  background-color: #fff;
  border-radius: 4px;
  border: solid 1px #4f4f4f;
  font-size: 16px;
  line-height: 1.31;
  padding: 0.75rem 0.25rem;
  color: #4f4f4f;
  &:hover {
    background-color: #ccc;
  }
`

export const RemoveButton = styled(Button)`
  min-width: 84px;
  max-width: 6.5em;
  height: 42px;
  border-radius: 4px;
  border: solid 1px #cc0000;
  background-color: #fff;
  font-size: 16px;
  font-weight: 600px;
  line-height: 1.31;
  color: #cc0000;
  &:hover {
    background-color: #ffb2b2;
    border: solid 2px #cc0000;
  }
  flex-grow: 1;
`

export const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`
