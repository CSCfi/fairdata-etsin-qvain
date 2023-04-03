{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import styled from 'styled-components'

export const Input = styled.input`
  padding: 0.5em 1.2em;
  border: 1px solid ${props => (props.error ? props.theme.color.error : '#969696')};
  border-radius: 0.3em;
  margin-bottom: 0.5em;
  box-sizing: border-box;
  // color: #969696;
  color: ${props => props.theme.color.darkgray};
  font-size: 1em;
  letter-spacing: 1px;
  &:focus {
    outline-color: ${props => (props.error ? props.theme.color.error : '')};
  }
`

export default Input

export const InputArea = styled.textarea`
  padding: 0.5em 1.2em;
  border: 1px solid ${props => (props.error ? props.theme.color.error : '#969696')};
  border-radius: 0.3em;
  margin-bottom: 1em;
  box-sizing: border-box;
  color: #969696;
  font-size: 1em;
  letter-spacing: 1px;
  height: 10em;
  &:focus {
    outline-color: ${props => (props.error ? props.theme.color.error : '')};
  }
`
