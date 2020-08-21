import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Prompt } from 'react-router'

import {
  STSD,
  SubHeaderTextContainer,
  LinkBackContainer,
  LinkBack,
  ButtonContainer,
  SubmitButton,
  Form,
  SubmitContainer,
  LinkText,
  CustomSubHeader,
} from './styledComponents'
import { ErrorContainer, ErrorLabel, ErrorContent, ErrorButtons } from './general/errors'

import RightsAndLicenses from './licenses'
import Description from './description'
import Actors from './actors'
import Files from './files'
import TemporalAndSpatial from './temporalAndSpatial'
import History from './history'
import {
  QvainContainer,
  SubHeader,
  StickySubHeaderWrapper,
  StickySubHeader,
  StickySubHeaderResponse,
  SubHeaderText,
} from './general/card'
import { getResponseError } from './utils/responseError'
import Title from './general/title'
import SubmitResponse from './general/submitResponse'
import { Button } from '../general/button'
import DeprecatedState from './deprecatedState'
import PasState from './pasState'
import SubmitButtons from './submitButtons'
import urls from './utils/urls'
import Tracking from '../../utils/tracking'

// Event handler to prevent page reload
const confirmReload = e => {
  e.preventDefault()
  e.returnValue = ''
}

class Qvain extends Component {
  promises = []

  disposeConfirmReload = null

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
    this.props.Stores.Qvain.original = undefined
    this.promises.forEach(promise => promise.cancel())
    if (this.disposeConfirmReload) {
      this.disposeConfirmReload()
    }
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
      .then((result) => {
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
      .catch((e) => {
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

  handleSubmitResponse = (response) => {
    this.setState({
      datasetLoading: false,
      submitted: true,
      response,
    })
  }

  handleSubmitError = (err) => {
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
    const { original, changed } = this.props.Stores.Qvain
    // Title text
    let titleKey
    if (this.state.datasetLoading) {
      titleKey = 'qvain.titleLoading'
    } else if (this.state.datasetError) {
      titleKey = 'qvain.titleLoadingFailed'
    } else if (original) {
      titleKey = 'qvain.titleEdit'
    } else {
      titleKey = 'qvain.titleCreate'
    }

    const createLinkBack = (position) => (
      <LinkBackContainer position={position}>
        <LinkBack to="/qvain">
          <FontAwesomeIcon size="lg" icon={faChevronLeft} />
          <Translate component={LinkText} display="block" content="qvain.backLink" />
        </LinkBack>
      </LinkBackContainer>
    )

    // Sticky header content
    let stickyheader
    if (this.state.datasetError) {
      stickyheader = null
    } else if (this.state.datasetLoading) {
      stickyheader = (
        <StickySubHeaderWrapper>
          <StickySubHeader>
            <ButtonContainer>
              <SubmitButton disabled>
                <Translate content="qvain.titleLoading" />
              </SubmitButton>
            </ButtonContainer>
          </StickySubHeader>
          <StickySubHeaderResponse>
            <SubmitResponse response={null} />
          </StickySubHeaderResponse>
        </StickySubHeaderWrapper>
      )
    } else {
      stickyheader = (
        <StickySubHeaderWrapper>
          <CustomSubHeader>
            {createLinkBack('left')}
            <ButtonContainer>
              <SubmitButtons
                handleSubmitError={this.handleSubmitError}
                handleSubmitResponse={this.handleSubmitResponse}
                submitButtonsRef={this.submitButtonsRef}
              />
            </ButtonContainer>
          </CustomSubHeader>
          <PasState />
          <DeprecatedState />
          {this.state.submitted ? (
            <StickySubHeaderResponse>
              <SubmitResponse response={this.state.response} />
            </StickySubHeaderResponse>
          ) : null}
        </StickySubHeaderWrapper>
      )
    }

    // Dataset form
    let dataset
    if (this.state.datasetError) {
      dataset = (
        <div className="container">
          <ErrorContainer>
            <ErrorLabel>{this.state.datasetErrorTitle}</ErrorLabel>
            <ErrorContent>{this.state.datasetErrorDetails}</ErrorContent>
            <ErrorButtons>
              <Button onClick={this.handleRetry}>Retry</Button>
            </ErrorButtons>
          </ErrorContainer>
        </div>
      )
    } else if (!this.state.haveDataset) {
      dataset = null
    } else {
      dataset = (
        <Form className="container">
          <Description />
          <Actors />
          <RightsAndLicenses />
          <TemporalAndSpatial />
          <History />
          <Files />
          <SubmitContainer>
            <Translate component="p" content="qvain.consent" unsafe />
          </SubmitContainer>
          <STSD onClick={this.setFocusOnSubmitButton}>
            <Translate content="stsd" />
          </STSD>
        </Form>
      )
    }

    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderTextContainer>
            <SubHeaderText>
              <Translate component={Title} content={titleKey} />
            </SubHeaderText>
          </SubHeaderTextContainer>
        </SubHeader>
        {stickyheader}
        {dataset}
        <Translate
          component={Prompt}
          when={changed}
          attributes={{ message: 'qvain.unsavedChanges' }}
        />
      </QvainContainer>
    )
  }
}

export default withRouter(inject('Stores')(observer(Qvain)))
