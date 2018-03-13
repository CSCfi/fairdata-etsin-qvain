import loadable from 'loadable-components'
import FancyLoader from '../components/general/fancyLoader'
import ErrorPage from '../components/errorpage'

export const Home = loadable(
  () => import(/* webpackChunkName: "frontpage" */ '../components/frontpage'),
  {
    LoadingComponent: FancyLoader,
    ErrorComponent: ErrorPage,
    // render: ({ Component, loading, error, ownProps }) => {
    //   if (loading) return <FancyLoader />
    //   if (error) return <ErrorPage error="loaderror" />
    //   return <Component {...ownProps} />
    // },
  }
)

export const Dataset = loadable(
  () => import(/* webpackChunkName: "dataset" */ '../components/dataset'),
  {
    LoadingComponent: FancyLoader,
    ErrorComponent: ErrorPage,
    // render: ({ Component, loading, error, ownProps }) => {
    //   if (loading) return <FancyLoader />
    //   if (error) return <ErrorPage error="loaderror" />
    //   return <Component {...ownProps} />
    // },
  }
)

export const Search = loadable(
  () => import(/* webpackChunkName: "search" */ '../components/search'),
  {
    LoadingComponent: FancyLoader,
    ErrorComponent: ErrorPage,
    // render: ({ Component, loading, error, ownProps }) => {
    //   if (loading) return <FancyLoader />
    //   if (error) return <ErrorPage error="loaderror" />
    //   return <Component {...ownProps} />
    // },
  }
)

export const About = loadable(() => import(/* webpackChunkName: "about" */ '../components/about'), {
  LoadingComponent: FancyLoader,
  ErrorComponent: ErrorPage,
  // render: ({ Component, loading, error, ownProps }) => {
  //   if (loading) return <FancyLoader />
  //   if (error) return <ErrorPage error="loaderror" />
  //   return <Component {...ownProps} />
  // },
})

export const Organizations = loadable(
  () => import(/* webpackChunkName: "organizations" */ '../components/organizations'),
  {
    LoadingComponent: FancyLoader,
    ErrorComponent: ErrorPage,
    // render: ({ Component, loading, error, ownProps }) => {
    //   if (loading) return <FancyLoader />
    //   if (error) return <ErrorPage error="loaderror" />
    //   return <Component {...ownProps} />
    // },
  }
)
