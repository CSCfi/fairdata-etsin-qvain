import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import TabInput from '@/components/qvain/general/V2/TabInput'

const NameField = () => {
  const {
    Qvain: { ProjectV2: Field },
  } = useStores()
  const [language, setLanguage] = useState('en')

  return (
    <>
      <TranslationTab language={language} setLanguage={setLanguage} id="project">
        <TabInput Field={Field} datum="name" language={language} isRequired />
      </TranslationTab>
    </>
  )
}

export default observer(NameField)
