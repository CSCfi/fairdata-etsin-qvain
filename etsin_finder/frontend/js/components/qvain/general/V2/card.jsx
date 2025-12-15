import styled from 'styled-components'
import PropTypes from 'prop-types'
import withCustomProps from '@/utils/withCustomProps'
import theme from '@/styles/theme'

export function Card({ children, bottomContent, className, isGray }) {
  return (
    <Container bottomContent={bottomContent} className={className} isGray={isGray}>
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
  border:  ${props => (props.isGray ? `3px solid ${theme.color.primary}` : '1px solid #cccccc')};
  background-color: ${props => (props.isGray ? theme.color.lightgray : '#fff')};
  overflow: visible;
`

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bottomContent: PropTypes.bool,
  isGray: PropTypes.bool,
}

Card.defaultProps = {
  className: undefined,
  bottomContent: false,
  isGray: false,
}

export default Card
