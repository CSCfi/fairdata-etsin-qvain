import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

// eslint-disable-next-line
const Card = ({ children, bottomContent }) => <Container bottomContent={bottomContent}>{children}</Container>

export const Container = styled.div`
  padding-left: 45px;
  padding-right: 45px;
  padding-top: 25px;
  padding-bottom: ${props => (props.bottomContent ? '31px' : '56px')};
  margin-top: 20px;
  border: 1px solid #eceeef;
  min-height: 150px;
  background-color: #fff;
  overflow: visible;
`

export const ContainerLight = styled.div`
  margin-bottom: 15px;
`

export const ContainerSubsection = styled.div`
  padding: 25px 45px 56px 45px;
  border: 1px solid #eceeef;
  min-height: 150px;
  background-color: #fff;
  overflow: visible;
`

export const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

const slide = keyframes`
  from {
    transform: translate(0, -100px);
    opacity: 0;
    z-index: -1;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

export const SlidingContent = styled.div`
  padding-top: 20px;
  position: relative;
  flex: auto;
  width: 100%;
  animation: ${slide} .2s ease-in;
  ${props => (
    props.open ?
      `
      display: inline-block;
      `
      :
      `
      display: none;
      `
  )}
`;

Card.prototype = {
  children: PropTypes.element.isRequired
}

export default Card;
