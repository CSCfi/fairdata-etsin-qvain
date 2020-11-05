import React from 'react'
import PropTypes from 'prop-types'
import ModalInput from '../../../general/modal/modalInput'
import SpatialArrayInput from './SpatialArrayInput'
import ModalReferenceInput from '../../../general/modal/modalReferenceInput'
import { Location } from '../../../../../stores/view/qvain/qvain.spatials'
import { FormContainer } from '../../../general/modal/form'

const Form = props => (
  <FormContainer>
    <ModalInput {...props} datum="name" isRequired />
    <ModalInput {...props} datum="altitude" />
    <ModalInput {...props} datum="address" />
    <SpatialArrayInput {...props} datum="geometry" type="text" />
    <ModalReferenceInput
      {...props}
      datum="location"
      model={Location}
      metaxIdentifier="location"
      search
    />
  </FormContainer>
)

Form.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
}

export default Form
