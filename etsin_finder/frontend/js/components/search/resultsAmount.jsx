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

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'

const ResultsAmount = ({ amount }) => (
  // TODO: this doesn't read the content if the amount stays the same, only if it changes
  <Amount aria-live="polite">
    {translate(`results.amount.${amount === 1 ? 'snglr' : 'plrl'}`, { amount })}
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
