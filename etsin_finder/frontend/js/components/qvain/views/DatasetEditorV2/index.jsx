import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import {
  SkipToSubmitDataset,
  Form,
  SubmitContainer,
  DisableImplicitSubmit,
  Right,
  Separator,
} from './editor.styled'
import { ErrorContainer, ErrorLabel, ErrorContent, ErrorButtons } from '../../general/errors'
import { Button } from '../../../general/button'
import SubmitButtons from '../headers/submitButtons'

import Unsupported from './Unsupported'
import DataOrigin from '../../sections/DataOrigin'
import Description from '../../sections/Description'
import Actors from '../../sections/Actors'
import Publications from '../../sections/Publications'
import Geographics from '../../sections/Geographics'
import TimePeriod from '../../sections/TimePeriod'
import Infrastructure from '../../sections/Infrastructure'
import History from '../../sections/History'
import Project from '../../sections/Project'
import ProjectV3 from '../../sections/ProjectV3'
import FlaggedComponent from '@/components/general/flaggedComponent'
import ModalManager from '../../general/V3/modal/ModalManager.v3'

export const Dataset = ({
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
      <DisableImplicitSubmit />
      <FlaggedComponent flag="UI.SHOW_UNSUPPORTED">
        <Unsupported />
      </FlaggedComponent>
      <DataOrigin />
      <Description />
      <Actors />
      <Separator />
      <Publications />
      <Geographics />
      <TimePeriod />
      <Infrastructure />
      <History />
      <FlaggedComponent flag="QVAIN.METAX_V3.FRONTEND" whenDisabled={<Project />}>
        <ProjectV3 />
      </FlaggedComponent>
      <SubmitContainer>
        <Translate component="p" content="qvain.consent" unsafe />
      </SubmitContainer>
      <Right>
        <SubmitButtons idSuffix="-bottom" />
      </Right>
      <SkipToSubmitDataset onClick={setFocusOnSubmitButton}>
        <Translate content="stsd" />
      </SkipToSubmitDataset>
      <ModalManager />
    </Form>
  )
}

Dataset.propTypes = {
  datasetError: PropTypes.bool.isRequired,
  haveDataset: PropTypes.bool.isRequired,
  handleRetry: PropTypes.func.isRequired,
  setFocusOnSubmitButton: PropTypes.func.isRequired,
  datasetErrorTitle: PropTypes.node,
  datasetErrorDetails: PropTypes.node,
}

Dataset.defaultProps = {
  datasetErrorTitle: null,
  datasetErrorDetails: null,
}

export default Dataset
