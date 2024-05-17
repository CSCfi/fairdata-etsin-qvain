import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { Title, FieldGroup } from '@/components/qvain/general/V2'
import { Checkbox, Label } from '@/components/qvain/general/modal/form'
import Loader from '@/components/general/loader'
import {
  ErrorLabel,
  ErrorContainer,
  ErrorContent,
  ErrorButtons,
} from '@/components/qvain/general/errors'
import { Button } from '@/components/general/button'
import { useStores } from '@/stores/stores'
import SelectedItems from './selectedItems'
import AddItemsModal from './addItems'
import FormModal from './forms/formModal'
import { AddButton } from '@/components/qvain/general/V2/buttons'
import MetadataModal from '../MetadataModal'
import ClearMetadataModal from '../MetadataModal/clearMetadataModal'

export const FilePickerBase = () => {
  const {
    Qvain: {
      Files: {
        selectedProject,
        root,
        retry,
        SelectedItemsView: { toggleHideRemoved, hideRemoved },
        isLoadingProject,
        loadingProjectError,
      },
      canSelectFiles,
    },
  } = useStores()
  const [modalOpen, setModalOpen] = useState(false)

  const haveItems =
    root &&
    (root.files.some(f => f.existing) ||
      root.directories.some(d => d.existing) ||
      root.addedChildCount > 0)

  const isEmptyProject = loadingProjectError?.response?.status === 404

  if (loadingProjectError && !isEmptyProject) {
    console.error(loadingProjectError)
  }

  let error

  if (isEmptyProject) {
    error = (
      <div className="container">
        <Translate content="qvain.files.error.noFiles" />
      </div>
    )
  } else if (loadingProjectError) {
    error = (
      <div className="container">
        <ErrorContainer>
          <ErrorLabel>
            <Translate content="qvain.files.error.title" />
          </ErrorLabel>
          <ErrorContent>{String(loadingProjectError)}</ErrorContent>
          <ErrorButtons>
            <Button onClick={retry}>
              <Translate content="qvain.files.error.retry" />
            </Button>
          </ErrorButtons>
        </ErrorContainer>
      </div>
    )
  }

  if (!selectedProject && isLoadingProject) {
    return (
      <>
        <Translate component={Title} as="h3" content="qvain.files.selected.title" />
        <Loader active />
      </>
    )
  }

  if (!canSelectFiles && !haveItems) {
    return <Translate component={Title} as="h3" content="qvain.files.selected.none" />
  }

  const title = canSelectFiles ? (
    <Translate component={Title} as="h3" content="qvain.files.selected.title" />
  ) : (
    <Translate
      component={Title}
      as="h3"
      content="qvain.files.selected.readonlyTitle"
      with={{ project: selectedProject }}
    />
  )

  let selectedItems = null

  if (isLoadingProject) {
    selectedItems = <Loader active />
  } else if (haveItems) {
    selectedItems = (
      <Box>
        <SelectedItems />
      </Box>
    )
  }

  const content = (
    <>
      {canSelectFiles && (
        <Controls>
          <AddItems>
            <AddButton onClick={() => setModalOpen(true)} data-cy="start-adding-files" />
            <ProjectInfo>
              {selectedProject || <Translate content="qvain.files.selected.none" />}
            </ProjectInfo>
          </AddItems>
          <HideRemovedLabel>
            <Checkbox onChange={toggleHideRemoved} checked={hideRemoved} type="checkbox" />
            <Translate content={'qvain.files.selected.hideRemoved'} />
          </HideRemovedLabel>
        </Controls>
      )}

      {selectedItems}
    </>
  )

  return (
    <FieldGroup>
      {title}
      {content}
      <AddItemsModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
      {error}
      <FormModal />
      <MetadataModal />
      <ClearMetadataModal />
    </FieldGroup>
  )
}

const Box = styled.div`
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 1px 1px 0.25rem #cfcfcf;
`

const HideRemovedLabel = styled(Label)`
  display: flex;
  align-items: center;
`

const Controls = styled.div`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const ProjectInfo = styled.div`
  margin: 0;
  margin-left: 1em;
  padding: 0;
`

const AddItems = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

export default observer(FilePickerBase)
