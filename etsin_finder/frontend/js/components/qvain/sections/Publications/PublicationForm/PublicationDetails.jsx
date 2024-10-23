import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'

import { FieldGroup, ModalLabel } from '@/components/qvain/general/V2'
import { RelationType } from '@/stores/view/qvain/qvain.relatedResources'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import TabInput from '@/components/qvain/general/V2/TabInput'
import ModalInput from '@/components/qvain/general/V2/ModalInput'
import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'

const PublicationDetails = ({ Field }) => {
  const {
    Locale: { getMatchingLang },
  } = useStores()
  const { inEdit } = Field

  const translations = [inEdit.name, inEdit.description]
  const [language, setLanguage] = useState(getMatchingLang(translations))
  const t = `${Field.translationsRoot}.publications`

  return (
    <FieldGroup>
      <Translate component={ModalLabel} content={`${t}.modal.formTitle`} />
      <ModalReferenceInput
        Field={Field}
        datum="relationType"
        metaxIdentifier="relation_type"
        model={RelationType}
        translationsRoot={`${Field.translationsRoot}.publications`}
        isRequired
      />
      <TranslationTab
        language={language}
        setLanguage={setLanguage}
        id="related-resource-title-and-description"
      >
        <TabInput Field={Field} datum="name" language={language} translationsRoot={t} isRequired />
        <TabInput Field={Field} datum="description" language={language} translationsRoot={t} />
      </TranslationTab>
      <ModalInput Field={Field} datum="identifier" translationsRoot={t} />
    </FieldGroup>
  )
}

PublicationDetails.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default observer(PublicationDetails)
