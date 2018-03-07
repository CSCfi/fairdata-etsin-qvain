import React, { Component } from 'react'
import HeroBanner from '../general/hero'

export default class Organizations extends Component {
  render() {
    return (
      <div className="organizations-page">
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>Organizations</h1>
            </div>
          </div>
        </HeroBanner>
      </div>
    )
  }
}
