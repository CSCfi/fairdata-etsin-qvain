import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { darken } from 'polished'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import etsinTheme from '../../../../../styles/theme'
import SelectedItems from './selectedItems'
import AddItemsModal from './addItems'
import FixDeprecatedModal from '../fixDeprecatedModal'
import { Checkbox, Label } from '../../../general/modal/form'
import Loader from '../../../../general/loader'
import { ErrorLabel, ErrorContainer, ErrorContent, ErrorButtons } from '../../../general/errors'
import { Button } from '../../../../general/button'
import FormModal from './forms/formModal'
import { useStores } from '../../../utils/stores'

export const IDAFilePickerBase = () => {
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
      original,
    },
  } = useStores()
  const [modalOpen, setModalOpen] = useState(false)

  const haveItems =
    root &&
    (root.files.some(f => f.existing) ||
      root.directories.some(d => d.existing) ||
      root.addedChildCount > 0)

  if (loadingProjectError) {
    console.error(loadingProjectError)
  }

  let error

  if (original && loadingProjectError) {
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
        <Translate component={Title} content="qvain.files.selected.title" />
        <Loader active />
      </>
    )
  }

  if (!canSelectFiles && !haveItems) {
    return <Translate component={Title} content="qvain.files.selected.none" />
  }

  const title = canSelectFiles ? (
    <Translate component={Title} content="qvain.files.selected.title" />
  ) : (
    <Translate
      component={Title}
      content="qvain.files.selected.readonlyTitle"
      with={{ project: selectedProject }}
    />
  )

  const content = (
    <>
      {canSelectFiles && (
        <Controls>
          <AddItems>
            <Translate
              component={PlusButton}
              onClick={() => setModalOpen(true)}
              attributes={{ 'aria-label': 'qvain.files.addItemsModal.title' }}
            />
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

      {isLoadingProject ? <Loader active /> : <SelectedItems />}
    </>
  )

  return (
    <>
      {title}
      {content}
      <AddItemsModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
      {error}
      <FixDeprecatedModal />
      <FormModal />
    </>
  )
}

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

const Title = styled.h3`
  margin-right: 0.5em;
  margin-bottom: 0;
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

const PlusButtonWrapper = ({ onClick, ...props }) => (
  <button type="button" onClick={onClick} {...props}>
    <FontAwesomeIcon icon={faPlus} />
  </button>
)

const PlusButton = styled(PlusButtonWrapper)`
  border: 1px solid ${darken(0.1, etsinTheme.color.lightgray)};
  color: ${etsinTheme.color.darkgray};
  background: ${etsinTheme.color.lightgray};
  border-radius: 50%;
  width: 2em;
  height: 2em;
  font-size: 16pt;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  :hover {
    border: 1px solid ${darken(0.15, etsinTheme.color.lightgray)};
    color: ${darken(0.1, etsinTheme.color.darkgray)};
    background: ${darken(0.1, etsinTheme.color.lightgray)};
  }
`

PlusButtonWrapper.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default observer(IDAFilePickerBase)
