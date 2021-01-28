import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import axios from 'axios'
import { useStores } from '../../utils/stores'
import { SubmitButton } from './submitButton.styled'

import handleSubmitToBackend from '../../utils/handleSubmit'
import urls from '../../utils/urls'
import { qvainFormSchema } from '../../utils/formValidation'

const SubmitButtonsV1 = ({
  submit,
  success,
  failure,
  goToDatasets,
  handleCreatePublished,
  showUseDoiInformation,
  submitButtonsRef,
  doiModal,
  disabled,
}) => {
  const { Qvain, Env } = useStores()
  const { original, useDoi, moveSelectedToExisting, setChanged, editDataset } = Qvain

  const handleUpdateV1 = async () => {
    const datasetUrl = urls.v1.dataset(original.identifier)

    const obj = handleSubmitToBackend(Env, Qvain)
    obj.original = original

    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .patch(datasetUrl, obj)
          .then(async res => {
            moveSelectedToExisting()
            setChanged(false)
            editDataset(res.data)
            success(res.data)

            const nextVersion = res.data?.new_version_created?.identifier
            if (nextVersion) {
              goToDatasets(nextVersion)
            } else {
              goToDatasets(res.data.identifier)
            }

            return true
          })
          .catch(failure)
      )
      .catch(err => {
        console.error(err)
        console.error(err.errors)

        // Refreshing error header
        failure(err)
      })
  }

  return (
    <div ref={submitButtonsRef}>
      {original ? (
        <SubmitButton disabled={disabled} type="button" onClick={() => submit(handleUpdateV1)}>
          <Translate content="qvain.edit" />
        </SubmitButton>
      ) : (
        <SubmitButton
          disabled={disabled}
          type="button"
          onClick={useDoi === true ? showUseDoiInformation : () => submit(handleCreatePublished)}
        >
          <Translate content="qvain.submit" />
        </SubmitButton>
      )}
      {doiModal}
    </div>
  )
}

SubmitButtonsV1.propTypes = {
  submit: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  failure: PropTypes.func.isRequired,
  goToDatasets: PropTypes.func.isRequired,
  showUseDoiInformation: PropTypes.func.isRequired,
  handleCreatePublished: PropTypes.func.isRequired,
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }),
  doiModal: PropTypes.node.isRequired,
  disabled: PropTypes.bool.isRequired,
}

SubmitButtonsV1.defaultProps = {
  submitButtonsRef: null,
}

export default observer(SubmitButtonsV1)
