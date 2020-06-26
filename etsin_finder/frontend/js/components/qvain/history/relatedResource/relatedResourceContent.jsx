import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import FieldList from '../../general/fieldList'
import FieldListAdd from '../../general/fieldListAdd'
import Form from './form'
import handleSave from './handleSave'

const RelatedResourceContent = ({ Stores }) => {
    const translationsRoot = 'qvain.history.relatedResource'
    const Store = Stores.Qvain
    const { lang } = Stores.Locale
    const Field = Store.RelatedResources
    return (
      <>
        <FieldList Store={Store} Field={Field} fieldIdentifier="relatedResources" lang={lang} />
        <FieldListAdd
          translationsRoot={translationsRoot}
          Store={Store}
          Field={Field}
          Form={Form}
          handleSave={handleSave}
        />
      </>
    )
}

RelatedResourceContent.propTypes = {
  Stores: PropTypes.object.isRequired
}

export default inject('Stores')(observer(RelatedResourceContent))
