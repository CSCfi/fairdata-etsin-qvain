import React, { Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { qvainFormSchema, otherIdentifierSchema } from './utils/formValidation'
import handleSubmitToBackend from './utils/handleSubmit'
import { DATASET_URLS, FILE_API_URLS } from '../../utils/constants'
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

  goToDatasets = identifier => {
    // go to datasets view and highlight published dataset
    const { history } = this.props
    const { setPublishedDataset } = this.props.Stores.QvainDatasets
    setPublishedDataset(identifier)
    history.push('/qvain')
  }

  checkOtherIdentifiersV1 = () => {
    const {
      otherIdentifier,
      otherIdentifiersArray,
      addOtherIdentifier,
      setOtherIdentifier,
      setOtherIdentifierValidationError,
    } = this.props.Stores.Qvain
    if (otherIdentifier !== '') {
      try {
        otherIdentifierSchema.validateSync(otherIdentifier)
      } catch (err) {
        this.props.handleSubmitError(err)
        setOtherIdentifierValidationError(err.errors)
        return false
      }
      if (!otherIdentifiersArray.includes(otherIdentifier)) {
        addOtherIdentifier(otherIdentifier)
        setOtherIdentifier('')
        this.success(null)
        return true
      }
      const message = translate('qvain.description.otherIdentifiers.alreadyAdded')
      this.failure({ errors: message })
      setOtherIdentifierValidationError(message)
      return false
    }
    return true
  }

  handleCreatePublishedV1 = e => {
    if (this.state.useDoiModalIsOpen) {
      this.closeUseDoiInformation()
    }

    const { Stores, handleSubmitError } = this.props
    const { metaxApiV2, addUnsavedMultiValueFields } = Stores.Qvain

    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    this.setState({ datasetLoading: true })

    addUnsavedMultiValueFields()
    if (!this.checkOtherIdentifiersV1()) {
      return false
    }

    const obj = handleSubmitToBackend(Stores.Qvain)
    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .post(DATASET_URLS.DATASET_URL, obj)
          .then(res => {
            const data = res.data

            if (data && data.identifier) {
              this.goToDatasets(data.identifier)
            }

            this.success({ ...data, is_new: true })
          })
          .catch(handleSubmitError)
      )
      .catch(err => {
        console.error('Error for event: ', e)
        console.error(err.errors)

        this.failure(err)
      })
  }

  handleUpdateV1 = async () => {
    const {
      original,
      metaxApiV2,
      addUnsavedMultiValueFields,
    } = this.props.Stores.Qvain
    const datasetUrl = metaxApiV2 ? DATASET_URLS.V2_DATASET_URL : DATASET_URLS.DATASET_URL

    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    addUnsavedMultiValueFields()
    if (!this.checkOtherIdentifiersV1()) {
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
          .then(async res => {
            this.success(res.data)
            this.goToDatasets(res.data.identifier)
            return true
          })
          .catch(this.failure)
      )
      .catch(err => {
        console.error(err)
        console.error(err.errors)

        // Refreshing error header
        this.failure(err)
      })
  }

  getSubmitValues = async () => {
    // Validate dataset and transform dataset metadata, file actions and metadata changes into format required by the backend.
    const {
      otherIdentifier,
      otherIdentifiersArray,
      addOtherIdentifier,
      setOtherIdentifier,
      setOtherIdentifierValidationError,
      original,
      metaxApiV2,
      canSelectFiles,
      canRemoveFiles,
      addUnsavedMultiValueFields,
      Files,
    } = this.props.Stores.Qvain

    addUnsavedMultiValueFields()
    if (otherIdentifier !== '') {
      try {
        otherIdentifierSchema.validateSync(otherIdentifier)
      } catch (err) {
        this.props.handleSubmitError(err)
        setOtherIdentifierValidationError(err.errors)
        throw new Error(err)
      }
      if (!otherIdentifiersArray.includes(otherIdentifier)) {
        addOtherIdentifier(otherIdentifier)
        setOtherIdentifier('')
        this.success(null)
      } else {
        const message = translate('qvain.description.otherIdentifiers.alreadyAdded')
        setOtherIdentifierValidationError(message)
        throw new Error(message)
      }
    }

    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    await qvainFormSchema.validate(obj, { abortEarly: false })

    const values = {
      dataset: obj,
    }

    if (metaxApiV2) {
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
      await axios.post(`${FILE_API_URLS.V2_DATASET_FILES}${identifier}`, fileActions)
    }
    if (metadataActions) {
      await axios.put(`${FILE_API_URLS.V2_DATASET_USER_METADATA}${identifier}`, metadataActions)
    }
  }

  patchDataset = async values => {
    const datasetUrl = DATASET_URLS.V2_DATASET_URL
    const { dataset, fileActions, metadataActions } = values

    const { identifier } = dataset.original
    this.setState({ datasetLoading: true })

    const resp = await axios.patch(datasetUrl, dataset)
    await this.updateFiles(identifier, fileActions, metadataActions)
    this.props.Stores.Qvain.setChanged(false)

    if (fileActions || metadataActions) {
      // Dataset changed after patch, return updated dataset
      const url = `${DATASET_URLS.V2_EDIT_DATASET_URL}/${identifier}`
      const { data } = await axios.get(url)
      return data
    }
    return resp.data
  }

  handleUpdate = async () => {
    // Update existing dataset with the current metadata, add files and file metadata.
    // Return the dataset identifier if successful, otherwise null.

    const { original, metaxApiV2, editDataset } = this.props.Stores.Qvain
    if (!metaxApiV2) {
      console.error('Use handleUpdateV1 with API V1')
      return null
    }
    try {
      const values = await this.getSubmitValues()

      this.setState({ datasetLoading: true })
      const dataset = await this.patchDataset(values)
      await editDataset(dataset)

      const data = { ...dataset, is_draft: dataset.state === 'draft' }
      this.success(data)

      this.goToDatasets(original.identifier)

      return original.identifier
    } catch (error) {
      this.failure(error)
      return null
    }
  }

  handleCreateNewDraft = async (showSuccess = true, editResult = true) => {
    // Create new draft dataset
    const { Stores, history } = this.props
    const { original, metaxApiV2, setChanged, editDataset } = Stores.Qvain
    if (original) {
      console.error('Use handleCreateNewVersion to create a draft from a published dataset')
      return null
    }

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating drafts')
      return null
    }

    const datasetUrl = DATASET_URLS.V2_DATASET_URL
    try {
      const { dataset, fileActions, metadataActions } = await this.getSubmitValues()
      if (!dataset) {
        return null
      }
      this.setState({ datasetLoading: true })

      const res = await axios.post(datasetUrl, dataset, { params: { draft: true } })
      const identifier = res.data.identifier
      await this.updateFiles(identifier, fileActions, metadataActions)
      setChanged(false)

      if (editResult) {
        if (fileActions || metadataActions) {
          // Files changed, get updated dataset
          const url = `${DATASET_URLS.V2_EDIT_DATASET_URL}/${identifier}`
          const updatedResponse = await axios.get(url)
          await editDataset(updatedResponse.data)
        } else {
          await editDataset(res.data)
        }
      }

      history.replace(`/qvain/dataset/${identifier}`)

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
    const { Stores, history } = this.props
    const { original, metaxApiV2, editDataset } = Stores.Qvain
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
      const res = await axios.post(DATASET_URLS.V2_CREATE_DRAFT, null, { params: { identifier } })
      const newIdentifier = res.data.identifier

      // Fetch the created draft to make sure identifiers, modification date etc. are correct when updating
      const draftUrl = `${DATASET_URLS.V2_EDIT_DATASET_URL}/${newIdentifier}`
      const draftResponse = await axios.get(draftUrl)
      const draft = draftResponse.data
      values.dataset.original = draft

      // Update created draft
      const dataset = await this.patchDataset(values)
      await editDataset(dataset)
      history.replace(`/qvain/dataset/${dataset.identifier}`)
      const data = { ...dataset, is_draft: true }
      this.success(data)
      return newIdentifier
    } catch (err) {
      this.failure(err)
      return null
    }
  }

  handleMergeDraft = async () => {
    const { Stores } = this.props
    const { original, metaxApiV2 } = Stores.Qvain

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
      const url = DATASET_URLS.V2_MERGE_DRAFT
      await axios.post(url, null, { params: { identifier } })

      const editUrl = `${DATASET_URLS.V2_EDIT_DATASET_URL}/${draftOf}`
      const resp = await axios.get(editUrl)

      this.goToDatasets(draftOf)
      this.success(resp.data)
      return draftOf
    } catch (error) {
      this.failure(error)
      return null
    }
  }

  handlePublishDataset = async (saveChanges = true, overrideIdentifier = null) => {
    const { Stores, history } = this.props
    const { original, metaxApiV2, editDataset } = Stores.Qvain

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
    const url = DATASET_URLS.V2_PUBLISH_DATASET

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

      const publishedUrl = `${DATASET_URLS.V2_EDIT_DATASET_URL}/${identifier}`
      const resp = await axios.get(publishedUrl)

      await editDataset(resp.data)
      history.replace(`/qvain/dataset/${resp.data.identifier}`)

      this.success(resp.data)
      this.goToDatasets(resp.data.identifier)
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

  failure = error => {
    this.props.handleSubmitError(error)
    this.setState({
      datasetLoading: false,
    })
  }

  success = data => {
    this.props.handleSubmitResponse(data)
    this.setState({
      datasetLoading: false,
    })
  }

  render() {
    const { Stores, submitButtonsRef } = this.props
    const { original, readonly, metaxApiV2, useDoi } = Stores.Qvain
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
        <div ref={submitButtonsRef}>
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
              onClick={useDoi === true ? this.showUseDoiInformation : this.handleCreatePublishedV1}
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
      <div ref={submitButtonsRef}>
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
