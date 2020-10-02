import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Label } from '../../../../general/modal/form'
import FieldList from '../../../../general/section/fieldList'
import FieldListAdd from '../../../../general/section/fieldListAdd'
import handleSave from '../../../temporalAndSpatial/spatial/handleSave'
import Form from '../../../temporalAndSpatial/spatial/form'

const translationsRoot = 'qvain.history.provenance.modal.locationInput'
const translations = {
  label: `${translationsRoot}.label`,
}

const Location = ({ Stores }) => {
  const Store = Stores.Qvain.Provenances
  const Field = Store.inEdit.spatials
  const { lang } = Stores.Locale

  if (!Field) return null

  return (
    <>
      <Translate component={Label} content={translations.label} htmlFor="location-input" />
      <FieldList
        Store={Store}
        Field={Field}
        fieldIdentifier="spatials"
        lang={lang}
        translationsRoot={translationsRoot}
        disableNoItemsText
      />
      <FieldListAdd
        Store={Store}
        Field={Field}
        Form={Form}
        translationsRoot={translationsRoot}
        handleSave={() => handleSave(Field, translationsRoot)}
        position="left"
        hideButton={!!Field.storage.length}
      />
    </>
  )
}

Location.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Location))
