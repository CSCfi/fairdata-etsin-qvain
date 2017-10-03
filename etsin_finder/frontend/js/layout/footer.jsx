import React from "react";

export default class Footer extends React.Component {
  render () {
    return (
    <div className="footer">
      <div className="container">
        <div className="row footer-content">
          <div className="col-md-6">
            ATT-hanke on opetus ja kulttuuriministeriön rahoittama hanke, jonka tavoitteena on, että vuoteen 2017 mennessä Suomi nousee yhdeksi johtavista maista tieteen ja tutkimuksen avoimuudessa
          </div>
          <div className="col-md-2">
            Opetus- ja kulttuuriministeriö
          </div>
          <div className="col-md-2">
            Avoin tiede ja tutkimus
          </div>
          <div className="col-md-2">
            CSC
          </div>
        </div>
      </div>
    </div>
    );
  }
}