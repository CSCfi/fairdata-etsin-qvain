import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Translate from '@/utils/Translate'
import {
  Form,
  SubmitContainer,
  DisableImplicitSubmit,
  Separator,
  SubmitButtonsWrapper,
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
import ProjectV3 from '../../sections/ProjectV3'
import FlaggedComponent from '@/components/general/flaggedComponent'
import ModalManager from '../../general/V3/modal/ModalManager.v3'
import { useStores } from '@/stores/stores'
import AdminOrgSelector from '../../sections/AdminOrg'
import OwnerBanner from '../../sections/OwnerBanner'

export const Dataset = ({ datasetError, datasetErrorTitle, datasetErrorDetails, handleRetry }) => {
  const {
    Qvain: { datasetLoading },
    Locale: { translate },
  } = useStores()
  if (datasetError) {
    return (
      <div className="container">
        <ErrorContainer>
          <ErrorLabel>{datasetErrorTitle}</ErrorLabel>
          <ErrorContent>{datasetErrorDetails}</ErrorContent>
          <ErrorButtons>
            <Button onClick={handleRetry}>{translate('qvain.error.retry')}</Button>
          </ErrorButtons>
        </ErrorContainer>
      </div>
    )
  }

  if (datasetLoading) {
    return null
  }

  return (
    <Form className="container">
      <DisableImplicitSubmit />
      <FlaggedComponent flag="UI.SHOW_UNSUPPORTED">
        <Unsupported />
      </FlaggedComponent>
      <Separator />
      <AdminOrgSelector />
      <OwnerBanner />
      <DataOrigin />
      <Description />
      <Actors />
      <Separator />
      <Publications />
      <Geographics />
      <TimePeriod />
      <Infrastructure />
      <History />
      <ProjectV3 />
      <SubmitContainer>
        <Translate component="p" content="qvain.consent" unsafe />
      </SubmitContainer>
      <SubmitButtonsWrapper>
        <SubmitButtons idSuffix="-bottom" />
      </SubmitButtonsWrapper>
      <ModalManager />
    </Form>
  )
}

Dataset.propTypes = {
  datasetError: PropTypes.bool.isRequired,
  handleRetry: PropTypes.func.isRequired,
  datasetErrorTitle: PropTypes.node,
  datasetErrorDetails: PropTypes.node,
}

Dataset.defaultProps = {
  datasetErrorTitle: null,
  datasetErrorDetails: null,
}

export default observer(Dataset)
