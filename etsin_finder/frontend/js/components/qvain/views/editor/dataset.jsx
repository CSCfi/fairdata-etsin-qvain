import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { SkipToSubmitDataset, Form, SubmitContainer, DisableImplicitSubmit } from './editor.styled'
import { ErrorContainer, ErrorLabel, ErrorContent, ErrorButtons } from '../../general/errors'
import FlaggedComponent from '../../../general/flaggedComponent'
import { Button } from '../../../general/button'
import SubmitButtons from './submitButtons'

import RightsAndLicenses from '../../fields/licenses'
import Description from '../../fields/description'
import Actors from '../../fields/actors'
import Files from '../../fields/files'
import TemporalAndSpatial from '../../fields/temporalAndSpatial'
import History from '../../fields/history'
import Project from '../../fields/project'

const Dataset = ({
  datasetError,
  haveDataset,
  datasetErrorTitle,
  datasetErrorDetails,
  handleRetry,
  setFocusOnSubmitButton,
  handleSubmitError,
  handleSubmitResponse,
}) => {
  if (datasetError) {
    return (
      <div className="container">
        <ErrorContainer>
          <ErrorLabel>{datasetErrorTitle}</ErrorLabel>
          <ErrorContent>{datasetErrorDetails}</ErrorContent>
          <ErrorButtons>
            <Button onClick={handleRetry}>Retry</Button>
          </ErrorButtons>
        </ErrorContainer>
      </div>
    )
  }
  if (!haveDataset) {
    return null
  }
  return (
    <Form className="container">
      <DisableImplicitSubmit />
      <Description />
      <Actors />
      <RightsAndLicenses />
      <TemporalAndSpatial />
      <History />
      <Project />
      <Files />
      <SubmitContainer>
        <Translate component="p" content="qvain.consent" unsafe />
        <FlaggedComponent flag="UI.BOTTOM_SUBMIT_BUTTONS">
          <Center>
            <SubmitButtons
              handleSubmitError={handleSubmitError}
              handleSubmitResponse={handleSubmitResponse}
              idSuffix="-bottom"
            />
          </Center>
        </FlaggedComponent>
      </SubmitContainer>
      <SkipToSubmitDataset onClick={setFocusOnSubmitButton}>
        <Translate content="stsd" />
      </SkipToSubmitDataset>
    </Form>
  )
}

Dataset.propTypes = {
  datasetError: PropTypes.bool.isRequired,
  haveDataset: PropTypes.bool.isRequired,
  datasetErrorTitle: PropTypes.node,
  datasetErrorDetails: PropTypes.node,
  handleRetry: PropTypes.func.isRequired,
  handleSubmitError: PropTypes.func.isRequired,
  handleSubmitResponse: PropTypes.func.isRequired,
  setFocusOnSubmitButton: PropTypes.func.isRequired,
}

Dataset.defaultProps = {
  datasetErrorTitle: null,
  datasetErrorDetails: null,
}

const Center = styled.div`
  display: flex;
  justify-content: center;
`

export default Dataset
