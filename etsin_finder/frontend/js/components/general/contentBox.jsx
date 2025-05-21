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

import styled from 'styled-components'

const ContentBox = styled.div`
  overflow-x: hidden;
  padding: 1.4em;
  border: 2px solid ${props => props.theme.color.lightgray};
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.6em;
  }
`

export default ContentBox
