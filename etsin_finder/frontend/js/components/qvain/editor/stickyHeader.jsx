import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import Translate from 'react-translate-component'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeprecatedState from './deprecatedState'
import PasState from './pasState'
import SubmitButtons from './submitButtons'
import { StickySubHeaderWrapper, StickySubHeader, StickySubHeaderResponse } from '../general/card'
import SubmitResponse from './submitResponse'
import {
  ButtonContainer,
  SubmitButton,
  CustomSubHeader,
  LinkBackContainer,
  LinkBack,
  LinkText,
} from './editor.styled'

const StickyHeader = ({
  datasetError,
  datasetLoading,
  handleSubmitError,
  handleSubmitResponse,
  submitButtonsRef,
  submitted,
  response,
}) => {
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
  if (datasetLoading) {
    return (
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
  }
  return (
    <StickySubHeaderWrapper>
      <CustomSubHeader>
        {createLinkBack('left')}
        <ButtonContainer>
          <SubmitButtons
            handleSubmitError={handleSubmitError}
            handleSubmitResponse={handleSubmitResponse}
            submitButtonsRef={submitButtonsRef}
          />
        </ButtonContainer>
      </CustomSubHeader>
      <PasState />
      <DeprecatedState />
      {submitted ? (
        <StickySubHeaderResponse>
          <SubmitResponse response={response} />
        </StickySubHeaderResponse>
      ) : null}
    </StickySubHeaderWrapper>
  )
}

StickyHeader.propTypes = {
  datasetError: PropTypes.bool.isRequired,
  datasetLoading: PropTypes.bool.isRequired,
  submitted: PropTypes.bool.isRequired,
  response: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  handleSubmitError: PropTypes.func.isRequired,
  handleSubmitResponse: PropTypes.func.isRequired,
  submitButtonsRef: PropTypes.shape({ current: instanceOf(Element) }).isRequired,
}

StickyHeader.defaultProps = {
  response: null,
}

export default StickyHeader
