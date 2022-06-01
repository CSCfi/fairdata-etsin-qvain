import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { FieldGroup, InfoTextLarge, ModalLabel } from '@/components/qvain/general/V2'
import { Location } from '@/stores/view/qvain/qvain.spatials'
import ModalInput from '@/components/qvain/general/V2/ModalInput'
import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'
import SpatialArrayInput from './SpatialArrayInput'

const Form = ({ Field }) => (
  <FieldGroup>
    <Translate component={ModalLabel} content="qvain.geographics.title.general" />
    <ModalInput Field={Field} datum="name" translationsRoot="qvain.geographics" isRequired />
    <ModalInput Field={Field} datum="address" translationsRoot="qvain.geographics" />
    <Translate component={ModalLabel} content="qvain.geographics.title.geometry" />
    <Translate component={InfoTextLarge} content="qvain.geographics.infoText.geometry" weight={0} />
    <ModalReferenceInput
      Field={Field}
      datum="location"
      model={Location}
      metaxIdentifier="location"
      translationsRoot="qvain.geographics"
      search
    />
    <SpatialArrayInput Field={Field} datum="geometry" type="text" />
    <ModalInput Field={Field} datum="altitude" translationsRoot="qvain.geographics" />
  </FieldGroup>
)

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
