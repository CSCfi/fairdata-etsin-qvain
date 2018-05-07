import React, { Component } from 'react'
import ExternalResources from './externalResources'
import IdaResources from './idaResources'

export default class Data extends Component {
  state = {}
  render() {
    return (
      <div>
        <IdaResources />
        <ExternalResources />
      </div>
    )
  }
}
