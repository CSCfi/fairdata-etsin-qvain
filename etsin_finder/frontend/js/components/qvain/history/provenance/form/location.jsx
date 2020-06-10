import React from 'react'
import Translate from 'react-translate-component'
import { Label } from '../../../general/form'
import AddLocation from '../../../temporalAndSpatial/spatial/AddSpatialCoverage'

const translationsRoot = 'qvain.history.provenance.modal.locationInput'
const translations = {
    label: `${translationsRoot}.label`,
}

const Location = () => (
  <>
    <Translate component={Label} content={translations.label} htmlFor="location-input" />
    <div id="locationInput">
      <AddLocation translationsRoot={translationsRoot} />
    </div>
  </>
)
export default Location
