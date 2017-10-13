import React from "react";
import Translate from 'react-translate-component';
import Navi from "../components/navi";
import SecondNav from "../components/secondnav";

export default class Header extends React.Component {
  render () {
    return (
      <div className="header">
        <div className="container">
          <div className="row top-logo">
            <div className="container align-left row">
                <img src="../../static/images/etsin_logo.png" />
                <p className="slogan">
                  <Translate content="slogan" />
                </p>
            </div>
          </div>
          <div className="row top-nav">
            <Navi></Navi>
            <SecondNav></SecondNav>
          </div>
        </div>
      </div>
    );
  }
}