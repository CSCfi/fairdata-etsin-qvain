import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

import { QvainContainer } from './general/card'
import { getResponseError } from './utils/responseError'
import urls from './utils/urls'
import Tracking from '../../utils/tracking'
import ConfirmModal from './editor/confirmDialog'
import Header from './editor/header'
import StickyHeader from './editor/stickyHeader'
import Dataset from './editor/dataset'

class Qvain extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    location: {
      pathname: '/qvain/dataset',
    },
  }

  constructor(props) {
    super(props)
    this.setFocusOnSubmitOrUpdateButton = this.setFocusOnSubmitButton.bind(this)
    this.submitButtonsRef = React.createRef()
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.identifier !== prevProps.match.params.identifier) {
      this.handleIdentifierChanged()
    }
  }

  componentWillUnmount() {
    this.props.Stores.Qvain.resetQvainStore()
    this.props.Stores.Qvain.original = undefined
    this.promises.forEach(promise => promise.cancel())
  }

  getDataset(identifier) {
    this.setState({ datasetLoading: true, datasetError: false, response: null, submitted: false })
    const { resetQvainStore, editDataset } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env

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
          this.props.history.replace(`/qvain/dataset/${nextDraft}`)
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
    }
  }

  getHeaderProps = () => {
    const { datasetLoading, datasetError } = this.state
    return { datasetLoading, datasetError }
  }

  getLooseActorsDialogProps = () => {
    const { orphanActors, promptLooseActors } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    return {
      show: !!promptLooseActors,
      onCancel: () => promptLooseActors(false),
      onConfirm: () => promptLooseActors(true),
      content: {
        warning: (
          <>
            <Translate content={'qvain.general.looseActors.warning'} component="p" />
            <div>
              {(orphanActors || []).map(actor => {
                const actorName = (actor.person || {}).name || actor.organizations[0].name[lang]
                const rolesStr = actor.roles.map(
                  role => `${translate(`qvain.actors.add.checkbox.${role}`)}`
                )
                return `${actorName} / ${rolesStr.join(' / ')}`
              })}
            </div>
            <div style={{ margin: 10 }} />
            <Translate content={'qvain.general.looseActors.question'} style={{ fontWeight: 600 }} />
          </>
        ),
        confirm: <Translate content={'qvain.general.looseActors.confirm'} />,
        cancel: <Translate content={'qvain.general.looseActors.cancel'} />,
      },
    }
  }

  getLooseProvenanceDialogProps = () => {
    const { promptLooseProvenances, provenancesWithNonExistingActors } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    return {
      show: !!promptLooseProvenances,
      onCancel: () => promptLooseProvenances(false),
      onConfirm: () => promptLooseProvenances(true),
      content: {
        warning: (
          <>
            <Translate content={'qvain.general.looseProvenances.warning'} component="p" />
            <div>{provenancesWithNonExistingActors.map(p => p.name[lang] || p.name.und)}</div>
            <div style={{ margin: 10 }} />
            <Translate
              content={'qvain.general.looseProvenances.question'}
              style={{ fontWeight: 600 }}
            />
          </>
        ),
        confirm: <Translate content={'qvain.general.looseProvenances.confirm'} />,
        cancel: <Translate content={'qvain.general.looseProvenances.cancel'} />,
      },
    }
  }

  getStickyHeaderProps = () => {
    const { datasetLoading, datasetError, submitted, response } = this.state
    return {
      datasetLoading,
      datasetError,
      submitted,
      response,
      handleSubmitError: this.handleSubmitError,
      handleSubmitResponse: this.handleSubmitResponse,
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
    // Title text
    return (
      <QvainContainer>
        <Header {...this.getHeaderProps()} />
        <StickyHeader {...this.getStickyHeaderProps()} />
        <Dataset {...this.getDatasetProps()} />
        <ConfirmModal {...this.getLooseActorsDialogProps()} />
        <ConfirmModal {...this.getLooseProvenanceDialogProps()} />
      </QvainContainer>
    )
  }
}

export default withRouter(inject('Stores')(observer(Qvain)))
