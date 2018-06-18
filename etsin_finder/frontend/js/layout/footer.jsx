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
import styled from 'styled-components'

import cscLogo from '../../static/images/csc_logo.png'
import mecLogo from '../../static/images/mec_en.png'

export default class Footer extends React.Component {
  render() {
    return (
      <FooterArea>
        <div className="container">
          <Positioner>
            <div>
              <img alt="Ministry of Education and Culture -logo" src={mecLogo} />
            </div>
            <div>
              <img alt="CSC -logo" src={cscLogo} />
            </div>
          </Positioner>
        </div>
      </FooterArea>
    )
  }
}

const FooterArea = styled.div`
  min-height: 200px;
  background-color: ${props => props.theme.color.bgLight};
  box-shadow: inset 0 1px 1px ${props => props.theme.color.insetDark};
  display: flex;
  align-items: center;
  .footer-content {
    align-items: center;
  }
  .footer-img {
    img {
      width: 100%;
    }
  }
`

const Positioner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
