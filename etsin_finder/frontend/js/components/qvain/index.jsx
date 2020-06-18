import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
import { DatasetUrls } from './utils/constants'

class Qvain extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
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
    this.promises.forEach((promise) => promise.cancel())
  }

  getDataset(identifier) {
    this.setState({ datasetLoading: true, datasetError: false, response: null, submitted: false })
    const { metaxApiV2, resetQvainStore, editDataset } = this.props.Stores.Qvain

    let url = `${DatasetUrls.EDIT_DATASET_URL}/${identifier}`
    if (metaxApiV2) {
      url = `${DatasetUrls.V2_EDIT_DATASET_URL}/${identifier}`
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

    // Test if we need to load a dataset or do we use the one currently in store
    if (identifier && !(original && original.identifier === identifier)) {
      this.getDataset(identifier)
    } else {
      this.setState({ datasetLoading: false, haveDataset: true })
    }
  }

  render() {
    const { original } = this.props.Stores.Qvain
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
      </QvainContainer>
    )
  }
}

export default withRouter(inject('Stores')(observer(Qvain)))
