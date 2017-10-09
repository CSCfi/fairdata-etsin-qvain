import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

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
            <FormattedMessage
              id="link.home"
              defaultMessage="Home"
              description="Link to homepage"
            />
          </Link>
          <a href="#" className="nav-link">
            <FormattedMessage
              id="link.datasets"
              defaultMessage="Datasets"
              description="Link to datasets"
            />
          </a>
          <a href="#" className="nav-link">
            <FormattedMessage
              id="link.organizations"
              defaultMessage="Organizations"
              description="Link to organizations"
            />
          </a>
          <a href="#" className="nav-link">
            <FormattedMessage
              id="link.help"
              defaultMessage="Help & About"
              description="Link to Help"
            />
          </a>
        </nav>
      </div>
    );
  }
};