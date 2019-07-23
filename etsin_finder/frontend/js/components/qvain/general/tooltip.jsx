import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Tooltip = ({ isOpen, align, text, children }) => {
  let tooltip
  switch (align) {
    case 'Right':
      tooltip = (
        <React.Fragment>
          {children}
          <Wrapper>
            <TooltipRight>
              <TooltipArrowRight />
              <TooltipText>{text}</TooltipText>
            </TooltipRight>
          </Wrapper>
        </React.Fragment>
      )
      break
    case 'Left':
      tooltip = (
        <React.Fragment>
          {children}
          <Wrapper>
            <TooltipLeft>
              <TooltipText>{text}</TooltipText>
              <TooltipArrowLeft />
            </TooltipLeft>
          </Wrapper>
        </React.Fragment>
      )
      break
    case 'Down':
      tooltip = (
        <React.Fragment>
          {children}
          <Wrapper>
            <TooltipDown>
              <TooltipArrowDown />
              <TooltipText>{text}</TooltipText>
            </TooltipDown>
          </Wrapper>
        </React.Fragment>
      )
      break
    case 'Up':
      tooltip = (
        <React.Fragment>
          {children}
          <Wrapper>
            <TooltipUp>
              <TooltipText>{text}</TooltipText>
              <TooltipArrowUp />
            </TooltipUp>
          </Wrapper>
        </React.Fragment>
      )
      break
    default:
      tooltip = (
        <React.Fragment>
          {children}
          <Wrapper>
            <TooltipDown>
              <TooltipText>{text}</TooltipText>
              <TooltipArrowDown />
            </TooltipDown>
          </Wrapper>
        </React.Fragment>
      )
  }
  return isOpen ? tooltip : children
}

Tooltip.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  align: PropTypes.string.isRequired,
  text: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
}

export default Tooltip

const Wrapper = styled.span`
  position: relative;
`

const TooltipStyle = styled.div`
  z-index: 10;
  text-align: left;
  text-align: start;
  text-shadow: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  word-spacing: normal;
  word-wrap: normal;
  position: absolute;
`

const TooltipLeft = styled(TooltipStyle)`
  display: flex;
  margin-left: 5px;
  right: 30px;
  top: -8px;
`

const TooltipRight = styled(TooltipStyle)`
  display: flex;
  margin-left: -5px;
  left: 0px;
  top: -8px;
`

const TooltipDown = styled(TooltipStyle)`
  display: inline-block;
  margin-top: -5px;
  left: -37px;
  top: 30px;
`

const TooltipUp = styled(TooltipStyle)`
  display: inline-block;
  margin-top: 5px;
  left: -37px;
  top: -111px;
`
const TooltipArrow = styled.div`
  width: 0;
  height: 0;
`

const TooltipArrowLeft = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(1px 0px 1px rgba(0, 0, 0, 0.3));
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
  margin-top: 10px;
`

const TooltipArrowRight = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.3));
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
  margin-top: 10px;
`

const TooltipArrowDown = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.3));
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  margin-left: 10px;
`

const TooltipArrowUp = styled(TooltipArrow)`
  -webkit-filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2));
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #fff;
  margin-left: 10px;
`

const TooltipText = styled.div`
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: max-content;
  padding: 10px 15px;
  color: ${p => p.theme.color.dark};
  font-size: initial;
  line-height: initial;
  font-weight: initial;
  text-align: inherit;
  background-color: ${p => p.theme.color.white};
  @media (max-width: ${p => p.theme.breakpoints.sm}) {
    max-width: 200px;
  }
`
