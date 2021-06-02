import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useHistory } from 'react-router-dom'

import { useStores } from '../../utils/stores'
import SubmitButton from './submitButton.styled'
import TooltipHoverOnSave from '../../general/header/tooltipHoverOnSave'
import DoiModal from './doiModal'

export const SubmitButtons = ({ submitButtonsRef, idSuffix, disabled: allButtonsDisabled }) => {
  const {
    Qvain: {
      Submit: {
        submitDraft,
        submitPublish,
        draftValidationError,
        publishValidationError,
        prevalidate,
        isDraftButtonDisabled,
        isPublishButtonDisabled,
        useDoiModalIsOpen,
        openUseDoiModal,
        closeUseDoiModal,
      },
      useDoi,
      hasBeenPublishedWithDoi,
      original,
      readonly,
    },
    Env: { getQvainUrl },
    QvainDatasets: { setPublishedDataset, publishedDataset },
    Matomo,
  } = useStores()

  const history = useHistory()
  const disabled = readonly || allButtonsDisabled

  const [draftButtonHover, setDraftButtonHover] = useState(false)
  const [publishButtonHover, setPublishButtonHover] = useState(false)

  useEffect(() => {
    prevalidate()
    const identifier = original?.identifier
    if (identifier && identifier !== publishedDataset) {
      const path = `/dataset/${identifier}`
      if (history.location.pathname !== path) {
        history.replace(getQvainUrl(path))
      }
    }
  }, [original, publishedDataset, getQvainUrl, history, prevalidate])

  const goToDatasetsCallBack = identifier => {
    // go to datasets view and highlight published dataset
    setPublishedDataset(identifier)
    history.push('/qvain')
  }

  const handleDraftClick = () => {
    submitDraft()

    if (original?.identifier) {
      Matomo.recordEvent(`DRAFT / ${original.identifier}`)
    } else {
      Matomo.recordEvent('DRAFT')
    }
  }

  const handlePublishClick = doiAccepted => {
    if (!hasBeenPublishedWithDoi && useDoi && !doiAccepted) {
      openUseDoiModal()
      return
    }

    submitPublish(goToDatasetsCallBack)

    if (original?.identifier) {
      Matomo.recordEvent(`PUBLISH / ${original.identifier}`)
    } else {
      Matomo.recordEvent('PUBLISH')
    }
  }

  return (
    <div ref={submitButtonsRef}>
      <TooltipHoverOnSave
        isOpen={draftButtonHover}
        errors={draftValidationError?.errors || []}
        description="qvain.validationMessages.draft.description"
      >
        <WrapperDivForHovering
          id="draft-button-wrapper"
          onMouseEnter={() => {
            setDraftButtonHover(true)
          }}
          onMouseLeave={() => setDraftButtonHover(false)}
        >
          <SubmitButton
            id={`draft-btn${idSuffix}`}
            disabled={disabled || isDraftButtonDisabled}
            onClick={handleDraftClick}
          >
            <Translate content="qvain.saveDraft" />
          </SubmitButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>
      <TooltipHoverOnSave
        isOpen={publishButtonHover}
        errors={publishValidationError?.errors || []}
        description="qvain.validationMessages.publish.description"
      >
        <WrapperDivForHovering
          id="publish-button-wrapper"
          onMouseEnter={() => {
            setPublishButtonHover(true)
          }}
          onMouseLeave={() => {
            setPublishButtonHover(false)
          }}
        >
          <SubmitButton
            id={`publish-btn${idSuffix}`}
            disabled={disabled || isPublishButtonDisabled}
            onClick={() => handlePublishClick(false)}
          >
            <Translate content="qvain.submit" />
          </SubmitButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>
      <DoiModal
        isOpen={useDoiModalIsOpen}
        onAcceptUseDoi={() => handlePublishClick(true)}
        onRequestClose={closeUseDoiModal}
      />
    </div>
  )
}

SubmitButtons.propTypes = {
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }),
  idSuffix: PropTypes.string,
  disabled: PropTypes.bool,
}

SubmitButtons.defaultProps = {
  submitButtonsRef: null,
  idSuffix: '',
  disabled: false,
}

const WrapperDivForHovering = styled.div`
  display: inline-block;
`

export default observer(SubmitButtons)
