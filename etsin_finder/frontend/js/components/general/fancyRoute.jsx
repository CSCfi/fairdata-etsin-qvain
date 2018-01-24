import React from 'react'
import { Route } from 'react-router-dom'
import nprogress from 'nprogress'

class FancyRoute extends React.Component {
  componentWillMount() {
    nprogress.start()
  }

  componentDidMount() {
    nprogress.done()
  }

  render() {
    return (
      <Route {...this.props} />
    )
  }
}

export default FancyRoute
