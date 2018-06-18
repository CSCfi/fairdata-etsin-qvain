{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

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
