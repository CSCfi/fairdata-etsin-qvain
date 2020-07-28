import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Label } from '../../../general/form'
import FieldList from '../../../general/fieldList'
import FieldListAdd from '../../../general/fieldListAdd'
import handleSave from '../../../temporalAndSpatial/spatial/handleSave'
import Form from '../../../temporalAndSpatial/spatial/form'

const translationsRoot = 'qvain.history.provenance.modal.locationInput'
const translations = {
    label: `${translationsRoot}.label`,
}

const Location = ({ Stores }) => {
  const Store = Stores.Qvain.Provenances
  const { lang } = Stores.Locale
  return (
    <>
      <Translate component={Label} content={translations.label} htmlFor="location-input" />
      <FieldList
        Store={Store}
        Field={Store.Spatials}
        fieldIdentifier="spatials"
        lang={lang}
        translationsRoot={translationsRoot}
        elements={Store.inEdit.spatials}
      />
      <div id="locationInput">
        <FieldListAdd
          Store={Store}
          Field={Store.Spatials}
          Form={Form}
          translationsRoot={translationsRoot}
          handleSave={() => handleSave(Store.Spatials)}
        />
      </div>
    </>
  )
}

Location.propTypes = {
  Stores: PropTypes.object.isRequired
}

export default inject('Stores')(observer(Location))
