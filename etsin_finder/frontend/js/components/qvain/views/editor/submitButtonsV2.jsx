import React, { useEffect } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { useStores } from '../../utils/stores'
import SubmitButton from './submitButton.styled'

export const SubmitButtonsV2 = ({ submitButtonsRef, disabled, doiModal, history, idSuffix }) => {
  const {
    Qvain: {
      Submit: { submitDraft, submitPublish },
      original,
    },
    Env: { getQvainUrl },
  } = useStores()

  useEffect(() => {
    if (original?.identifier) {
      history.replace(getQvainUrl(`/dataset/${original.identifier}`))
    }
  }, [original, getQvainUrl, history])

  return (
    <div ref={submitButtonsRef}>
      <SubmitButton id={`draft-btn${idSuffix}`} disabled={disabled} onClick={submitDraft}>
        <Translate content="qvain.saveDraft" />
      </SubmitButton>
      <SubmitButton id={`publish-btn${idSuffix}`} disabled={disabled} onClick={submitPublish}>
        <Translate content="qvain.submit" />
      </SubmitButton>
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

export default observer(SubmitButtonsV2)
