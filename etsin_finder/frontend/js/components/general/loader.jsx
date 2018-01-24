import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ElasticQuery from '../../stores/view/elasticquery'

class Loader extends Component {
  render() {
    return (
      <div className={`holder ${ElasticQuery.loading ? 'loader-active' : ''}`}>
        <div className="results-spinner" />
      </div>
    )
  }
}

export default inject('Stores')(observer(Loader))
