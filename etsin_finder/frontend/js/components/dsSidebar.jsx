import React, { Component } from 'react';

export default class DsSidebar extends Component {
  render() {
    return (
      <div className="sidebar content-box">
        <div className="separator">Säilityspaikka</div>
        <div className="separator">Julkaisupaikka</div>
        <div>Tieteenala</div>
        <button type="button" className="btn btn-etsin">
          Näytä lisää tietoja
        </button>
      </div>
    );
  }
}