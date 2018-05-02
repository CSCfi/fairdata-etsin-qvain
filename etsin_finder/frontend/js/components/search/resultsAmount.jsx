import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ResultsAmount = ({ amount }) => (
  <Amount>
    <Translate
      with={{ amount }}
      component="p"
      content={`results.amount.${amount === 1 ? 'snglr' : 'plrl'}`}
      fallback="%(amount)s results"
    />
  </Amount>
)

ResultsAmount.propTypes = {
  amount: PropTypes.number.isRequired,
}

const Amount = styled.div`
  p {
    letter-spacing: 1px;
    font-weight: bold;
    color: ${props => props.theme.color.gray};
    font-size: 0.9em;
    margin: auto;
  }
`

export default ResultsAmount
