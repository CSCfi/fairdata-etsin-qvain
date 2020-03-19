import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { withRouter, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

import RightsAndLicenses from './licenses'
import Description from './description'
import Actors from './actors'
import { qvainFormSchema } from './utils/formValidation'
import Files from './files'
import {
  QvainContainer,
  SubHeader,
  StickySubHeaderWrapper,
  StickySubHeader,
  StickySubHeaderResponse,
  SubHeaderText,
  Container
} from './general/card'
import handleSubmitToBackend from './utils/handleSubmit'
import { getResponseError } from './utils/responseError'
import Title from './general/title'
import SubmitResponse from './general/submitResponse'
import { Button, InvertedButton } from '../general/button'
import Modal from '../general/modal'
import DeprecatedState from './deprecatedState';
import PasState from './pasState'

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '800px',
    padding: '3em',
  },
}

const EDIT_DATASET_URL = '/api/datasets/edit'

class Qvain extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.setFocusOnSubmitOrUpdateButton = this.setFocusOnSubmitOrUpdateButton.bind(this);
    this.submitDatasetButton = React.createRef();
    this.updateDatasetButton = React.createRef();
    this.showUseDoiInformation = this.showUseDoiInformation.bind(this)
    this.closeUseDoiInformation = this.closeUseDoiInformation.bind(this)
    this.acceptDoi = this.acceptDoi.bind(this)
  }

  state = {
    response: null,
    submitted: false,
    haveDataset: false,
    datasetLoading: false,
    datasetError: false,
    datasetErrorTitle: null,
    datasetErrorDetails: null,
    useDoiModalIsOpen: false,
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
    const url = `${EDIT_DATASET_URL}/${identifier}`
    const promise = axios
      .get(url)
      .then(result => {
        resetQvainStore()
        editDataset(result.data)
        this.setState({ datasetLoading: false, datasetError: false, haveDataset: true })
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

  setFocusOnSubmitOrUpdateButton(event) {
    if (this.props.Stores.Qvain.original) {
      this.updateDatasetButton.current.focus()
    } else {
      this.submitDatasetButton.current.focus()
    }
    // preventDefault, since the page wants to refresh at this point
    event.preventDefault();
  }

  handlePublishError = err => {
    if (!err.response) {
      console.error(err)
    }
    this.setState({
      response: getResponseError(err)
    })
  }

  handleCreate = e => {
    // e.preventDefault()
    this.setState({ submitted: true })
    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() => {
        axios
          .post('/api/dataset', obj)
          .then(res => {
            const data = res.data
            this.setState({ response: { ...data, is_new: true } })
            // Open the created dataset without reloading the editor
            if (data && data.identifier) {
              this.props.Stores.Qvain.resetQvainStore()
              this.props.Stores.Qvain.editDataset(data)
              this.props.history.replace(`/qvain/dataset/${data.identifier}`)
            }
          })
          .catch(this.handlePublishError)
      })
      .catch(err => {
        console.log(err.errors)

        // Refreshing error header
        this.setState({ response: null })
        this.setState({ response: err.errors })
      })
  }

  handleRetry = () => {
    this.setState({ datasetLoading: false, haveDataset: true })
    this.handleIdentifierChanged()
  }

  handleUpdate = e => {
    e.preventDefault()
    this.setState({ submitted: true })
    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    obj.original = this.props.Stores.Qvain.original
    qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(() => {
        axios
          .patch('/api/dataset', obj)
          .then(res => {
            this.props.Stores.Qvain.moveSelectedToExisting()
            this.props.Stores.Qvain.setChanged(false)
            this.props.Stores.Qvain.editDataset(res.data)
            this.setState({ response: res.data })
          })
          .catch(this.handlePublishError)
      })
      .catch(err => {
        console.log(err.errors)

        // Refreshing error header
        this.setState({ response: null })
        this.setState({ response: err.errors })
      })
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

  showUseDoiInformation() {
    this.setState({
      useDoiModalIsOpen: true
    })
  }

  acceptDoi() {
    this.closeUseDoiInformation()
    this.handleCreate()
  }

  closeUseDoiInformation() {
    this.setState({
      useDoiModalIsOpen: false
    })
  }

  render() {
    const { original, readonly } = this.props.Stores.Qvain
    // Title text
    let titleKey
    if (this.state.datasetLoading) {
      titleKey = 'qvain.titleLoading'
    } else if (this.state.datasetError) {
      titleKey = 'qvain.titleLoadingFailed'
    } else {
      titleKey = original ? 'qvain.titleEdit' : 'qvain.titleCreate'
    }

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
          <StickySubHeader>
            <ButtonContainer>
              {original
                ? (
                  <SubmitButton ref={this.updateDatasetButton} disabled={readonly} type="button" onClick={this.handleUpdate}>
                    <Translate content="qvain.edit" />
                  </SubmitButton>
                )
                : (
                  <SubmitButton
                    ref={this.submitDatasetButton}
                    type="button"
                    onClick={this.props.Stores.Qvain.useDoi === true ? this.showUseDoiInformation : this.handleCreate}
                  >
                    <Translate content="qvain.submit" />
                  </SubmitButton>
                )
              }
            </ButtonContainer>
          </StickySubHeader>
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
            <ErrorLabel>
              {this.state.datasetErrorTitle}
            </ErrorLabel>
            <ErrorContent>
              {this.state.datasetErrorDetails}
            </ErrorContent>
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
          <Modal
            isOpen={this.state.useDoiModalIsOpen}
            onRequestClose={this.closeUseDoiInformation}
            customStyles={customStyles}
            contentLabel="UseDoiModalInformation"
          >
            <Translate content="qvain.useDoiHeader" component="h2" />
            <Translate content="qvain.useDoiContent" component="p" />
            <Button
              onClick={this.acceptDoi}
            >
              <Translate content="qvain.useDoiAffirmative" component="span" />
            </Button>
            <Button
              onClick={this.closeUseDoiInformation}
            >
              <Translate content="qvain.useDoiNegative" component="span" />
            </Button>
          </Modal>
          <Description />
          <Actors />
          <RightsAndLicenses />
          <Files />
          <SubmitContainer>
            <Translate component="p" content="qvain.consent" unsafe />
          </SubmitContainer>
          <STSD onClick={this.setFocusOnSubmitOrUpdateButton}>
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
          <LinkBackContainer>
            <LinkBack to="/qvain">
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              <Translate component="span" display="block" content="qvain.backLink" />
            </LinkBack>
          </LinkBackContainer>
        </SubHeader>
        {stickyheader}
        {dataset}
      </QvainContainer>
    )
  }
}

const STSD = styled.button`
    background: ${p => p.theme.color.primary};
    color: #fafafa;
    max-height: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    letter-spacing: 2px;
    transition: 0.2s ease;
    &:focus {
    text-decoration: underline;
    padding: 0.5em;
    max-height: 3em;
    }
`
const SubHeaderTextContainer = styled.div`
  white-space: nowrap;
`
const LinkBackContainer = styled.div`
  text-align: right;
  width: 100%;
  white-space: nowrap;
`
const LinkBack = styled(Link)`
  color: #fff;
  margin-right: 40px;
`
const ButtonContainer = styled.div`
  text-align: center;
  padding-top: 2px;
`
const SubmitButton = styled(InvertedButton)`
  background: #fff;
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
  border-color: #007fad;
  border: 1px solid;
`
const Form = styled.form`
  margin-bottom: 20px;
`
const SubmitContainer = styled(Container)`
  padding-bottom: 25px;
  margin: 15px;
`

const ErrorContainer = styled(Container)`
  background-color: #FFEBE8;
  border-bottom: 1px solid rgba(0,0,0,0.3);
`

const ErrorLabel = styled.p`
  font-weight: bold;
  display: inline-block;
  vertical-align: top;
`

const ErrorContent = styled.div`
  max-width: 1140px;
  width: 100%;
  text-align: left;
  display: inline-block;
  white-space: pre-line;
`

const ErrorButtons = styled.div`
  margin-bottom: -2em;
  margin-top: 1em;
  > button:first-child {
    margin: 0
  }
`

export default withRouter(inject('Stores')(observer(Qvain)))
