import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import FieldList from '../../general/fieldList'
import FieldListAdd from '../../general/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'

const ProvenanceFieldContent = ({ Store, lang }) => {
  const Field = Store.Provenances
  const translationsRoot = 'qvain.history.provenance'
  return (
    <>
      <FieldList
        Field={Field}
        lang={lang}
        translationsRoot={translationsRoot}
        elements={Store.provenances}
      />
      <FieldListAdd
        Store={Store}
        Field={Field}
        translationsRoot={translationsRoot}
        handleSave={() => handleSave(Field)}
        Form={Form}
      />
    </>
  )
}
ProvenanceFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default observer(ProvenanceFieldContent)
