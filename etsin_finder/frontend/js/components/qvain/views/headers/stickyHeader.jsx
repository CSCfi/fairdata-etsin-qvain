import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Translate from '@/utils/Translate'

import DeprecatedState from './deprecatedState'
import PasState from './pasState'
import LockNotification from './lockNotification'
import {
  StickySubHeaderWrapper,
  StickySubHeader,
  StickySubHeaderResponse,
} from '../../general/card'
import SubmitResponse from './submitResponse'
import {
  SubmitButton,
  ButtonContainer,
  CustomSubHeader,
  LinkBackContainer,
  LinkBack,
  LinkText,
} from './headers.styled'
import { useStores } from '../../utils/stores'

const datasetStateTranslation = dataset => {
  if (!dataset) return ''
  if (dataset.state === 'published') {
    return 'qvain.state.published'
  }
  if (dataset.draft_of) {
    return 'qvain.state.changed'
  }
  return 'qvain.state.draft'
}

const StickyHeader = ({ datasetError }) => {
  const {
    Qvain: {
      original,
      Submit: { error, response, isLoading, clearError, clearResponse },
    },
    Env: { getQvainUrl },
  } = useStores()

  const clear = () => {
    clearError()
    clearResponse()
  }

  const submitted = !!error || !!response

  const createLinkBack = position => (
    <LinkBackContainer position={position}>
      <LinkBack to={getQvainUrl('/')}>
        <FontAwesomeIcon size="lg" icon={faChevronLeft} title="Back" />
        <Translate component={LinkText} display="block" content="qvain.backLink" />
      </LinkBack>
    </LinkBackContainer>
  )

  // Sticky header content
  if (datasetError) {
    return (
      <StickySubHeaderWrapper>
        <StickySubHeader>
          <CustomSubHeader>{createLinkBack('left')}</CustomSubHeader>
        </StickySubHeader>
      </StickySubHeaderWrapper>
    )
  }

  if (isLoading) {
    return (
      <StickySubHeaderWrapper>
        <StickySubHeader>
          <ButtonContainer>
            <Translate component={SubmitButton} content="qvain.titleLoading" disabled />
          </ButtonContainer>
        </StickySubHeader>
      </StickySubHeaderWrapper>
    )
  }
  return (
    <StickySubHeaderWrapper>
      <CustomSubHeader>
        {createLinkBack('left')}
        <Translate component={DatasetState} content={datasetStateTranslation(original)} />
        <Padding />
      </CustomSubHeader>
      <LockNotification />
      <PasState />
      <DeprecatedState />
      {submitted ? (
        <StickySubHeaderResponse>
          <SubmitResponse response={error || response} clearSubmitResponse={clear} />
        </StickySubHeaderResponse>
      ) : null}
    </StickySubHeaderWrapper>
  )
}

StickyHeader.propTypes = {
  datasetError: PropTypes.bool.isRequired,
}

export const DatasetState = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: 600;
  margin: 0.25rem 1rem;
`

const Padding = styled.div`
  padding: 0rem 2rem;
`

export default observer(StickyHeader)
