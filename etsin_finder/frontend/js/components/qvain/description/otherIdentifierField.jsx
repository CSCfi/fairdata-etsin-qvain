import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Button from '../../general/button';
import Card from '../general/card';

const OtherIdentifierField = () => (
  <Card>
    <Translate component="h3" content="qvain.description.otherIdentifiers.title" />
    <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
    <Input
      type="text"
      placeholder="http://orcid.org/"
    />
    <AddNewButton><Translate content="qvain.description.otherIdentifiers.addButton" /></AddNewButton>
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
