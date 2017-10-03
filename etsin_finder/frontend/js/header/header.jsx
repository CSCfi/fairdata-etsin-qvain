import React from "react";

export default class Header extends React.Component {
  render () {
    return (
      <div className="header">
        <div className="container">
          <div className="row top-logo">
            <div className="align-left">
                <h2>Logo</h2>
            </div>
          </div>
          <nav role="navigation" className="row top-nav">
            <ul className="top-nav-left">
              <a href="#"><li className="active">Koti</li></a>
              <a href="#"><li>Aineistot</li></a>
              <a href="#"><li>Organisaatiot</li></a>
              <a href="#"><li>Ohjeet ja Info</li></a>
            </ul>
            <div className="top-nav-right">
              <button type="button" className="btn btn-etsin">Lisää aineistoa</button>
              <button type="button" className="btn btn-transparent">EN</button>
              <div className="dropdown">
                <button className="btn btn-transparent dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Matti Meikäläinen
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
              <button type="button" className="btn btn-transparent">Kirjaudu ulos</button>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}