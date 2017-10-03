import React from "react";

export default class Navi extends React.Component {
  render() {
    return (
      <nav role="navigation" className="nav navigation">
        <a href="#" className="nav-link active">Koti</a>
        <a href="#" className="nav-link">Aineistot</a>
        <a href="#" className="nav-link">Organisaatiot</a>
        <a href="#" className="nav-link">Ohjeet ja Info</a>
      </nav>
    );
  }
};