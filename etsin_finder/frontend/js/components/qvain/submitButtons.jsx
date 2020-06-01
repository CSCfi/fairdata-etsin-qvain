import React, { Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { qvainFormSchema } from './utils/formValidation'
import handleSubmitToBackend from './utils/handleSubmit'
import { DatasetUrls, FileAPIURLs } from './utils/constants'
import { InvertedButton } from '../general/button'
import DoiModal from './doiModal'

class SubmitButtons extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmitError: PropTypes.func.isRequired,
    handleSubmitResponse: PropTypes.func.isRequired,
    submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }).isRequired,
  }

  state = {
    useDoiModalIsOpen: false,
  }

  handleCreatePublishedV1 = (e) => {
    if (this.state.useDoiModalIsOpen) {
      this.closeUseDoiInformation()
    }

    const { metaxApiV2 } = this.props.Stores.Qvain
    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    this.setState({ datasetLoading: true })

    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .post(DatasetUrls.DATASET_URL, obj)
          .then((res) => {
            const data = res.data

            // Open the created dataset without reloading the editor
            if (data && data.identifier) {
              this.props.Stores.Qvain.resetQvainStore()
              this.props.Stores.Qvain.editDataset(data)
              this.props.history.replace(`/qvain/dataset/${data.identifier}`)
            }

            this.success({ ...data, is_new: true })
          })
          .catch(this.props.handleSubmitError)
      )
      .catch((err) => {
        console.log('Error for event: ', e)
        console.log(err.errors)

        this.failure(err)
      })
  }

  handleUpdateV1 = async () => {
    const { original, metaxApiV2 } = this.props.Stores.Qvain
    const datasetUrl = metaxApiV2 ? DatasetUrls.V2_DATASET_URL : DatasetUrls.DATASET_URL

    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    obj.original = original

    this.setState({ datasetLoading: true })

    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .patch(datasetUrl, obj)
          .then(async (res) => {
            this.props.Stores.Qvain.moveSelectedToExisting()
            this.props.Stores.Qvain.setChanged(false)
            this.props.Stores.Qvain.editDataset(res.data)
            this.success(res.data)
            return true
          })
          .catch(this.failure)
      )
      .catch((err) => {
        console.log(err)
        console.log(err.errors)

        // Refreshing error header
        this.failure(err)
      })
  }

  getSubmitValues = async () => {
    // Validate dataset and transform dataset metadata, file actions and metadata changes into format required by the backend.
    const { original, metaxApiV2, canSelectFiles, canRemoveFiles } = this.props.Stores.Qvain

    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    await qvainFormSchema.validate(obj, { abortEarly: false })

    const values = {
      dataset: obj,
    }

    if (metaxApiV2) {
      delete obj.directories
      delete obj.files

      const fileActions = this.props.Stores.Qvain.Files.actionsToMetax()
      const metadataActions = this.props.Stores.Qvain.Files.metadataToMetax()

      const filesChanged = fileActions.files.length > 0 || fileActions.directories.length > 0
      const filesRemoved =
        fileActions.files.some((v) => v.exclude) || fileActions.directories.some((v) => v.exclude)

      if (original && (original.state === 'published' || original.draft_of)) {
        if (filesRemoved && !canRemoveFiles) {
          throw new Error('A new dataset version is needed for removing files')
        }
        if (filesChanged && !canSelectFiles) {
          throw new Error(
            'A new dataset version or a cumulative dataset is needed for adding files'
          )
        }
      }

      if (fileActions.files.length > 0 || fileActions.directories.length > 0) {
        values.fileActions = fileActions
      }

      if (metadataActions.files.length > 0 || metadataActions.directories.length > 0) {
        values.metadataActions = metadataActions
      }
    }

    return values
  }

  updateFiles = async (identifier, fileActions, metadataActions) => {
    if (fileActions) {
      await axios.post(`${FileAPIURLs.V2_DATASET_FILES}${identifier}`, fileActions)
    }
    if (metadataActions) {
      await axios.put(`${FileAPIURLs.V2_DATASET_USER_METADATA}${identifier}`, metadataActions)
    }
  }

  patchDataset = async (values) => {
    const datasetUrl = DatasetUrls.V2_DATASET_URL
    const { dataset, fileActions, metadataActions } = values

    const { identifier } = dataset.original
    this.setState({ datasetLoading: true })

    const resp = await axios.patch(datasetUrl, dataset)
    await this.updateFiles(identifier, fileActions, metadataActions)
    this.props.Stores.Qvain.setChanged(false)

    if (fileActions || metadataActions) {
      // Dataset changed after patch, return updated dataset
      const url = `${DatasetUrls.V2_EDIT_DATASET_URL}/${identifier}`
      const { data } = await axios.get(url)
      return data
    }
    return resp.data
  }

  handleUpdate = async () => {
    // Update existing dataset with the current metadata, add files and file metadata.
    // Return the dataset identifier if successful, otherwise null.

    const { original, metaxApiV2 } = this.props.Stores.Qvain
    if (!metaxApiV2) {
      console.error('Use handleUpdateV1 with API V1')
      return null
    }
    try {
      const values = await this.getSubmitValues()

      this.setState({ datasetLoading: true })
      const dataset = await this.patchDataset(values)
      await this.props.Stores.Qvain.editDataset(dataset)

      const data = { ...dataset, is_draft: dataset.state === 'draft' }
      this.success(data)
      return original.identifier
    } catch (error) {
      this.failure(error)
      return null
    }
  }

  handleCreateNewDraft = async (showSuccess = true, editResult = true) => {
    // Create new draft dataset
    const { original, metaxApiV2 } = this.props.Stores.Qvain
    if (original) {
      console.error('Use handleCreateNewVersion to create a draft from a published dataset')
      return null
    }

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating drafts')
      return null
    }

    const datasetUrl = DatasetUrls.V2_DATASET_URL
    try {
      const { dataset, fileActions, metadataActions } = await this.getSubmitValues()
      if (!dataset) {
        return null
      }
      this.setState({ datasetLoading: true })

      const res = await axios.post(datasetUrl, dataset, { params: { draft: true } })
      const identifier = res.data.identifier
      await this.updateFiles(identifier, fileActions, metadataActions)
      this.props.Stores.Qvain.setChanged(false)

      if (editResult) {
        if (fileActions || metadataActions) {
          // Files changed, get updated dataset
          const url = `${DatasetUrls.V2_EDIT_DATASET_URL}/${identifier}`
          const updatedResponse = await axios.get(url)
          await this.props.Stores.Qvain.editDataset(updatedResponse.data)
        } else {
          await this.props.Stores.Qvain.editDataset(res.data)
        }
      }

      this.props.history.replace(`/qvain/dataset/${identifier}`)

      if (showSuccess) {
        const data = { ...res.data, is_draft: true }
        this.success(data)
      }
      return identifier
    } catch (error) {
      if (!showSuccess) {
        throw error
      }
      this.failure(error)
      return null
    }
  }

  handleCreateNewDraftAndPublish = async () => {
    // Instead of publishing directly, create a draft first.
    // The steps are:
    // - save dataset as draft
    // - update files
    // - update file metadata
    // - publish
    // If something goes wrong while updating files,
    // the incomplete dataset wont't get published.
    const identifier = await this.handleCreateNewDraft(false, false)
    if (identifier) {
      await this.handlePublishDataset(false, identifier)
    }
  }

  handleSaveAsDraft = async () => {
    // Create draft of a published dataset, save current changes to the draft
    const { original, metaxApiV2 } = this.props.Stores.Qvain
    if (!original || original.state !== 'published') {
      console.error('Expected a published dataset')
      return null
    }
    const identifier = original.identifier

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating drafts')
      return null
    }

    try {
      const values = await this.getSubmitValues()
      this.setState({ datasetLoading: true })
      const res = await axios.post(DatasetUrls.V2_CREATE_DRAFT, null, { params: { identifier } })
      const newIdentifier = res.data.identifier

      // Fetch the created draft to make sure identifiers, modification date etc. are correct when updating
      const draftUrl = `${DatasetUrls.V2_EDIT_DATASET_URL}/${newIdentifier}`
      const draftResponse = await axios.get(draftUrl)
      const draft = draftResponse.data
      values.dataset.original = draft

      // Update created draft
      const dataset = await this.patchDataset(values)
      await this.props.Stores.Qvain.editDataset(dataset)
      this.props.history.replace(`/qvain/dataset/${dataset.identifier}`)
      const data = { ...dataset, is_draft: true }
      this.success(data)
      return newIdentifier
    } catch (err) {
      this.failure(err)
      return null
    }
  }

  handleMergeDraft = async () => {
    const { original, metaxApiV2 } = this.props.Stores.Qvain

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for publishing drafts')
      return null
    }

    const identifier = original && original.identifier
    const draftOf = original && original.draft_of && original.draft_of.identifier
    if (!draftOf) {
      console.error('Dataset is not draft of an existing one')
      return null
    }

    try {
      const values = await this.getSubmitValues()
      this.setState({ datasetLoading: true })

      // Save changes to draft before merging
      await this.patchDataset(values)

      // Merge changes to original dataset, delete draft
      const url = DatasetUrls.V2_MERGE_DRAFT
      await axios.post(url, null, { params: { identifier } })

      const editUrl = `${DatasetUrls.V2_EDIT_DATASET_URL}/${draftOf}`
      const resp = await axios.get(editUrl)
      await this.props.Stores.Qvain.editDataset(resp.data)
      this.props.history.replace(`/qvain/dataset/${draftOf}`) // open the updated dataset
      this.success(resp.data)
      return draftOf
    } catch (error) {
      this.failure(error)
      return null
    }
  }

  handlePublishDataset = async (saveChanges = true, overrideIdentifier = null) => {
    const { original, metaxApiV2 } = this.props.Stores.Qvain

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for publishing drafts')
      return null
    }

    const identifier = overrideIdentifier || original.identifier
    if (!original) {
      console.error('Draft needs to be saved before it can be published')
      return null
    }

    // Publishes an unpublished draft dataset
    const url = DatasetUrls.V2_PUBLISH_DATASET

    try {
      if (saveChanges) {
        const values = await this.getSubmitValues()
        this.setState({ datasetLoading: true })

        // Save changes before publishing
        if (saveChanges && !(await this.patchDataset(values))) {
          console.error('Update failed, cancel publish')
          return null
        }
      }

      this.setState({ datasetLoading: true })
      await axios.post(url, null, { params: { identifier } })

      const publishedUrl = `${DatasetUrls.V2_EDIT_DATASET_URL}/${identifier}`
      const resp = await axios.get(publishedUrl)

      this.props.history.replace(`/qvain/dataset/${resp.data.identifier}`)
      await this.props.Stores.Qvain.editDataset(resp.data)
      this.success(resp.data)
      return resp.data.identifier
    } catch (err) {
      this.failure(err)
      return null
    }
  }

  showUseDoiInformation = () => {
    this.setState({
      useDoiModalIsOpen: true,
    })
  }

  // DOI usage accepted and will thus be used instead of URN ("yes")
  acceptDoi = () => {
    this.handleCreatePublishedV1()
  }

  // User closes the dialogue without accepting DOI usage ("no" or "exit")
  closeUseDoiInformation = () => {
    this.setState({
      useDoiModalIsOpen: false,
    })
  }

  failure = (error) => {
    this.props.handleSubmitError(error)
    this.setState({
      datasetLoading: false,
    })
  }

  success = (data) => {
    this.props.handleSubmitResponse(data)
    this.setState({
      datasetLoading: false,
    })
  }

  render() {
    const { original, readonly, metaxApiV2 } = this.props.Stores.Qvain
    const disabled = readonly || this.state.datasetLoading
    const doiModal = (
      <DoiModal
        isOpen={this.state.useDoiModalIsOpen}
        onAcceptUseDoi={this.acceptDoi}
        onRequestClose={this.closeUseDoiInformation}
      />
    )

    // Metax API v1
    if (!metaxApiV2) {
      return (
        <div ref={this.props.submitButtonsRef}>
          {original ? (
            <SubmitButton
              ref={this.updateDatasetButton}
              disabled={disabled}
              type="button"
              onClick={this.handleUpdateV1}
            >
              <Translate content="qvain.edit" />
            </SubmitButton>
          ) : (
            <SubmitButton
              ref={this.submitDatasetButton}
              disabled={disabled}
              type="button"
              onClick={
                this.props.Stores.Qvain.useDoi === true
                  ? this.showUseDoiInformation
                  : this.handleCreatePublishedV1
              }
            >
              <Translate content="qvain.submit" />
            </SubmitButton>
          )}
          {doiModal}
        </div>
      )
    }

    let submitDraft = null
    let submitPublished = null

    if (!original) {
      // new -> draft
      submitDraft = (
        <SubmitButton disabled={disabled} onClick={() => this.handleCreateNewDraft()}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // new -> published
      submitPublished = (
        <SubmitButton disabled={disabled} onClick={() => this.handleCreateNewDraftAndPublish()}>
          <Translate content="qvain.submit" />
        </SubmitButton>
      )
    }

    if (original && original.state === 'draft') {
      // draft -> draft
      submitDraft = (
        <SubmitButton disabled={disabled} onClick={() => this.handleUpdate()}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // draft -> published
      if (original.draft_of) {
        // merge draft of a published dataset
        submitPublished = (
          <SubmitButton disabled={disabled} onClick={() => this.handleMergeDraft()}>
            <Translate content="qvain.submit" />
          </SubmitButton>
        )
      } else {
        // publish draft dataset
        submitPublished = (
          <SubmitButton disabled={disabled} onClick={() => this.handlePublishDataset()}>
            <Translate content="qvain.submit" />
          </SubmitButton>
        )
      }
    }

    if (original && original.state !== 'draft') {
      // published -> draft
      submitDraft = (
        <SubmitButton disabled={disabled} onClick={() => this.handleSaveAsDraft()}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // published -> published
      submitPublished = (
        <SubmitButton disabled={disabled} onClick={() => this.handleUpdate()}>
          <Translate content="qvain.submit" />
        </SubmitButton>
      )
    }

    return (
      <div ref={this.props.submitButtonsRef}>
        {submitDraft}
        {submitPublished}
        {doiModal}
      </div>
    )
  }
}

const SubmitButton = styled(InvertedButton)`
  background: #fff;
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
  border-color: #007fad;
  border: 1px solid;
`

export default withRouter(inject('Stores')(observer(SubmitButtons)))
