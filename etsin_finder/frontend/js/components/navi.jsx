import React from "react";
import { Link } from "react-router-dom";
import Translate from 'react-translate-component';

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
          <Link to={"/"} className="nav-link active">
            <Translate content="nav.home" />
          </Link>
          <a href="#" className="nav-link">
            <Translate content="nav.datasets" />
          </a>
          <a href="#" className="nav-link">
            <Translate content="nav.organizations" />
          </a>
          <a href="#" className="nav-link">
            <Translate content="nav.help" />
          </a>
        </nav>
      </div>
    );
  }
};