import React from 'react'
import styled from 'styled-components'

import Button from '../../general/button';
import Card from '../general/card';

const OtherIdentifierField = () => (
  <Card>
    <h3>Other identifier</h3>
    <p>
      Identifier for the metadata will be created automatically but if there alredy is an EXISTING identifier please insert it here.
    </p>
    <Input
      type="text"
      placeholder="http://orcid.org/"
    />
    <AddNewButton>+ Add new</AddNewButton>
  </Card>
)

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #cccccc;
  padding: 8px;
  color: #808080;
`
const AddNewButton = styled(Button)`
  float: right;
  margin: 0;
  margin-top: 11px; 
`

export default OtherIdentifierField;
