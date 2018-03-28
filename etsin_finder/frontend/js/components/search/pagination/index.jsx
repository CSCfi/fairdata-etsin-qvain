import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import ElasticQuery from 'Stores/view/elasticquery'
import PaginationButtons from './paginationButtons'

class Pagination extends Component {
  render() {
    return <PaginationButtons loading={ElasticQuery.loading} />
  }
}

export default inject('Stores')(observer(Pagination))
