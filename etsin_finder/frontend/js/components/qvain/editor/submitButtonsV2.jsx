import React from 'react'
import axios from 'axios'
import { observer } from 'mobx-react'
import PropTypes, { instanceOf } from 'prop-types'
import Translate from 'react-translate-component'
import { useStores } from '../utils/stores'
import handleSubmitToBackend from '../utils/handleSubmit'
import { qvainFormSchema } from '../utils/formValidation'
import urls from '../utils/urls'
import { SubmitButton } from './submitButton.styled'

export const SubmitButtonsV2 = ({
  submit,
  success,
  failure,
  goToDatasets,
  disabled,
  doiModal,
  submitButtonsRef,
  history,
}) => {
  const { Qvain, Env } = useStores()
  const {
    original,
    setChanged,
    editDataset,
    canSelectFiles,
    canRemoveFiles,
    cumulativeState,
    newCumulativeState,
    Files,
  } = Qvain
  const { getQvainUrl } = Env

  let submitDraft = null
  let submitPublished = null

  const updateFiles = async (identifier, fileActions, metadataActions) => {
    if (fileActions) {
      await axios.post(urls.v2.datasetFiles(identifier), fileActions)
    }
    if (metadataActions) {
      await axios.put(urls.v2.datasetUserMetadata(identifier), metadataActions)
    }
  }

  const getSubmitValues = async () => {
    // Validate dataset and transform dataset metadata, file actions and metadata changes into format required by the backend.

    const obj = handleSubmitToBackend(Env, Qvain)
    await qvainFormSchema.validate(obj, { abortEarly: false })

    const values = {
      dataset: obj,
    }

    delete obj.directories
    delete obj.files

    const fileActions = Files.actionsToMetax()
    const metadataActions = Files.metadataToMetax()

    const filesChanged = fileActions.files.length > 0 || fileActions.directories.length > 0
    const filesRemoved =
      fileActions.files.some(v => v.exclude) || fileActions.directories.some(v => v.exclude)

    if (original && (original.state === 'published' || original.draft_of)) {
      if (filesRemoved && !canRemoveFiles) {
        throw new Error('A new dataset version is needed for removing files')
      }
      if (filesChanged && !canSelectFiles) {
        throw new Error('A new dataset version or a cumulative dataset is needed for adding files')
      }
    }

    if (fileActions.files.length > 0 || fileActions.directories.length > 0) {
      values.fileActions = fileActions
    }

    if (metadataActions.files.length > 0 || metadataActions.directories.length > 0) {
      values.metadataActions = metadataActions
    }

    if (newCumulativeState !== undefined && newCumulativeState !== cumulativeState) {
      values.newCumulativeState = newCumulativeState
    }

    return values
  }

  const updateCumulativeState = (identifier, state) =>
    axios.post(urls.v2.rpc.changeCumulativeState(), { identifier, cumulative_state: state })

  const patchDataset = async values => {
    const { dataset, fileActions, metadataActions } = values
    const { identifier } = dataset.original
    const datasetUrl = urls.v2.dataset(identifier)

    const resp = await axios.patch(datasetUrl, dataset)
    await updateFiles(identifier, fileActions, metadataActions)

    const cumulativeStateChanged =
      newCumulativeState !== undefined && dataset.cumulativeState !== newCumulativeState
    if (cumulativeStateChanged) {
      await updateCumulativeState(identifier, newCumulativeState)
    }

    setChanged(false)

    if (fileActions || metadataActions || cumulativeStateChanged) {
      // Dataset changed after patch, return updated dataset
      const { data } = await axios.get(datasetUrl)
      return data
    }
    return resp.data
  }

  const handleCreateNewDraft = async (showSuccess = true, editResult = true) => {
    // Create new draft dataset

    try {
      const { dataset, fileActions, metadataActions } = await getSubmitValues()
      if (!dataset) {
        return null
      }

      const datasetsUrl = urls.v2.datasets()
      const res = await axios.post(datasetsUrl, dataset, { params: { draft: true } })
      const identifier = res.data.identifier
      await updateFiles(identifier, fileActions, metadataActions)
      setChanged(false)

      if (editResult) {
        if (fileActions || metadataActions) {
          // Files changed, get updated dataset
          const url = urls.v2.dataset(identifier)
          const updatedResponse = await axios.get(url)
          await editDataset(updatedResponse.data)
        } else {
          await editDataset(res.data)
        }
        history.replace(getQvainUrl(`/dataset/${identifier}`))
      }

      if (showSuccess) {
        const data = { ...res.data, is_draft: true }
        success(data)
      }
      return identifier
    } catch (error) {
      if (!showSuccess) {
        throw error
      }
      failure(error)
      return null
    }
  }

  const handlePublishDataset = async (saveChanges = true, overrideIdentifier = null) => {
    const identifier = overrideIdentifier || (original && original.identifier)
    if (!identifier) {
      console.error('Draft needs to be saved before it can be published')
      return null
    }

    // Publishes an unpublished draft dataset
    const url = urls.v2.rpc.publishDataset()

    try {
      if (saveChanges) {
        const values = await getSubmitValues()

        // Save changes before publishing
        if (saveChanges && !(await patchDataset(values))) {
          console.error('Update failed, cancel publish')
          return null
        }
      }

      await axios.post(url, null, { params: { identifier } })

      const publishedUrl = urls.v2.dataset(identifier)
      const resp = await axios.get(publishedUrl)

      await editDataset(resp.data)
      history.replace(getQvainUrl(`/dataset/${resp.data.identifier}`))

      success(resp.data)
      goToDatasets(resp.data.identifier)
      return resp.data.identifier
    } catch (err) {
      failure(err)
      return null
    }
  }

  const handleUpdate = async () => {
    // Update existing dataset with the current metadata, add files and file metadata.
    // Return the dataset identifier if successful, otherwise null.

    try {
      const values = await getSubmitValues()

      const dataset = await patchDataset(values)
      await editDataset(dataset)

      const data = { ...dataset, is_draft: dataset.state === 'draft' }
      success(data)

      if (dataset.state === 'published') {
        goToDatasets(original.identifier)
      }

      return original.identifier
    } catch (error) {
      failure(error)
      return null
    }
  }

  const handleCreateNewDraftAndPublish = async () => {
    // Instead of publishing directly, create a draft first.
    // The steps are:
    // - save dataset as draft
    // - update files
    // - update file metadata
    // - publish
    // If something goes wrong while updating files,
    // the incomplete dataset wont't get published.
    let identifier
    try {
      identifier = await handleCreateNewDraft(false, false)
      if (identifier) {
        await handlePublishDataset(false, identifier)
      }
    } catch (error) {
      if (identifier) {
        history.replace(getQvainUrl(`/dataset/${identifier}`))
      }
      failure(error)
    }
  }

  const handleMergeDraft = async () => {
    const identifier = original && original.identifier
    const draftOf = original && original.draft_of && original.draft_of.identifier
    if (!draftOf) {
      console.error('Dataset is not draft of an existing one')
      return null
    }

    try {
      const values = await getSubmitValues()

      // Save changes to draft before merging
      await patchDataset(values)

      // Merge changes to original dataset, delete draft
      const url = urls.v2.rpc.mergeDraft()
      await axios.post(url, null, { params: { identifier } })

      const editUrl = urls.v2.dataset(draftOf)
      const resp = await axios.get(editUrl)

      goToDatasets(draftOf)
      success(resp.data)
      return draftOf
    } catch (error) {
      failure(error)
      return null
    }
  }

  const handleSaveAsDraft = async () => {
    // Create draft of a published dataset, save current changes to the draft
    if (!original || original.state !== 'published') {
      console.error('Expected a published dataset')
      return null
    }
    const identifier = original.identifier

    try {
      const values = await getSubmitValues()
      const res = await axios.post(urls.v2.rpc.createDraft(), null, { params: { identifier } })
      const newIdentifier = res.data.identifier

      // Fetch the created draft to make sure identifiers, modification date etc. are correct when updating
      const draftUrl = urls.v2.dataset(newIdentifier)
      const draftResponse = await axios.get(draftUrl)
      const draft = draftResponse.data
      values.dataset.original = draft

      // Update created draft
      const dataset = await patchDataset(values)
      await editDataset(dataset)
      history.replace(getQvainUrl(`/dataset/${dataset.identifier}`))
      const data = { ...dataset, is_draft: true }
      success(data)
      return newIdentifier
    } catch (err) {
      failure(err)
      return null
    }
  }

  if (!original) {
    // new -> draft
    submitDraft = (
      <SubmitButton disabled={disabled} onClick={() => submit(handleCreateNewDraft)}>
        <Translate content="qvain.saveDraft" />
      </SubmitButton>
    )

    // new -> published
    submitPublished = (
      <SubmitButton disabled={disabled} onClick={() => submit(handleCreateNewDraftAndPublish)}>
        <Translate content="qvain.submit" />
      </SubmitButton>
    )
  }

  if (original && original.state === 'draft') {
    // draft -> draft
    submitDraft = (
      <SubmitButton disabled={disabled} onClick={() => submit(handleUpdate)}>
        <Translate content="qvain.saveDraft" />
      </SubmitButton>
    )

    // draft -> published
    if (original.draft_of) {
      // merge draft of a published dataset
      submitPublished = (
        <SubmitButton disabled={disabled} onClick={() => submit(handleMergeDraft)}>
          <Translate content="qvain.submit" />
        </SubmitButton>
      )
    } else {
      // publish draft dataset
      submitPublished = (
        <SubmitButton disabled={disabled} onClick={() => submit(handlePublishDataset)}>
          <Translate content="qvain.submit" />
        </SubmitButton>
      )
    }
  }

  if (original && original.state !== 'draft') {
    // published -> draft
    submitDraft = (
      <SubmitButton disabled={disabled} onClick={() => submit(handleSaveAsDraft)}>
        <Translate content="qvain.saveDraft" />
      </SubmitButton>
    )

    // published -> published
    submitPublished = (
      <SubmitButton disabled={disabled} onClick={() => submit(handleUpdate)}>
        <Translate content="qvain.submit" />
      </SubmitButton>
    )
  }

  return (
    <div ref={submitButtonsRef}>
      {submitDraft}
      {submitPublished}
      {doiModal}
    </div>
  )
}

SubmitButtonsV2.propTypes = {
  submit: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  goToDatasets: PropTypes.func.isRequired,
  failure: PropTypes.func.isRequired,
  doiModal: PropTypes.node.isRequired,
  disabled: PropTypes.bool.isRequired,
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }).isRequired,
  history: PropTypes.object.isRequired,
}

export default observer(SubmitButtonsV2)
