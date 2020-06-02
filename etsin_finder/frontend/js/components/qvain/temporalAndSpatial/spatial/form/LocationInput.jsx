import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Select from '../../../general/select'
import { Location } from '../../../../../stores/view/qvain.spatials'
import { Label } from '../../../general/form'


const LocationInput = ({ Stores }) => {
    const location = Stores.Qvain.Spatials.spatialInEdit.location
    const setLocation = (value) => Stores.Qvain.Spatials.changeSpatialAttribute('location', value)
    const labelTranslation = 'qvain.temporalAndSpatial.spatial.modal.locationInput.label'
    return (
      <>
        <Label htmlFor="location-input"><Translate content={labelTranslation} /></Label>
        <Select
          id="location-input"
          name="location"
          getter={location}
          setter={setLocation}
          model={Location}
          metaxIdentifier="location"
          inModal
        />
      </>
    )
}

LocationInput.propTypes = {
    Stores: PropTypes.object.isRequired
}

export default inject('Stores')(observer(LocationInput))
