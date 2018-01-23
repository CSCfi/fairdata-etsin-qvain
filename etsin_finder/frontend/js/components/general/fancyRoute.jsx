import React from 'react'
import { Route } from 'react-router-dom'
import nprogress from 'nprogress'

class FancyRoute extends React.Component {
  componentWillMount() {
    nprogress.start()
    console.log('new route')
  }

  componentDidMount() {
    nprogress.done()
    console.log('route done')
  }

  render() {
    return (
      <Route {...this.props} />
    )
  }
}

export default FancyRoute
