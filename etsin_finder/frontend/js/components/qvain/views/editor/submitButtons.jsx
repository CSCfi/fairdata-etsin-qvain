import React, { Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

import { qvainFormSchema } from '../../utils/formValidation'
import urls from '../../utils/urls'
import DoiModal from './doiModal'
import { withStores } from '../../../../stores/stores'
import SubmitButtonsV1 from './submitButtonsV1'
import SubmitButtonsV2 from './submitButtonsV2'
import handleSubmitToBackend from '../../utils/handleSubmit'

export class SubmitButtons extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmitError: PropTypes.func.isRequired,
    handleSubmitResponse: PropTypes.func.isRequired,
    submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }),
    idSuffix: PropTypes.string,
  }

  static defaultProps = {
    submitButtonsRef: null,
    idSuffix: '',
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

  goToDatasets = identifier => {
    // go to datasets view and highlight published dataset
    const { history } = this.props
    const { setPublishedDataset } = this.props.Stores.QvainDatasets
    setPublishedDataset(identifier)
    history.push('/qvain')
  }

  submit = async submitFunction => {
    const { Stores } = this.props
    const isProvenanceActorsOk = await Stores.Qvain.Actors.checkProvenanceActors()
    if (!isProvenanceActorsOk) return

    this.closeUseDoiInformation()
    this.setLoading(true)
    await submitFunction()
    this.setLoading(false)
  }

  updateCumulativeState = (identifier, state) =>
    axios.post(urls.v2.rpc.changeCumulativeState(), { identifier, cumulative_state: state })

  showUseDoiInformation = () => {
    this.setState({
      useDoiModalIsOpen: true,
    })
  }

  handleCreatePublished = async e => {
    const obj = handleSubmitToBackend(this.props.Stores.Env, this.props.Stores.Qvain)
    return qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() =>
        axios
          .post(urls.v1.datasets(), obj)
          .then(res => {
            this.props.Stores.Qvain.setChanged(false)
            const data = res.data
            if (data && data.identifier) {
              this.goToDatasets(data.identifier)
            }
            this.success({ ...data, is_new: true })
          })
          .catch(this.props.handleSubmitError)
      )
      .catch(err => {
        console.error('Error for event: ', e)
        console.error(err.errors)

        this.failure(err)
      })
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
    const { Stores, submitButtonsRef, idSuffix } = this.props
    const { readonly } = Stores.Qvain
    const { metaxApiV2 } = Stores.Env
    const disabled = readonly || this.state.datasetLoading
    const doiModal = (
      <DoiModal
        isOpen={this.state.useDoiModalIsOpen}
        onAcceptUseDoi={() => this.handleCreatePublished()}
        onRequestClose={this.closeUseDoiInformation}
      />
    )

    const propsBase = {
      submit: this.submit,
      success: this.success,
      failure: this.failure,
      goToDatasets: this.goToDatasets,
      submitButtonsRef,
      doiModal,
      disabled,
    }

    // Metax API v1
    if (!metaxApiV2) {
      const props = {
        ...propsBase,
        showUseDoiInformation: this.showUseDoiInformation,
        handleCreatePublished: this.handleCreatePublished,
      }

      return <SubmitButtonsV1 {...props} />
    }
    const props = {
      ...propsBase,
      history: this.props.history,
      idSuffix,
    }
    return <SubmitButtonsV2 {...props} />
  }
}

export default withRouter(withStores(observer(SubmitButtons)))
