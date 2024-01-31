export default {
  name: 'Search',
  searchBar: 'Search bar',
  placeholder: 'Search term',
  sorting: {
    sort: 'Sort',
    best: 'Most relevant',
    bestTitle: 'Relevance',
    dateA: 'Oldest first',
    dateATitle: 'Oldest',
    dateD: 'Last modified',
    dateDTitle: 'Newest',
  },
  filter: {
    clearFilter: 'Remove filters',
    filtersCleared: 'Filters cleared',
    filters: 'Filters',
    filter: 'Filter',
    SRactive: 'active',
    show: 'More',
    hide: 'Less',
  },
  pagination: {
    prev: 'Previous page',
    next: 'Next page',
    skipped: 'Skipped pages indicator',
    page: 'Page %(page)s',
    currentpage: 'Current page %(page)s',
    pagination: 'Pagination',
    changepage: 'Page %(value)s',
  },
  noResults: {
    searchterm: 'Your search - <strong>%(search)s</strong> - did not match any documents.',
    nosearchterm: 'Your search did not match any documents.',
  },
  aggregations: {
    access_type: {
      title: 'Access',
    },
    organization: {
      title: 'Organization',
    },
    creator: {
      title: 'Creator',
    },
    field_of_science: {
      title: 'Field of Science',
    },
    keyword: {
      title: 'Keyword',
    },
    infrastructure: {
      title: 'Research Infra',
    },
    project: {
      title: 'Project',
    },
    file_type: {
      title: 'File Type',
    },
    data_catalog: {
      title: 'Data Catalog',
    },
  },
}
