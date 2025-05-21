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

import { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

export default class SkipToContent extends Component {
  render() {
    return (
      <SkipToContentButton onClick={this.props.callback}>
        <Translate content="stc" />
      </SkipToContentButton>
    )
  }
}

const SkipToContentButton = styled.button.attrs({
  type: 'button',
})`
  display: block;
  background: ${p => p.theme.color.primary};
  color: white;
  max-height: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  letter-spacing: 2px;
  transition: 0.2s ease;
  &:focus {
    text-decoration: underline;
    padding: 0.5em;
    max-height: 3em;
  }
`

SkipToContent.propTypes = {
  callback: PropTypes.func.isRequired,
}
