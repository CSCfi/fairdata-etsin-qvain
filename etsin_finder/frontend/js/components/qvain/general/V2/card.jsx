import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import withCustomProps from '@/utils/withCustomProps'

export function Card({ children, bottomContent, className }) {
  return (
    <Container bottomContent={bottomContent} className={className}>
      {children}
    </Container>
  )
}

export const Container = withCustomProps(styled.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 64px;
  padding-right: 64px;
  padding-top: 24px;
  padding-bottom: ${props => (props.bottomContent ? '16px' : '56px')};
  border: 1px solid #cccccc;
  background-color: #fff;
  overflow: visible;
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
