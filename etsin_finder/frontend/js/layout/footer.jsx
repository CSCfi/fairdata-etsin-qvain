import React from "react";

export default class Footer extends React.Component {
  render () {
    return (
    <div className="footer">
      <div className="container">
        <div className="row regular-row footer-content">
          <div className="col-12 col-md-6">
            ATT-hanke on opetus ja kulttuuriministeriön rahoittama hanke, jonka tavoitteena on, että vuoteen 2017 mennessä Suomi nousee yhdeksi johtavista maista tieteen ja tutkimuksen avoimuudessa
          </div>
          <div className="col-4 col-md-2 footer-img">
          <img src="../../static/images/mec_en.png" />
          </div>
          <div className="col-4 col-md-2 footer-img">
            <img src="../../static/images/osar_en.png" />
          </div>
          <div className="col-4 col-md-2 footer-img">
            <img src="../../static/images/csc_logo.png" />
          </div>
        </div>
      </div>
    </div>
    );
  }
}