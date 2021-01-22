import React, { Component } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Prompt } from 'react-router'
import Translate from 'react-translate-component'

import { QvainContainer } from '../../general/card'
import { getResponseError } from '../../utils/responseError'
import urls from '../../utils/urls'
import Tracking from '../../../../utils/tracking'
import Header from '../editor/header'
import StickyHeader from '../editor/stickyHeader'
import Dataset from '../editor/dataset'
import LooseActorDialog from '../editor/looseActorDialog'
import LooseProvenanceDialog from '../editor/looseProvenanceDialog'
import { withStores } from '../../utils/stores'

// Event handler to prevent page reload
const confirmReload = e => {
  e.preventDefault()
  e.returnValue = ''
}

export class Qvain extends Component {
  promises = []

  disposeConfirmReload = null

  setFocusOnSubmitOrUpdateButton = this.setFocusOnSubmitButton.bind(this)

  submitButtonsRef = React.createRef()

  setFocusOnSubmitButton = this.setFocusOnSubmitButton.bind(this)

  submitButtonsRef = React.createRef()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    response: null,
    submitted: false,
    haveDataset: false,
    datasetLoading: false,
    datasetError: false,
    datasetErrorTitle: null,
    datasetErrorDetails: null,
  }

  componentDidMount() {
    this.handleIdentifierChanged()
    // setInterval(() => this.props.Stores.Qvain.setChanged(false), 100)

    // Prevent reload when there are unsaved changes
    this.disposeConfirmReload = autorun(() => {
      const { changed } = this.props.Stores.Qvain
      if (changed) {
        window.addEventListener('beforeunload', confirmReload)
      } else {
        window.removeEventListener('beforeunload', confirmReload)
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.identifier !== prevProps.match.params.identifier) {
      this.handleIdentifierChanged()
    }
  }

  componentWillUnmount() {
    this.props.Stores.Qvain.resetQvainStore()
    this.promises.forEach(promise => promise.cancel())
    if (this.disposeConfirmReload) {
      this.disposeConfirmReload()
    }
  }

  getDataset(identifier) {
    this.setState({ datasetLoading: true, datasetError: false, response: null, submitted: false })
    const { resetQvainStore, editDataset } = this.props.Stores.Qvain
    const { metaxApiV2, getQvainUrl } = this.props.Stores.Env

    let url = urls.v1.dataset(identifier)
    if (metaxApiV2) {
      url = urls.v2.dataset(identifier)
    }
    const promise = axios
      .get(url)
      .then(result => {
        resetQvainStore()

        // Open draft instead if it exists
        const nextDraft = result.data.next_draft && result.data.next_draft.identifier
        if (nextDraft) {
          this.props.history.replace(getQvainUrl(`/dataset/${nextDraft}`))
        } else {
          editDataset(result.data)
          this.setState({ datasetLoading: false, datasetError: false, haveDataset: true })
        }
      })
      .catch(e => {
        const status = e.response.status

        let errorTitle, errorDetails
        if (status === 401 || status === 403) {
          errorTitle = translate('qvain.error.permission')
        } else if (status === 404) {
          errorTitle = translate('qvain.error.missing')
        } else {
          errorTitle = translate('qvain.error.default')
        }

        if (typeof e.response.data === 'object') {
          const values = Object.values(e.response.data)
          if (values.length === 1) {
            errorDetails = values[0]
          } else {
            errorDetails = JSON.stringify(e.response.data, null, 2)
          }
        } else {
          errorDetails = e.response.data
        }
        if (!errorDetails) {
          errorDetails = e.message
        }

        this.setState({
          datasetLoading: false,
          datasetError: true,
          datasetErrorTitle: errorTitle,
          datasetErrorDetails: errorDetails,
          haveDataset: false,
        })
      })
    this.promises.push(promise)
    return promise
  }

  setFocusOnSubmitButton(event) {
    const buttons = this.submitButtonsRef.current
    if (buttons && buttons.firstElementChild) {
      buttons.firstElementChild.focus()
    }
    event.preventDefault()
  }

  clearSubmitResponse = () => {
    const { clearResponse, setError } = this.props.Stores.Qvain.Submit
    clearResponse()
    setError(null)
    this.setState({
      response: null,
      submitted: false,
      datasetLoading: false,
      datasetError: false,
      datasetErrorTitle: null,
      datasetErrorDetails: null,
    })
  }

  handleSubmitResponse = response => {
    this.setState({
      datasetLoading: false,
      submitted: true,
      response,
    })
  }

  handleSubmitError = err => {
    if (err.errors) {
      // Validation error
      this.setState({
        datasetLoading: false,
        submitted: true,
        response: err.errors,
      })
      return
    }
    if (!err.response) {
      console.error(err)
    }
    this.setState({
      datasetLoading: false,
      submitted: true,
      response: getResponseError(err),
    })
  }

  handleRetry = () => {
    this.setState({ datasetLoading: false, haveDataset: true })
    this.handleIdentifierChanged()
  }

  getDatasetProps = () => {
    const { datasetError, haveDataset, datasetErrorDetails, datasetErrorTitle } = this.state

    return {
      datasetError,
      haveDataset,
      datasetErrorDetails,
      datasetErrorTitle,
      handleRetry: this.handleRetry,
      setFocusOnSubmitButton: this.setFocusOnSubmitButton,
      handleSubmitError: this.handleSubmitError,
      handleSubmitResponse: this.handleSubmitResponse,
    }
  }

  getHeaderProps = () => {
    const { datasetLoading, datasetError } = this.state
    return { datasetLoading, datasetError }
  }

  getStickyHeaderProps = () => {
    const { metaxApiV2 } = this.props.Stores.Env
    const { error, response: responseV2, isLoading } = this.props.Stores.Qvain.Submit
    const { datasetLoading, datasetError, submitted, response } = this.state

    return {
      datasetLoading: metaxApiV2 ? isLoading : datasetLoading,
      datasetError,
      submitted: metaxApiV2 ? !!error || !!responseV2 : submitted,
      response: metaxApiV2 ? error || responseV2 : response,
      handleSubmitError: this.handleSubmitError,
      handleSubmitResponse: this.handleSubmitResponse,
      clearSubmitResponse: this.clearSubmitResponse,
      submitButtonsRef: this.submitButtonsRef,
    }
  }

  handleIdentifierChanged() {
    if (this.datasetLoading) {
      return
    }
    const identifier = this.props.match.params.identifier
    const { original } = this.props.Stores.Qvain
    Tracking.newPageView(
      !original ? 'Qvain Create Dataset' : 'Qvain Edit Dataset',
      this.props.location.pathname
    )

    // Test if we need to load a dataset or do we use the one currently in store
    if (identifier && !(original && original.identifier === identifier)) {
      this.getDataset(identifier)
    } else {
      this.setState({ datasetLoading: false, haveDataset: true })
    }
  }

  render() {
    const { changed } = this.props.Stores.Qvain
    return (
      <QvainContainer>
        <Header {...this.getHeaderProps()} />
        <StickyHeader {...this.getStickyHeaderProps()} />
        <Dataset {...this.getDatasetProps()} />
        <LooseActorDialog />
        <LooseProvenanceDialog />
        <Translate
          component={Prompt}
          when={changed}
          attributes={{ message: 'qvain.unsavedChanges' }}
        />
      </QvainContainer>
    )
  }
}

export default withRouter(withStores(observer(Qvain)))
