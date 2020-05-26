import React from 'react'
import styled from 'styled-components'
import SpatialInput from './SpatialInput'
import SpatialArrayInput from './SpatialArrayInput'
import LocationInput from './LocationInput'

const Form = () => (
  <FormContainer>
    <SpatialInput
      datum="name"
      type="text"
      error=""
      isRequired
    />
    <SpatialInput
      datum="altitude"
      type="text"
      error=""
    />
    <SpatialInput
      datum="address"
      type="text"
      error=""
    />
    <SpatialArrayInput
      datum="geometry"
      type="text"
      error=""
    />
    <LocationInput />
  </FormContainer>
    )

const FormContainer = styled.div`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 85%;
`

export default Form
