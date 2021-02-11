import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { PaginationItem, PaginationButton, PaginationContainer } from '../editor/pagination'

const DatasetPagination = ({ id, page, count, limit, onChangePage }) => {
  const pageCount = Math.ceil(count / limit)
  const completeRange = [...Array(pageCount).keys()].map(n => n + 1)
  let lowerRange = completeRange.slice(0, page - 1)
  if (page > 3) {
    lowerRange = completeRange.slice(page - 4, page - 1)
  }
  const higherRange = completeRange.slice(page, page + 3)

  const handleChangePage = pageNum => () => {
    onChangePage(pageNum)()
  }

  const renderPageButtons = range => {
    let buttons = []
    const [first] = range
    const [last] = range.slice(-1)
    const isBefore = last < page

    for (let i = first; i <= last; i += 1) {
      let button
      // range after the current page
      if (!isBefore && range.length > 2 && i === last) {
        button = <Fragment key={i}>{singlePage('...', false)}</Fragment>
      } else if (isBefore && range.length > 2 && i === first) {
        // range before the current page
        button = <Fragment key={i}>{singlePage('...', false)}</Fragment>
      } else {
        button = <Fragment key={i}>{singlePage(i, true)}</Fragment>
      }
      buttons = [...buttons, button]
    }
    return buttons
  }

  const singlePage = (value, link) => {
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
          <PaginationButton onClick={handleChangePage(value)}>
            <Translate content="search.pagination.SRpage" className="sr-only" /> {value}
          </PaginationButton>
        ) : (
          <PaginationButton className="current" disabled aria-disabled="true">
            <Translate content="search.pagination.SRcurrentpage" className="sr-only" /> {value}
          </PaginationButton>
        )}
      </li>
    )
  }

  const renderPageButton = buttonPageNum => (
    <li>
      <PaginationButton
        onClick={buttonPageNum === '...' ? handleChangePage(buttonPageNum) : () => {}}
        className={buttonPageNum === page ? 'current' : ''}
        type="button"
      >
        {buttonPageNum}
      </PaginationButton>
    </li>
  )

  const renderPrevPageButton = () => (
    <li>
      <PaginationButton
        aria-label="Previous page"
        disabled={page === 1}
        onClick={handleChangePage(page - 1)}
        type="button"
      >
        <span aria-hidden>{'<'}</span>
      </PaginationButton>
    </li>
  )

  const renderNextPageButton = () => (
    <li>
      <PaginationButton
        aria-label="Next page"
        disabled={page === pageCount || pageCount === 0}
        onClick={handleChangePage(page + 1)}
        type="button"
      >
        <span aria-hidden>{'>'}</span>
      </PaginationButton>
    </li>
  )

  if (pageCount === 1) return null

  return (
    <PaginationContainer className="col-lg-12" aria-labelledby={id}>
      <Translate
        content="search.pagination.SRpagination"
        className="pagination-label sr-only"
        aria-hidden
        id={id}
      />
      <ul>
        {renderPrevPageButton()}
        {renderPageButtons(lowerRange)}
        {renderPageButton(page)}
        {renderPageButtons(higherRange)}
        {renderNextPageButton()}
      </ul>
    </PaginationContainer>
  )
}

DatasetPagination.propTypes = {
  id: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
}

export default DatasetPagination
