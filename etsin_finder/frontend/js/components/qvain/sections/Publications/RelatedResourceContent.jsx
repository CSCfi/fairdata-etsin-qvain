import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import ModalFieldList from '@/components/qvain/general/V2/ModalFieldList'
import ModalFieldListAdd from '@/components/qvain/general/V2/ModalFieldListAdd'
import OtherResourceForm from './OtherResourceForm'
import PublicationForm from './PublicationForm'
import { InfoTextLarge, Title } from '@/components/qvain/general/V2'

const RelatedResourceContent = () => {
  const {
    Qvain: { RelatedResources: Field },
  } = useStores()
  const {
    publications,
    otherResources,
    edit,
    remove,
    readonly,
    translationsRoot,
    createOtherResource,
    createPublication,
    publicationInEdit,
    otherResourceInEdit,
  } = Field

  const publicationTranslations = `${translationsRoot}.publications`
  const otherResTranslations = `${translationsRoot}.otherResources`

  return (
    <SectionContentWrapper>
      <Translate component={InfoTextLarge} content={`${translationsRoot}.infoText`} />
      <Translate component={Title} content={`${publicationTranslations}.title`} />
      <ModalFieldList
        storage={publications}
        edit={edit}
        remove={remove}
        readonly={readonly}
        translationsRoot={publicationTranslations}
      />
      <ModalFieldListAdd
        Field={Field}
        fieldName="RelatedResources"
        form={{ Form: PublicationForm, props: { Field } }}
        onClick={createPublication}
        isOpen={publicationInEdit}
        translationsRoot={publicationTranslations}
      />
      <Divider />
      <Translate component={Title} content={`${otherResTranslations}.title`} />
      <ModalFieldList
        storage={otherResources}
        edit={edit}
        remove={remove}
        readonly={readonly}
        translationsRoot={otherResTranslations}
      />
      <ModalFieldListAdd
        Field={Field}
        fieldName="RelatedResources"
        form={{ Form: OtherResourceForm, props: { Field } }}
        onClick={createOtherResource}
        isOpen={otherResourceInEdit}
        translationsRoot={otherResTranslations}
      />
    </SectionContentWrapper>
  )
}

const Divider = styled.div`
  padding-bottom: 2rem;
`

export default observer(RelatedResourceContent)
