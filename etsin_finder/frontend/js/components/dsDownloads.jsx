import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class DsDownloads extends Component {
  render() {
    return (
      <div className="dsDownloads content-box">
        <div className="row no-gutters justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <Translate content="dataset.dl.files" component="h3" className="m-0" />
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
                <th><Translate content="dataset.dl.name" /></th>
                <th><Translate content="dataset.dl.size" /></th>
                <th />
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
                  <button className="btn btn-etsin"><Translate content="dataset.dl.download" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
