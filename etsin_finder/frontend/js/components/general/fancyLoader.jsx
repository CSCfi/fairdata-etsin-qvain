import React from 'react'
import nprogress from 'nprogress'

class FancyLoader extends React.Component {
  componentWillMount() {
    nprogress.start()
  }

  componentWillUnmount() {
    nprogress.done()
  }

  render() {
    return <div />
  }
}

export default FancyLoader
