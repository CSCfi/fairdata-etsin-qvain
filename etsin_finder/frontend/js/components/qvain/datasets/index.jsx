import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'

class UserDatasets extends Component {
  render() {
    return (
      <div className="container">
        <h1>Own Datasets</h1>
        <ul>
          {this.props.Stores.DatasetQuery.datasetResults.map(dataset => (
            <li>asd</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default inject('Stores')(observer(UserDatasets));
