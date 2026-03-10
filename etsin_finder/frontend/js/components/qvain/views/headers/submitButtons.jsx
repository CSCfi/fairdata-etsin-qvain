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
      userIsQvainAdmin,
      AdminOrg: { selectedAdminOrg, adminOrgs },
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
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    action: null, // 'draft' | 'publish'
    reasons: [], // ['rems', 'adminOrg']
    currentReasonIndex: 0,
  })

  const needConfirmREMSLicense = hasApprovedREMSApplications && publishWillChangeREMSLicenses
  const adminOrgChanged = selectedAdminOrg?.value !== original?.metadata_owner_admin_org
  const needConfirmREMSOrg = hasApprovedREMSApplications && adminOrgChanged
  const needConfirmChangedAdminOrg =
    userIsQvainAdmin && adminOrgChanged && !adminOrgs?.includes(selectedAdminOrg?.value)

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

  const doSubmitDraft = (adminOrgChanged = false) => {
    if (original?.identifier) {
      Matomo.recordEvent(`DRAFT / ${original.identifier}`)
    } else {
      Matomo.recordEvent('DRAFT')
    }
    submitDraft(adminOrgChanged ? goToDatasetsCallBack : null)
  }

  const doSubmitPublish = () => {
    if (original?.identifier) {
      Matomo.recordEvent(`PUBLISH / ${original.identifier}`)
    } else {
      Matomo.recordEvent('PUBLISH')
    }
    submitPublish(goToDatasetsCallBack)
  }

  const openConfirmModal = (action, reasons) => {
    setConfirmState({
      isOpen: true,
      action,
      reasons,
      currentReasonIndex: 0,
    })
  }

  const closeConfirmModal = () => {
    setConfirmState({
      isOpen: false,
      action: null,
      reasons: [],
      currentReasonIndex: 0,
    })
  }

  const handleConfirmAccept = () => {
    const { currentReasonIndex, reasons, action } = confirmState
    const hasMoreReasons = currentReasonIndex + 1 < reasons.length

    if (hasMoreReasons) {
      setConfirmState(prev => ({
        ...prev,
        currentReasonIndex: prev.currentReasonIndex + 1,
      }))
      return
    }

    closeConfirmModal()

    if (action === 'draft') {
      doSubmitDraft(reasons.includes('adminOrg'))
    } else if (action === 'publish') {
      doSubmitPublish()
    }
  }

  const handleDraftClick = () => {
    if (needConfirmChangedAdminOrg) {
      openConfirmModal('draft', ['adminOrg'])
    } else {
      doSubmitDraft(false)
    }
  }

  const handlePublishClick = () => {
    const reasons = []

    if (needConfirmREMSLicense) {
      // Change in REMS licenses or terms will invalidate
      // existing applications when the dataset is published
      reasons.push('remsLicense')
    }
    if (needConfirmREMSOrg) {
      // Change in REMS organization will invalidate existing applications
      reasons.push('remsOrg')
    }
    if (needConfirmChangedAdminOrg) {
      reasons.push('adminOrg')
    }

    if (reasons.length > 0) {
      openConfirmModal('publish', reasons)
    } else {
      doSubmitPublish()
    }
  }

  const approvedCount = remsApplicationCounts?.approved || 0
  const currentReason = confirmState.reasons[confirmState.currentReasonIndex]
  const confirmButtonLabel =
    confirmState.action === 'draft' ? translate('qvain.saveDraft') : translate('qvain.submit')

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
        contentLabel="confirm-submit"
        isOpen={confirmState.isOpen}
        onRequestClose={closeConfirmModal}
      >
        {currentReason === 'remsLicense' && (
          <Translate
            component="p"
            content="qvain.submitConfirm.remsLicenseChange"
            with={{ count: approvedCount }}
            unsafe
          />
        )}
        {currentReason === 'remsOrg' && (
          <Translate
            component="p"
            content="qvain.submitConfirm.changedREMSOrg"
            with={{ count: approvedCount }}
          />
        )}
        {currentReason === 'adminOrg' && (
          <Translate component="p" content="qvain.submitConfirm.changedAdminOrg" />
        )}
        <Buttons>
          <TableButton onClick={closeConfirmModal}>{translate('qvain.common.cancel')}</TableButton>
          <DangerButton onClick={handleConfirmAccept}>{confirmButtonLabel}</DangerButton>
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
