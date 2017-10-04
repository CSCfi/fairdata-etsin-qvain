import React from "react";

export default class Navi extends React.Component {
  openNavi(event) {
    console.log(event.target.className);
    event.target.className = event.target.className ? "" : "open";
    let navList = document.querySelector(".nav-list");
    if (navList.classList.contains("open")) {
      navList.classList.remove("open");
    } else {
      navList.classList.add("open");
    }
  }

  render() {
    return (
      <div className="navigation">
        <div id="nav-icon" onClick={this.openNavi}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav role="navigation" className="nav nav-list">
          <a href="#" className="nav-link active">Koti</a>
          <a href="#" className="nav-link">Aineistot</a>
          <a href="#" className="nav-link">Organisaatiot</a>
          <a href="#" className="nav-link">Ohjeet ja Info</a>
        </nav>
      </div>
    );
  }
};