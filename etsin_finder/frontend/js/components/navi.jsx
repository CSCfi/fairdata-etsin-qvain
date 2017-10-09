import React from "react";
import { Link } from "react-router-dom";

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
          <Link to={"/main"} className="nav-link active">
            Koti
          </Link>
          <Link to={"/datasets"} className="nav-link">
            Aineistot
          </Link>
          <a href="#" className="nav-link">Organisaatiot</a>
          <a href="#" className="nav-link">Ohjeet ja Info</a>
        </nav>
      </div>
    );
  }
};