import loadable from 'loadable-components'

export const Home = loadable(() =>
  import(/* webpackChunkName: "frontpage" */ '../components/frontpage')
)
export const Dataset = loadable(() =>
  import(/* webpackChunkName: "dataset" */ '../components/dataset')
)
export const Search = loadable(() =>
  import(/* webpackChunkName: "search" */ '../components/search')
)
