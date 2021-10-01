import React, { Fragment } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import {
  ButtonGroup,
  SaveButton,
  FileItem,
  EditButton,
  DeleteButton,
  ButtonLabel,
  ButtonContainer,
} from '../../../general/buttons'
import { Input, SelectedFilesTitle } from '../../../general/modal/form'
import { SlidingContent } from '../../../general/card'
import ExternalFileForm from './externalFileForm'
import { useStores } from '../../../utils/stores'

export const ExternalFilesBase = () => {
  const {
    Qvain: {
      ExternalResources: { edit, remove, clearInEdit, storage: externalResources },
    },
  } = useStores()

  const handleEditExternalResource = externalResource => () => {
    edit(externalResource.uiid)
  }

  const handleRemoveExternalResource = externalResourceId => () => {
    remove(externalResourceId)
    clearInEdit()
  }

  const parseUrl = resource =>
    // Disable lint rule because this syntax is more readable using concatenation
    /* eslint-disable prefer-template */
    resource != null &&
    ' / ' + (' / ' + resource.length > 40 ? resource.substring(0, 40).concat('... ') : resource)

  return (
    <>
      <Translate component="p" content="qvain.files.external.help" />
      <SlidingContent open>
        <Translate
          tabIndex="0"
          component={SelectedFilesTitle}
          content="qvain.files.external.addedResources.title"
        />
        {externalResources.length === 0 && (
          <Translate
            tabIndex="0"
            component="p"
            content="qvain.files.external.addedResources.none"
          />
        )}
        {externalResources.map(addedExternalResource => (
          <ButtonGroup tabIndex="0" key={addedExternalResource.uiid}>
            <ButtonLabel>
              {addedExternalResource.title}
              {parseUrl(addedExternalResource.accessUrl)}
              {parseUrl(addedExternalResource.downloadUrl)}
            </ButtonLabel>
            <ButtonContainer>
              <EditButton
                type="button"
                onClick={handleEditExternalResource(addedExternalResource)}
              />
              <DeleteButton
                type="button"
                onClick={handleRemoveExternalResource(addedExternalResource.uiid)}
              />
            </ButtonContainer>
          </ButtonGroup>
        ))}
        <ExternalFileForm />
      </SlidingContent>
    </>
  )
}

export const ResourceInput = styled(Input)`
  width: 100%;
`

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')};
`

export default observer(ExternalFilesBase)
