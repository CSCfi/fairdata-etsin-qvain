import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class DsDownloads extends Component {
  render() {
    console.log(this.props.files);
    return (
      <div className="dsDownloads content-box">
        <div className="row no-gutters justify-content-between">
          <div className="d-flex align-items-center">
            <Translate content="dataset.files" component="h3" className="m-0"/>
            <p className="total-size m-0">
              (99,9 GB)
            </p>
          </div>
          <button type="button" className="btn btn-etsin">
            <Translate content="" />Hae käyttölupaa
          </button> 
        </div>
      </div>
    );
  }
}