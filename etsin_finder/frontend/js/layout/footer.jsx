import React from 'react'
import styled from 'styled-components'

import cscLogo from '../../static/images/csc_logo.png'
import mecLogo from '../../static/images/mec_en.png'

export default class Footer extends React.Component {
  render() {
    return (
      <FooterArea>
        <div className="container">
          <div className="row regular-row footer-content">
            <div className="col-4 col-md-2 mr-md-auto footer-img">
              <img alt="Ministry of Education and Culture -logo" src={mecLogo} />
            </div>
            <div className="col-4 col-md-2 ml-auto footer-img">
              <img alt="CSC -logo" src={cscLogo} />
            </div>
          </div>
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
