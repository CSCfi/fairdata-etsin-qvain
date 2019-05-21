import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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

export const QvainContainer = styled.div`
  background-color: #fafafa;
`

export const SubHeader = styled.div`
  height: 100px;
  background-color: #007fad;
  color: white;
  display: flex;
  align-items: center;
`

export const SubHeaderText = styled.div`
  font-family: Lato;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.81;
  letter-spacing: normal;
  color: #ffffff;
  margin-left: 47px;
`

Card.prototype = {
  children: PropTypes.element.isRequired
}

export default Card;
