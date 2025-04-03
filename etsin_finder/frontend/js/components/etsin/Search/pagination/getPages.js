const getPages = options => {
  // Create pagination array
  // * first and last pages are always shown
  // * show '<' and '>' for previous/next page
  // * show `windowSize` pages around currentPage
  // * hidden pages are shown as '...'
  // * if window edges are within `margin` of start or end, show all pages there
  //
  // Example output with { pageCount: 20, currentPage: 6, windowSize: 2, margin: 2 }:
  //   ['<', 1, '...', 4, 5, 6, 7, 8, '...', 20, '>']
  const { pageCount, currentPage, windowSize = 2, margin = 2 } = options
  const pages = []
  const windowCenter = Math.min(
    pageCount - margin - windowSize,
    Math.max(1 + margin + windowSize, currentPage)
  )
  let start = windowCenter - windowSize
  let end = windowCenter + windowSize
  if (start <= 1 + margin) {
    start = 1
  }
  if (end >= pageCount - margin) {
    end = pageCount
  }

  if (currentPage > 1) {
    pages.push('<')
  }
  if (start > 1) {
    pages.push(1) // always show first page
    pages.push('...')
  }
  for (let i = start; i <= end; i += 1) {
    pages.push(i) // show pages within window
  }
  if (end < pageCount) {
    pages.push('...')
    pages.push(pageCount) // always show last page
  }
  if (currentPage < pageCount) {
    pages.push('>')
  }
  return pages
}

export default getPages
