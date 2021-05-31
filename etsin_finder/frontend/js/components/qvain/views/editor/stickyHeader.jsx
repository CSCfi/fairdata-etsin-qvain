import React from 'react'
import { observer } from 'mobx-react'
import PropTypes, { instanceOf } from 'prop-types'
import Translate from 'react-translate-component'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeprecatedState from './deprecatedState'
import PasState from './pasState'
import SubmitButtons from './submitButtons'
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
} from './editor.styled'
import { useStores } from '../../utils/stores'

const StickyHeader = ({ datasetError, submitButtonsRef, hideSubmitButtons }) => {
  const {
    Qvain: {
      Submit: { error, response, isLoading, clearError, clearResponse },
    },
  } = useStores()

  const clear = () => {
    clearError()
    clearResponse()
  }

  const submitted = !!error || !!response

  const createLinkBack = position => (
    <LinkBackContainer position={position}>
      <LinkBack to="/qvain">
        <FontAwesomeIcon size="lg" icon={faChevronLeft} title="Back" />
        <Translate component={LinkText} display="block" content="qvain.backLink" />
      </LinkBack>
    </LinkBackContainer>
  )

  // Sticky header content
  if (datasetError) {
    return null
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
        <ButtonContainer>
          {!hideSubmitButtons && <SubmitButtons submitButtonsRef={submitButtonsRef} />}
        </ButtonContainer>
      </CustomSubHeader>
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
  hideSubmitButtons: PropTypes.bool,
  datasetError: PropTypes.bool.isRequired,
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }).isRequired,
}

StickyHeader.defaultProps = {
  hideSubmitButtons: false,
}

export default observer(StickyHeader)
