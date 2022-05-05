import React, { Component } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Prompt } from 'react-router'
import Translate from 'react-translate-component'

import queryParam from '@/utils/queryParam'
import { QvainContainer } from '../../general/card'
import ErrorBoundary from '../../../general/errorBoundary'
import urls from '../../../../utils/urls'
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

  setFocusOnSubmitButton = this.setFocusOnSubmitButton.bind(this)

  submitButtonsRef = React.createRef()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    haveDataset: false,
    datasetLoading: false,
    datasetError: false,
    datasetErrorTitle: null,
    datasetErrorDetails: null,
    renderFailed: false,
  }

  componentDidMount() {
    this.handleIdentifierChanged()

    // Prevent reload when there are unsaved changes
    this.disposeConfirmReload = autorun(() => {
      const { changed } = this.props.Stores.Qvain
      if (changed) {
        window.addEventListener('beforeunload', confirmReload)
      } else {
        window.removeEventListener('beforeunload', confirmReload)
      }
    })

    // Attempt to release lock when window is closed, won't work on mobile
    window.addEventListener('unload', this.props.Stores.Qvain.Lock?.unload)
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

    window.removeEventListener('unload', this.props.Stores.Qvain.Lock?.unload)
  }

  async handleIdentifierChanged() {
    if (this.state.datasetLoading) {
      return
    }
    const { original } = this.props.Stores.Qvain
    const matchIdentifier = this.props.match.params.identifier
    let identifier = matchIdentifier
    let isTemplate = false
    const {
      Matomo: { recordEvent },
    } = this.props.Stores

    if (identifier) {
      recordEvent(`DATASET / ${identifier}`)
    } else {
      const templateIdentifier = this.getTemplateIdentifier()
      if (templateIdentifier) {
        identifier = templateIdentifier
        isTemplate = true
        recordEvent(`TEMPLATE / ${templateIdentifier}`)
      } else {
        recordEvent('DATASET')
      }
    }

    // Test if we need to load a dataset or do we use the one currently in store
    if (identifier && !(original && original.identifier === identifier)) {
      await this.getDataset(identifier, { isTemplate })
    } else {
      this.setState({ datasetLoading: false, haveDataset: true })
    }
  }

  getTemplateIdentifier() {
    return queryParam(this.props.Stores.Env.history.location, 'template')
  }

  setFocusOnSubmitButton(event) {
    const buttons = this.submitButtonsRef.current
    if (buttons && buttons.firstElementChild) {
      buttons.firstElementChild.focus()
    }
    event.preventDefault()
  }

  getDataset(identifier, { isTemplate = false } = {}) {
    this.setState({ datasetLoading: true, datasetError: false })

    const { resetQvainStore, editDataset, resetWithTemplate } = this.props.Stores.Qvain

    const {
      getQvainUrl,
      Flags: { flagEnabled },
    } = this.props.Stores.Env

    const url = urls.qvain.dataset(identifier)
    const promise = axios
      .get(url)
      .then(async result => {
        resetQvainStore()

        // Open draft instead if it exists
        const nextDraft = result.data.next_draft && result.data.next_draft.identifier
        if (nextDraft) {
          this.props.history.replace(getQvainUrl(`/dataset/${nextDraft}`))
        } else {
          if (isTemplate) {
            resetWithTemplate(result.data)
          } else {
            editDataset(result.data)
          }
          if (flagEnabled('PERMISSIONS.WRITE_LOCK')) {
            try {
              await Promise.all(this.props.Stores.Qvain.Lock.promises)
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }

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

  handleRetry = () => {
    this.setState({ datasetLoading: false, haveDataset: true })
    return this.handleIdentifierChanged()
  }

  getDatasetProps = () => {
    const { datasetError, haveDataset, datasetErrorDetails, datasetErrorTitle } = this.state

    return {
      haveDataset,
      datasetError,
      datasetErrorDetails,
      datasetErrorTitle,
      handleRetry: this.handleRetry,
      setFocusOnSubmitButton: this.setFocusOnSubmitButton,
    }
  }

  getHeaderProps = () => {
    const { datasetLoading, datasetError } = this.state
    return { datasetLoading, datasetError }
  }

  getStickyHeaderProps = () => {
    const { datasetError, renderFailed } = this.state

    return {
      datasetError,
      submitButtonsRef: this.submitButtonsRef,
      hideSubmitButtons: renderFailed,
    }
  }

  enableRenderFailed = () => {
    this.setState({ renderFailed: true })
  }

  render() {
    const { changed } = this.props.Stores.Qvain
    return (
      <QvainContainer>
        <Header {...this.getHeaderProps()} />
        <StickyHeader {...this.getStickyHeaderProps()} datasetLoading />

        <ErrorBoundary title={ErrorTitle()} callback={this.enableRenderFailed}>
          <Dataset {...this.getDatasetProps()} />
        </ErrorBoundary>
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

export const ErrorTitle = () => <Translate component="h2" content="qvain.error.render" />

export default withRouter(withStores(observer(Qvain)))
