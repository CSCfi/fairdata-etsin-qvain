import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class DsDownloads extends Component {
  render() {
    console.log(this.props.files);
    return (
      <div className="dsDownloads content-box">
        <div className="row no-gutters justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <Translate content="dataset.files" component="h3" className="m-0"/>
            <p className="total-size m-0 ml-2">
              (99.9 GB)
            </p>
          </div>
          <button type="button" className="btn btn-etsin">
            <Translate content="" />Hae käyttölupaa
          </button>
        </div>
        <div className="row">
          <table className="table">
            <thead className="thead-etsin">
              <tr>
                <th>Nimi</th>
                <th>Koko</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    Datasource 1
                  </p>
                  <span className="urn">urn:something</span>
                </td>
                <td>
                  <p>38.7 Mb</p>
                </td>
                <td className="text-right">
                  <button className="btn btn-etsin">Lataa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}