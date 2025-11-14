import { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import { useNavigate, useLocation } from 'react-router'

import Modal from '@/components/general/modal'

import { useStores } from '@/stores/stores'
import TooltipHoverOnSave from '@/components/qvain/general/header/tooltipHoverOnSave'

import { SaveButton, PublishButton } from './submitButton.styled'
import { DangerButton, TableButton } from '../../general/buttons'
import Translate from '@/utils/Translate'

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
      },
      original,
      readonly,
      hasApprovedREMSApplications,
      publishWillChangeREMSLicenses,
      remsApplicationCounts,
    },
    Env: { getQvainUrl },
    QvainDatasets,
    Matomo,
    Locale: { translate },
  } = useStores()

  const navigate = useNavigate()
  const location = useLocation()
  const disabled = readonly || allButtonsDisabled

  const [draftButtonHover, setDraftButtonHover] = useState(false)
  const [publishButtonHover, setPublishButtonHover] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const needConfirm = hasApprovedREMSApplications && publishWillChangeREMSLicenses

  useEffect(() => {
    prevalidate()
    const identifier = original?.identifier
    if (identifier && identifier !== QvainDatasets.publishedDataset) {
      const path = `/dataset/${identifier}`
      const redirect = async () => {
        // Wait a bit so setChanged(false) has time to propagated to the Prompt component.
        await Promise.delay(0)
        navigate(getQvainUrl(path))
      }
      if (location.pathname !== path) {
        redirect()
      }
    }
  }, [original, QvainDatasets, getQvainUrl, navigate, location.pathname, prevalidate])

  const goToDatasetsCallBack = ({ identifier, isNew }) => {
    // go to datasets view and highlight published dataset
    QvainDatasets.setPublishedDataset({ identifier, isNew })
    navigate(getQvainUrl('/'))
  }

  const handleDraftClick = () => {
    submitDraft()

    if (original?.identifier) {
      Matomo.recordEvent(`DRAFT / ${original.identifier}`)
    } else {
      Matomo.recordEvent('DRAFT')
    }
  }

  const handlePublishClick = () => {
    if (needConfirm) {
      // Change in REMS licenses or terms will invalidate
      // existing applications when the dataset is published
      setShowConfirm(true)
    } else {
      submitPublish(goToDatasetsCallBack)
    }

    if (original?.identifier) {
      Matomo.recordEvent(`PUBLISH / ${original.identifier}`)
    } else {
      Matomo.recordEvent('PUBLISH')
    }
  }

  const approvedCount = remsApplicationCounts?.approved || 0

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
          <SaveButton
            id={`draft-btn${idSuffix}`}
            disabled={disabled || isDraftButtonDisabled}
            onClick={handleDraftClick}
          >
            {translate('qvain.saveDraft')}
          </SaveButton>
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
          <PublishButton
            id={`publish-btn${idSuffix}`}
            disabled={disabled || isPublishButtonDisabled}
            onClick={handlePublishClick}
          >
            {translate('qvain.submit')}
          </PublishButton>
        </WrapperDivForHovering>
      </TooltipHoverOnSave>

      <Modal
        contentLabel="confirm-publish"
        isOpen={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <Translate
          component="p"
          content="qvain.submitConfirm.remsLicenseChange"
          with={{ count: approvedCount }}
          unsafe
        />

        <Buttons>
          <TableButton onClick={() => setShowConfirm(false)}>
            {translate('qvain.common.cancel')}
          </TableButton>
          <DangerButton onClick={() => submitPublish(goToDatasetsCallBack)}>
            {translate('qvain.submit')}
          </DangerButton>
        </Buttons>
      </Modal>
    </div>
  )
}

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

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
