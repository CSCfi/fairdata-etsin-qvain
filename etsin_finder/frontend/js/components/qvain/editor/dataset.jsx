import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { STSD, Form, SubmitContainer } from './editor.styled'
import { ErrorContainer, ErrorLabel, ErrorContent, ErrorButtons } from '../general/errors'
import { Button } from '../../general/button'

import RightsAndLicenses from '../licenses'
import Description from '../description'
import Actors from '../actors'
import Files from '../files'
import TemporalAndSpatial from '../temporalAndSpatial'
import History from '../history'
import Project from '../project'

const Dataset = ({
  datasetError,
  haveDataset,
  datasetErrorTitle,
  datasetErrorDetails,
  handleRetry,
  setFocusOnSubmitButton,
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
      <Description />
      <Actors />
      <RightsAndLicenses />
      <TemporalAndSpatial />
      <History />
      <Project />
      <Files />
      <SubmitContainer>
        <Translate component="p" content="qvain.consent" unsafe />
      </SubmitContainer>
      <STSD onClick={setFocusOnSubmitButton}>
        <Translate content="stsd" />
      </STSD>
    </Form>
  )
}

Dataset.propTypes = {
  datasetError: PropTypes.bool.isRequired,
  haveDataset: PropTypes.bool.isRequired,
  datasetErrorTitle: PropTypes.node,
  datasetErrorDetails: PropTypes.node,
  handleRetry: PropTypes.func.isRequired,
  setFocusOnSubmitButton: PropTypes.func.isRequired,
}

Dataset.defaultProps = {
  datasetErrorTitle: null,
  datasetErrorDetails: null,
}

export default Dataset
