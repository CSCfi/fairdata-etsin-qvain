import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// eslint-disable-next-line
const Card = ({ children }) => <Container>{children}</Container>

const Container = styled.div`
  margin-bottom: 15px;
  padding: 25px 45px 56px 45px;
  border: 1px solid #eceeef;
  min-height: 150px;
  background-color: #fff;
  overflow: visible;
`

Card.prototype = {
  children: PropTypes.element.isRequired
}

export default Card;
