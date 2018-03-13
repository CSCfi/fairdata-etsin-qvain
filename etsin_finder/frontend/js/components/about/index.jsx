import React, { Component } from 'react'
import HeroBanner from '../general/hero'

export default class About extends Component {
  state = {}
  render() {
    return (
      <div className="about-page">
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>About</h1>
            </div>
          </div>
        </HeroBanner>
      </div>
    )
  }
}
