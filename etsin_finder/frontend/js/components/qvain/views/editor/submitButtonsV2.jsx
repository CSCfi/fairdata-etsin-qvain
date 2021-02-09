import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useStores } from '../../utils/stores'
import SubmitButton from './submitButton.styled'
import TooltipHoverOnSave from '../../general/header/tooltipHoverOnSave'

export const SubmitButtonsV2 = ({ submitButtonsRef, disabled, doiModal, history, idSuffix }) => {
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
      },
      original,
    },
    Env: { getQvainUrl },
    QvainDatasets: { setPublishedDataset },
  } = useStores()

  const [draftButtonHover, setDraftButtonHover] = useState(false)
  const [publishButtonHover, setPublishButtonHover] = useState(false)

  useEffect(() => {
    prevalidate()
    if (original?.identifier) {
      const path = `/dataset/${original.identifier}`
      if (history.location.pathname !== path) {
        history.replace(getQvainUrl(path))
      }
    }
  }, [original, getQvainUrl, history, prevalidate])

  const goToDatasetsCallBack = identifier => {
    // go to datasets view and highlight published dataset
    setPublishedDataset(identifier)
    history.push('/qvain')
  }

  return (
    <div ref={submitButtonsRef}>
      <TooltipHoverOnSave
        isOpen={draftButtonHover}
        errors={draftValidationError?.errors || []}
        description="qvain.validationMessages.draft.description"
      >
        <WrapperDivForHovering
          onMouseEnter={() => {
            setDraftButtonHover(true)
          }}
          onMouseLeave={() => setDraftButtonHover(false)}
        >
          <SubmitButton
            id={`draft-btn${idSuffix}`}
            disabled={disabled || isDraftButtonDisabled}
            onClick={submitDraft}
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
            onClick={() => submitPublish(goToDatasetsCallBack)}
          >
            <Translate content="qvain.submit" />
          </SubmitButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>
      {doiModal}
    </div>
  )
}

SubmitButtonsV2.propTypes = {
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }),
  disabled: PropTypes.bool.isRequired,
  doiModal: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  idSuffix: PropTypes.string,
}

SubmitButtonsV2.defaultProps = {
  submitButtonsRef: null,
  idSuffix: '',
}

const WrapperDivForHovering = styled.div`
  display: inline-block;
`

export default observer(SubmitButtonsV2)
