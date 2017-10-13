import React from "react";

export default class Footer extends React.Component {
  render () {
    return (
    <div className="footer">
      <div className="container">
        <div className="row regular-row footer-content">
          <div className="col-4 col-md-2 mr-md-auto footer-img">
          <img src="../../static/images/mec_en.png" />
          </div>
          <div className="col-4 col-md-2 ml-auto footer-img">
            <img src="../../static/images/csc_logo.png" />
          </div>
        </div>
      </div>
    </div>
    );
  }
}