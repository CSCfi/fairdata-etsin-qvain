import React, { Component } from 'react'
import DatasetQuery from '../../stores/view/datasetquery'

export default class Downloads extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: DatasetQuery.results,
    }
  }

  tableItem(item, index) {
    return (
      <tr key={`filelist-${index}`}>
        <td>icon</td>
        <td>{item.title}</td>
        <td>Lorem Ipsum Dolor Sit Amet</td>
        <td>38.5 MB</td>
        <td>Dokumentaatio</td>
        <td>
          <button>Button1</button>
          <button>Button2</button>
        </td>
      </tr>
    )
  }

  render() {
    console.log(this.state.results.research_dataset.files[0])
    return (
      <div className="dsDownloads">
        <div className="downloads-header d-flex justify-content-between">
          <div className="heading-right">
            <div className="title">Tiedostot</div>
            <div className="files-size-all">145 aineistoa (6789,1 MB)</div>
          </div>
          <div className="heading-left d-flex align-items-center">
            <div className="files-filter">Suodata</div>
            <div className="files-search">Search</div>
          </div>
        </div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col" />
              <th scope="col">Nimi</th>
              <th scope="col">Otsikko</th>
              <th scope="col">Koko</th>
              <th scope="col">Kategoria</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {this.state.results.research_dataset.files.map((single, i) =>
              this.tableItem(single, i)
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
