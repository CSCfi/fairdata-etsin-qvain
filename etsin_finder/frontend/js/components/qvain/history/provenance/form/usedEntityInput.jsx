import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Label } from '../../../general/modal/form'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from '../../relatedResource/handleSave'
import Form from '../../relatedResource/form'

const translationsRoot = 'qvain.history.provenance.modal.usedEntityInput'
const translations = {
  label: `${translationsRoot}.label`,
}

const Location = ({ Stores }) => {
  const Store = Stores.Qvain.Provenances
  const { lang } = Stores.Locale
  const Field = Store.RelatedResources
  return (
    <>
      <Translate component={Label} content={translations.label} htmlFor="used-entity-input" />
      <FieldList
        Store={Store}
        Field={Field}
        fieldIdentifier="relatedResources"
        lang={lang}
        translationsRoot={translationsRoot}
        elements={Store.inEdit.relatedResources}
        disableNoItemsText
      />
      <div id="used-entity-input">
        <FieldListAdd
          Store={Store}
          Field={Field}
          Form={Form}
          formProps={{ hideRelationType: true }}
          translationsRoot={translationsRoot}
          handleSave={() => handleSave(Field, { noRelationType: true })}
          position="left"
        />
      </div>
    </>
  )
}

Location.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Location))
