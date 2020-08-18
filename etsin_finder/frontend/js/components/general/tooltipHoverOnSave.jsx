{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'

const TooltipHoverOnSave = ({ isOpen, Stores, children, shouldBeDisplayed, typeOfTooltip }) => {
  const wrapperTooltipButtonRef = useRef(null)
  const wrapperTooltipCardRef = useRef(null)

  // Helper function in order to bypass the Lint rule prefer-template
  function formatStringToTranslate(prefixString, filteredField) {
    return prefixString + filteredField.fieldName
  }

  const tooltip = (
    <>
      <span ref={wrapperTooltipButtonRef}>
        {children}
      </span>
      <Wrapper ref={wrapperTooltipCardRef}>
        <TooltipDownV2>
          <TooltipArrowDown />
          {typeOfTooltip === "draft" ? (
            <TooltipTextBold>
            {translate('qvain.missingFieldsGeneralDraft.infoTitle')}
            <TooltipText>
              { // General fields (only title)
                (Stores.Qvain.missingFieldsListGeneral.slice(0, 1).filter(
                  element => (element.valueIsMissing === true) && (element.valueIsRequired === true)).map(filteredField => (
                    `- ${translate(formatStringToTranslate('qvain.missingFieldsGeneral.', filteredField))} \n`
                )))
              }
            </TooltipText>
            </TooltipTextBold>
          ) :(
            <TooltipTextBold>
            {translate('qvain.missingFieldsGeneral.infoTitle')}
            <TooltipText>
              { // General fields
                (Stores.Qvain.missingFieldsListGeneral.filter(
                  element => (element.valueIsMissing === true) && (element.valueIsRequired === true)).map(filteredField => (
                    `- ${translate(formatStringToTranslate('qvain.missingFieldsGeneral.', filteredField))} \n`
                )))
              }
              { // Actor fields
                (Stores.Qvain.Actors.missingFieldsListActors.filter(
                  element => (element.valueIsMissing === true) && (element.valueIsRequired === true)).map(filteredField => (
                    `- ${translate(formatStringToTranslate('qvain.missingFieldsActors.', filteredField))} \n`
                )))
              }
            </TooltipText>
            </TooltipTextBold>
          )
        }

          
        </TooltipDownV2>
      </Wrapper>
    </>
  )
  return (isOpen && shouldBeDisplayed) ? tooltip : children
}

TooltipHoverOnSave.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  Stores: PropTypes.object.isRequired,
}

export default TooltipHoverOnSave

const Wrapper = styled.span`
  position: relative;
`

const TooltipDown = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
  color: ${props => props.theme.color.white}
  border-radius: 5px;
  display: inline-block;
  margin-top: -5px;
  left: -160px;
  top: 0px;
`

const TooltipDownV2 = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
  color: ${props => props.theme.color.white}
  border-radius: 5px;
  display: inline-block;
  margin-top: -5px;
  left: -15em;
  top: 30px;
`

const TooltipArrowDown = styled.div`
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #6e6e6e;
  margin-left: 150px;
  width: 0;
  height: 0;
`

const TooltipText = styled.div`
  display:block;
  white-space: pre-line; 
  max-width: 400px;
  width: max-content;
  padding-top: 10px;
  background: #6e6e6e;
  font-size: initial;
  line-height: initial;
  font-weight: initial;
  @media (max-width: ${p => p.theme.breakpoints.sm}) {
    max-width: 200px;
  }
`

const TooltipTextBold = styled(TooltipText)`
  font-weight: bold;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 5px;
`
