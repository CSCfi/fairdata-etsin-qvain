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
import { EmptyExternalResource } from '../../../../../stores/view/qvain'
import { Input, SelectedFilesTitle } from '../../../general/modal/form'
import { SlidingContent } from '../../../general/card'
import ExternalFileForm from './externalFileForm'
import { useStores } from '../../../utils/stores'

export const ExternalFilesBase = () => {
  const {
    Qvain: { editExternalResource, removeExternalResource, addedExternalResources },
  } = useStores()

  const handleEditExternalResource = externalResource => () => {
    editExternalResource(externalResource)
  }

  const handleRemoveExternalResource = externalResourceId => () => {
    removeExternalResource(externalResourceId)
    editExternalResource(EmptyExternalResource)
  }

  const parseUrl = resource =>
    // Disable lint rule because this syntax is more readable using concatenation
    /* eslint-disable prefer-template */
    resource != null &&
    ' / ' + (' / ' + resource.length > 40 ? resource.substring(0, 40).concat('... ') : resource)

  return (
    <Fragment>
      <Translate component="p" content="qvain.files.external.help" />
      <SlidingContent open>
        <Translate
          tabIndex="0"
          component={SelectedFilesTitle}
          content="qvain.files.external.addedResources.title"
        />
        {addedExternalResources.length === 0 && (
          <Translate
            tabIndex="0"
            component="p"
            content="qvain.files.external.addedResources.none"
          />
        )}
        {addedExternalResources.map(addedExternalResource => (
          <ButtonGroup tabIndex="0" key={addedExternalResource.id}>
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
                onClick={handleRemoveExternalResource(addedExternalResource.id)}
              />
            </ButtonContainer>
          </ButtonGroup>
        ))}
        <ExternalFileForm />
      </SlidingContent>
    </Fragment>
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
