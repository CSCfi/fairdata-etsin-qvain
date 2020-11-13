import React, { Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { qvainFormSchema, otherIdentifierSchema } from '../../utils/formValidation'
import handleSubmitToBackend from '../../utils/handleSubmit'
import urls from '../../utils/urls'
import { InvertedButton } from '../../../general/button'
import DoiModal from './doiModal'
import { withStores } from '../../../../stores/stores'

export class SubmitButtons extends Component {
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
    datasetLoading: false,
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise.cancel())
    this.setState({ datasetLoading: false })
  }

  setLoading(value) {
    if (this.state.datasetLoading !== value) {
      this.setState({ datasetLoading: value })
    }
  }

  goToDatasets = identifier => {
    // go to datasets view and highlight published dataset
    const { history } = this.props
    const { setPublishedDataset } = this.props.Stores.QvainDatasets
    setPublishedDataset(identifier)
    history.push('/qvain')
  }

  checkOtherIdentifiersV1 = () => {
    const { OtherIdentifiers } = this.props.Stores.Qvain
    if (OtherIdentifiers.itemStr !== '') {
      try {
        otherIdentifierSchema.validateSync(OtherIdentifiers.itemStr)
      } catch (err) {
        this.props.handleSubmitError(err)
        OtherIdentifiers.setValidationError(err.errors)
        return false
      }
      if (!OtherIdentifiers.storage.includes(OtherIdentifiers.itemStr)) {
        OtherIdentifiers.add(OtherIdentifiers.itemStr)
        OtherIdentifiers.setItemStr('')
        this.success(null)
        return true
      }
      const message = translate('qvain.description.otherIdentifiers.alreadyAdded')
      this.failure({ errors: message })
      OtherIdentifiers.setValidationError(message)
      return false
    }
    return true
  }

  handleCreatePublishedV1 = e => {
    if (this.state.useDoiModalIsOpen) {
      this.closeUseDoiInformation()
    }

    const { Stores, handleSubmitError } = this.props
    const { setChanged } = Stores.Qvain
    const { metaxApiV2 } = Stores.Env

    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    this.setLoading(true)

    if (!this.checkOtherIdentifiersV1()) {
      return false
    }

    const obj = handleSubmitToBackend(this.props.Stores.Env, this.props.Stores.Qvain)
    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .post(urls.v1.datasets(), obj)
          .then(res => {
            setChanged(false)
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
    const { original, moveSelectedToExisting, setChanged, editDataset } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env
    const datasetUrl = urls.v1.dataset(original.identifier)

    if (metaxApiV2) {
      console.error('Wrong Metax API version for function')
      return false
    }

    if (!this.checkOtherIdentifiersV1()) {
      return false
    }

    const obj = handleSubmitToBackend(this.props.Stores.Env, this.props.Stores.Qvain)
    obj.original = original

    this.setLoading(true)

    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .patch(datasetUrl, obj)
          .then(async res => {
            moveSelectedToExisting()
            setChanged(false)
            editDataset(res.data)
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
      original,
      canSelectFiles,
      canRemoveFiles,
      cumulativeState,
      newCumulativeState,
      Files,
    } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env

    if (!this.checkOtherIdentifiersV1()) {
      return false
    }

    const obj = handleSubmitToBackend(this.props.Stores.Env, this.props.Stores.Qvain)
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

      if (newCumulativeState !== undefined && newCumulativeState !== cumulativeState) {
        values.newCumulativeState = newCumulativeState
      }
    }

    return values
  }

  submit = async submitFunction => {
    const { Stores } = this.props
    const isProvenanceActorsOk = await Stores.Qvain.Actors.checkProvenanceActors()
    if (!isProvenanceActorsOk) return
    submitFunction()
  }

  updateFiles = async (identifier, fileActions, metadataActions) => {
    if (fileActions) {
      await axios.post(urls.v2.datasetFiles(identifier), fileActions)
    }
    if (metadataActions) {
      await axios.put(urls.v2.datasetUserMetadata(identifier), metadataActions)
    }
  }

  updateCumulativeState = (identifier, state) =>
    axios.post(urls.v2.rpc.changeCumulativeState(), { identifier, cumulative_state: state })

  patchDataset = async values => {
    const { dataset, fileActions, metadataActions, newCumulativeState } = values
    const { identifier } = dataset.original
    const datasetUrl = urls.v2.dataset(identifier)
    this.setLoading(true)
    const resp = await axios.patch(datasetUrl, dataset)
    await this.updateFiles(identifier, fileActions, metadataActions)

    const cumulativeStateChanged =
      newCumulativeState !== undefined && dataset.cumulativeState !== newCumulativeState
    if (cumulativeStateChanged) {
      await this.updateCumulativeState(identifier, newCumulativeState)
    }

    this.props.Stores.Qvain.setChanged(false)

    if (fileActions || metadataActions || cumulativeStateChanged) {
      // Dataset changed after patch, return updated dataset
      const { data } = await axios.get(datasetUrl)
      return data
    }
    return resp.data
  }

  handleUpdate = async () => {
    // Update existing dataset with the current metadata, add files and file metadata.
    // Return the dataset identifier if successful, otherwise null.

    const { original, editDataset } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env
    if (!metaxApiV2) {
      console.error('Use handleUpdateV1 with API V1')
      return null
    }
    try {
      const values = await this.getSubmitValues()

      this.setLoading(true)
      const dataset = await this.patchDataset(values)
      await editDataset(dataset)

      const data = { ...dataset, is_draft: dataset.state === 'draft' }
      this.success(data)

      if (dataset.state === 'published') {
        this.goToDatasets(original.identifier)
      }

      return original.identifier
    } catch (error) {
      this.failure(error)
      return null
    }
  }

  handleCreateNewDraft = async (showSuccess = true, editResult = true) => {
    // Create new draft dataset
    const { history } = this.props
    const { original, setChanged, editDataset } = this.props.Stores.Qvain
    const { metaxApiV2, getQvainUrl } = this.props.Stores.Env
    if (original) {
      console.error('Use handleCreateNewVersion to create a draft from a published dataset')
      return null
    }

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating drafts')
      return null
    }

    try {
      const { dataset, fileActions, metadataActions } = await this.getSubmitValues()
      if (!dataset) {
        return null
      }
      this.setLoading(true)

      const datasetsUrl = urls.v2.datasets()
      const res = await axios.post(datasetsUrl, dataset, { params: { draft: true } })
      const identifier = res.data.identifier
      await this.updateFiles(identifier, fileActions, metadataActions)
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
    let identifier
    const { getQvainUrl } = this.props.Stores.Env
    try {
      identifier = await this.handleCreateNewDraft(false, false)
      if (identifier) {
        await this.handlePublishDataset(false, identifier)
      }
    } catch (error) {
      if (identifier) {
        this.props.history.replace(getQvainUrl(`/dataset/${identifier}`))
      }
      this.failure(error)
    }
  }

  handleSaveAsDraft = async () => {
    // Create draft of a published dataset, save current changes to the draft
    const { Stores, history } = this.props
    const { original, editDataset } = Stores.Qvain
    const { metaxApiV2, getQvainUrl } = Stores.Env
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
      this.setLoading(true)
      const res = await axios.post(urls.v2.rpc.createDraft(), null, { params: { identifier } })
      const newIdentifier = res.data.identifier

      // Fetch the created draft to make sure identifiers, modification date etc. are correct when updating
      const draftUrl = urls.v2.dataset(newIdentifier)
      const draftResponse = await axios.get(draftUrl)
      const draft = draftResponse.data
      values.dataset.original = draft

      // Update created draft
      const dataset = await this.patchDataset(values)
      await editDataset(dataset)
      history.replace(getQvainUrl(`/dataset/${dataset.identifier}`))
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
    const { original } = Stores.Qvain
    const { metaxApiV2 } = Stores.Env

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
      this.setLoading(true)

      // Save changes to draft before merging
      await this.patchDataset(values)

      // Merge changes to original dataset, delete draft
      const url = urls.v2.rpc.mergeDraft()
      await axios.post(url, null, { params: { identifier } })

      const editUrl = urls.v2.dataset(draftOf)
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
    const { original, editDataset, deprecated } = Stores.Qvain
    const { metaxApiV2, getQvainUrl } = Stores.Env

    if (!metaxApiV2) {
      console.error('Metax API V2 is required for publishing drafts')
      return null
    }

    if (deprecated) {
      this.failure(new Error(translate('qvain.error.deprecated')))
      return null
    }

    const identifier = overrideIdentifier || (original && original.identifier)
    if (!identifier) {
      console.error('Draft needs to be saved before it can be published')
      return null
    }

    // Publishes an unpublished draft dataset
    const url = urls.v2.rpc.publishDataset()

    try {
      if (saveChanges) {
        const values = await this.getSubmitValues()
        this.setLoading(true)

        // Save changes before publishing
        if (saveChanges && !(await this.patchDataset(values))) {
          console.error('Update failed, cancel publish')
          return null
        }
      }

      this.setLoading(true)
      await axios.post(url, null, { params: { identifier } })

      const publishedUrl = urls.v2.dataset(identifier)
      const resp = await axios.get(publishedUrl)

      await editDataset(resp.data)
      history.replace(getQvainUrl(`/dataset/${resp.data.identifier}`))

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
    this.setLoading(false)
  }

  success = data => {
    this.props.handleSubmitResponse(data)
    this.setLoading(false)
  }

  render() {
    const { Stores, submitButtonsRef } = this.props
    const { original, readonly, useDoi } = Stores.Qvain
    const { metaxApiV2 } = Stores.Env
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
              onClick={() => this.submit(this.handleUpdateV1)}
            >
              <Translate content="qvain.edit" />
            </SubmitButton>
          ) : (
            <SubmitButton
              ref={this.submitDatasetButton}
              disabled={disabled}
              type="button"
              onClick={
                useDoi === true
                  ? this.showUseDoiInformation
                  : () => this.submit(this.handleCreatePublishedV1)
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
        <SubmitButton disabled={disabled} onClick={() => this.submit(this.handleCreateNewDraft)}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // new -> published
      submitPublished = (
        <SubmitButton
          disabled={disabled}
          onClick={() => this.submit(this.handleCreateNewDraftAndPublish)}
        >
          <Translate content="qvain.submit" />
        </SubmitButton>
      )
    }

    if (original && original.state === 'draft') {
      // draft -> draft
      submitDraft = (
        <SubmitButton disabled={disabled} onClick={() => this.submit(this.handleUpdate)}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // draft -> published
      if (original.draft_of) {
        // merge draft of a published dataset
        submitPublished = (
          <SubmitButton disabled={disabled} onClick={() => this.submit(this.handleMergeDraft)}>
            <Translate content="qvain.submit" />
          </SubmitButton>
        )
      } else {
        // publish draft dataset
        submitPublished = (
          <SubmitButton disabled={disabled} onClick={() => this.submit(this.handlePublishDataset)}>
            <Translate content="qvain.submit" />
          </SubmitButton>
        )
      }
    }

    if (original && original.state !== 'draft') {
      // published -> draft
      submitDraft = (
        <SubmitButton disabled={disabled} onClick={() => this.submit(this.handleSaveAsDraft)}>
          <Translate content="qvain.saveDraft" />
        </SubmitButton>
      )

      // published -> published
      submitPublished = (
        <SubmitButton disabled={disabled} onClick={() => this.submit(this.handleUpdate)}>
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

export default withRouter(withStores(observer(SubmitButtons)))
