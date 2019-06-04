import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import {
  PaginationItem,
  PaginationButton,
  PaginationContainer
} from '../general/pagination'

class DatasetPagination extends Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired
  }

  handleChangePage = (pageNum) => () => {
    this.props.onChangePage(pageNum)()
  }

  renderPageButtons = (range) => {
    let buttons = []
    const { page } = this.props
    const [first] = range
    const [last] = range.slice(-1)
    const isBefore = last < page
    for (let i = first; i <= last; i += 1) {
      let button
      // range after the current page
      if (!isBefore && range.length > 2 && i === last) {
        button = (
          <Fragment key={i}>
            {this.singlePage('...', false)}
          </Fragment>
        )
      } else if (isBefore && range.length > 2 && i === first) {
        // range before the current page
        button = (
          <Fragment key={i}>
            {this.singlePage('...', false)}
          </Fragment>
        )
      } else {
        button = (
          <Fragment key={i}>
            {this.singlePage(i, true)}
          </Fragment>
        )
      }
      buttons = [...buttons, button]
    }
    return buttons
  }

  // Calculates the entire amount of pages needed for displaying datasets.
  // Takes into account the division remainders.
  getPageCount = (count, limit) => {
    const amount = (count / limit)
    if ((count % limit) > 0) {
      const remainder = count % limit
      const decimalRemainder = (limit / remainder) - 1
      const additional = decimalRemainder >= 0.5 ?
        decimalRemainder :
        decimalRemainder + (0.5 - decimalRemainder)
      return Math.round(amount + additional)
    }
    return amount
  }

  singlePage(value, link) {
    if (value === '...') {
      return (
        <li>
          <PaginationItem className="pagination-rest d-none d-md-block">
            <span className="sr-only">
              <Translate content="search.pagination.SRskipped" />
            </span>
            <span aria-hidden="true">...</span>
          </PaginationItem>
        </li>
      )
    }
    return (
      <li key={`pagination-${value}`}>
        {link ? (
          <PaginationButton
            onClick={this.handleChangePage(value)}
          >
            <Translate content="search.pagination.SRpage" className="sr-only" />
            {' '}
            {value}
          </PaginationButton>
        ) : (
          <PaginationButton className="current" disabled aria-disabled="true">
            <Translate content="search.pagination.SRcurrentpage" className="sr-only" />
            {' '}
            {value}
          </PaginationButton>
        )}
      </li>
    )
  }

  renderPageButton = (page, buttonPageNum) => (
    <li>
      <PaginationButton
        onClick={buttonPageNum === '...' ? this.handleChangePage(buttonPageNum) : () => {}}
        className={buttonPageNum === page ? 'current' : ''}
        type="button"
      >
        {buttonPageNum}
      </PaginationButton>
    </li>
  )

  renderPagination = () => {
    const { count, page, limit } = this.props
    const pageCount = this.getPageCount(count, limit)
    const completeRange = Array.from(Array(pageCount).keys()).map(n => n + 1)
    let lowerRange = completeRange.slice(0, page - 1)
    if (page > 3) {
      lowerRange = completeRange.slice(page - 4, page - 1)
    }
    const higherRange = completeRange.slice(page, page + 3)
    return (
      <PaginationContainer className="col-lg-12" aria-labelledby="pagination-label">
        <Translate
          content="search.pagination.SRpagination"
          className="pagination-label sr-only"
          aria-hidden
          id="pagination-label"
        />
        <ul>
          <li>
            <PaginationButton
              disabled={page === 1}
              onClick={this.handleChangePage(page - 1)}
              type="button"
            >
              <span aria-hidden>{'<'}</span>
            </PaginationButton>
          </li>
          {this.renderPageButtons(lowerRange)}
          {this.renderPageButton(page, page)}
          {this.renderPageButtons(higherRange)}
          <li>
            <PaginationButton
              disabled={page === this.getPageCount(count, limit)}
              onClick={this.handleChangePage(page + 1)}
              type="button"
            >
              <span aria-hidden>{'>'}</span>
            </PaginationButton>
          </li>
        </ul>
      </PaginationContainer>
    )
  }

  render() {
    return (
      <Fragment>
        {this.renderPagination()}
      </Fragment>
    );
  }
}

export default DatasetPagination;
