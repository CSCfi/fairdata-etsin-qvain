import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const Container = styled.div`
  padding-left: 45px;
  padding-right: 45px;
  padding-top: 25px;
  padding-bottom: ${props => (props.$bottomContent ? '31px' : '56px')};
  margin-top: 20px;
  border: 1px solid #cccccc;
  min-height: 150px;
  background-color: #fff;
  overflow: visible;
`

const Card = ({ children, bottomContent, className }) => (
  <Container $bottomContent={bottomContent} className={className}>
    {children}
  </Container>
)

export const QvainContainer = styled.div`
  background-color: #fafafa;
`

export const PageTitle = styled.h1`
  height: 100px;
  background-color: ${p => p.theme.color.primary};
  color: white;
  display: flex;
  align-items: center;
  font-family: 'Lato', sans-serif;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.81;
  letter-spacing: normal;
  padding: 0.5rem 1rem 0.5rem 2rem;
  white-space: nowrap;
  margin-bottom: 0;
`

export const Paragraph = styled.p`
  :last-child {
    margin-bottom: 0;
  }
`

export const StickySubHeaderWrapper = styled.div`
  top: 0;
  position: sticky;
  z-index: 2;
`

export const StickySubHeader = styled.div`
  background-color: rgb(231, 233, 237);
  color: #4f4f4f;
  display: flex;
  width: 100%;
  min-height: 2.75rem;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`

export const StickySubHeaderResponse = styled.div`
  color: #4f4f4f;
  display: flex;
  width: 100%;
  justify-content: center;
`

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bottomContent: PropTypes.bool,
}

Card.defaultProps = {
  className: undefined,
  bottomContent: false,
}

export default Card
