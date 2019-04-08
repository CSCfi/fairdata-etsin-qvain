import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Card = ({ children }) => <Container>{children}</Container>

const Container = styled.div`
  margin-bottom: 15px;
  padding: 25px 44px;
  border: 1px solid #eceeef;
  min-height: 150px;
  background-color: #fff;
  overflow: auto;
`

Card.prototype = {
  children: PropTypes.element.isRequired
}

export default Card;
