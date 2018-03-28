import React from 'react'
import cscLogo from '../../static/images/csc_logo.png'

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="row regular-row footer-content">
            <div className="col-4 col-md-2 mr-md-auto footer-img">
              <img
                alt="Ministry of Education and Culture -logo"
                src="../../static/images/mec_en.png"
              />
            </div>
            <div className="col-4 col-md-2 ml-auto footer-img">
              <img alt="CSC -logo" src={cscLogo} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
