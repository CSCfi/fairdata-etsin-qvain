import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class DsSidebar extends Component {
  render() {
    return (
      <div className="sidebar content-box">
        <div className="separator">
          <Translate content="" component="h3" />Säilytyspaikka
        </div>
        <div className="separator">
          <Translate content="" component="h3" />Julkaisupäivä
          <Translate content="" component="h3" />DOI
        </div>
        <div>
          <Translate content="" component="h3" />Tieteenala
          {this.props.dataset.data_catalog.catalog_json.field_of_science.map(field => {
            return <p key={field.identifier}>{field.pref_label[this.props.lang]}</p>
          })}
          <Translate content="" component="h3" />Infra
          <p>Lorem ipsum dolor sit amet</p>
          <Translate content="" component="h3" />Lisenssi
          {this.props.dataset.data_catalog.catalog_json.access_rights.type.map(rights => {
            return <p key={rights.identifier}>{rights.pref_label[this.props.lang]}</p>
          })}
          <Translate content="" component="h3" />Pysyvä linkki tälle sivulle
          <Translate content="" component="h3" />Lisenssi
          <Translate content="" component="h3" />Viittaus aineistoon
        </div>
        <div className="row no-gutters justify-content-md-center">
          <button type="button" className="btn btn-etsin-outline align-center">
            <Translate content="" />Näytä lisää tietoja
          </button>
        </div>
      </div>
    );
  }
}