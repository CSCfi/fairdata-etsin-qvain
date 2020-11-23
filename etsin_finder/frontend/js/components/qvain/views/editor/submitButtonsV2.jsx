import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useStores } from '../../utils/stores'
import SubmitButton from './submitButton.styled'
import TooltipHoverOnSave from '../../general/header/tooltipHoverOnSave'

export const SubmitButtonsV2 = ({ submitButtonsRef, disabled, doiModal, history }) => {
  const {
    Qvain: {
      Submit: {
        submitDraft,
        submitPublish,
        draftValidationError,
        publishValidationError,
        prevalidate,
      },
      original,
    },
    Env: { getQvainUrl },
  } = useStores()

  const [draftButtonHover, setDraftButtonHover] = useState(false)
  const [publishButtonHover, setPublishButtonHover] = useState(false)

  useEffect(() => {
    prevalidate()
    if (original?.identifier) {
      history.replace(getQvainUrl(`/dataset/${original.identifier}`))
    }
  }, [original, getQvainUrl, history, prevalidate])

  const prepareErrors = (error = {}) => {
    const { errors = [] } = error
    return errors.map(err => `${err}\n`)
  }

  return (
    <div ref={submitButtonsRef}>
      <TooltipHoverOnSave
        isOpen={draftButtonHover}
        errors={draftValidationError?.errors || []}
        description="qvain.validation.draft.description"
      >
        <WrapperDivForHovering
          onMouseOver={() => {
            setDraftButtonHover(true)
          }}
          onMouseLeave={() => setDraftButtonHover(false)}
        >
          <SubmitButton id="draft-btn" disabled={disabled} onClick={submitDraft}>
            <Translate content="qvain.saveDraft" />
          </SubmitButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>
      <TooltipHoverOnSave
        isOpen={publishButtonHover}
        errors={prepareErrors(publishValidationError)}
        description="qvain.validation.draft.description"
      >
        <WrapperDivForHovering
          onMouseOver={() => {
            setPublishButtonHover(true)
          }}
          onMouseLeave={() => {
            setPublishButtonHover(false)
            console.log('moi')
          }}
        >
          <SubmitButton id="publish-btn" disabled={disabled} onClick={submitPublish}>
            <Translate content="qvain.submit" />
          </SubmitButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>
      {doiModal}
    </div>
  )
}

SubmitButtonsV2.propTypes = {
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }).isRequired,
  disabled: PropTypes.bool.isRequired,
  doiModal: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
}

const WrapperDivForHovering = styled.div`
  display: inline-block;
`

export default observer(SubmitButtonsV2)
