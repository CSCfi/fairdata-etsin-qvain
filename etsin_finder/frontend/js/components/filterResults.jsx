import React, { Component } from 'react';

export default class FilterResults extends Component {
  toggleFilter(event) {
    event.target.nextSibling.classList.toggle('open')
    event.target.nextSibling.querySelectorAll('button').forEach(button => (
      button.hasAttribute('disabled')
        ? button.removeAttribute('disabled')
        : button.setAttribute('disabled', '')
    ))
  }

  updateFilter(event) {
    alert(event.target.innerHTML)
  }

  render() {
    return (
      <div className="search-filtering">
        <div className="filter-section">
          <button className="filter-category" onClick={this.toggleFilter} >
            Aineistotyyppi
            <i className="fa fa-angle-down fa-2x" aria-hidden="true" />
          </button>
          <div className="filter-items">
            <ul>
              <li>
                <button onClick={this.updateFilter} disabled>
                  Kirja
                </button>
              </li>
              <li>
                <button onClick={this.updateFilter} disabled>
                  Lehti
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="filter-section">
          <button className="filter-category" onClick={this.toggleFilter}>
            Tieteenala
            <i className="fa fa-angle-down fa-2x" aria-hidden="true" />
          </button>
          <div className="filter-items">
            <ul>
              <li>
                <button onClick={this.updateFilter} disabled>
                  Luonnontiede
                </button>
              </li>
              <li>
                <button onClick={this.updateFilter} disabled>
                  Kielet
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
