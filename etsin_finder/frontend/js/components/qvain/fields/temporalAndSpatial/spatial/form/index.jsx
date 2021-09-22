import React from 'react'
import PropTypes from 'prop-types'
import ModalInput from '../../../../general/modal/modalInput'
import SpatialArrayInput from './SpatialArrayInput'
import ModalReferenceInput from '../../../../general/modal/modalReferenceInput'
import { Location } from '../../../../../../stores/view/qvain/qvain.spatials'
import { FormContainer } from '../../../../general/modal/form'

const Form = ({ Field }) => (
  <FormContainer>
    <ModalInput Field={Field} datum="name" isRequired />
    <ModalInput Field={Field} datum="altitude" />
    <ModalInput Field={Field} datum="address" />
    <SpatialArrayInput Field={Field} datum="geometry" type="text" />
    <ModalReferenceInput
      Field={Field}
      datum="location"
      model={Location}
      metaxIdentifier="location"
      search
    />
  </FormContainer>
)

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
