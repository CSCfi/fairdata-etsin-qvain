import React, { Component } from 'react';

export default class SecondNav extends Component {
  render() {
    return (
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
    );
  }
}