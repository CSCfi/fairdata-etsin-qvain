import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import FieldList from '../../general/section/fieldList'
import FieldListAdd from '../../general/section/fieldListAdd'
import Form from './form'
import handleSave from './handleSave'

const RelatedResourceContent = ({ Stores }) => {
  const translationsRoot = 'qvain.history.relatedResource'
  const Store = Stores.Qvain
  const { lang } = Stores.Locale
  const Field = Store.RelatedResources
  return (
    <>
      <FieldList
        Field={Field}
        lang={lang}
        translationsRoot={translationsRoot}
        elements={Store.relatedResources}
      />
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
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(RelatedResourceContent))
