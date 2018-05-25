import loadable from 'loadable-components'
import FancyLoader from '../components/general/fancyLoader'
import ErrorPage from '../components/errorpage'

export const Home = loadable(
  () => import('../components/frontpage' /* webpackChunkName: "frontpage" */),
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
  () => import('../components/dataset' /* webpackChunkName: "dataset" */),
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
  () => import('../components/search' /* webpackChunkName: "search" */),
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

export const About = loadable(() => import('../components/about' /* webpackChunkName: "about" */), {
  LoadingComponent: FancyLoader,
  ErrorComponent: ErrorPage,
  // render: ({ Component, loading, error, ownProps }) => {
  //   if (loading) return <FancyLoader />
  //   if (error) return <ErrorPage error="loaderror" />
  //   return <Component {...ownProps} />
  // },
})

// export const Organizations = loadable(
//   () => import(/* webpackChunkName: "organizations" */ '../components/organizations'),
//   {
//     LoadingComponent: FancyLoader,
//     ErrorComponent: ErrorPage,
//     // render: ({ Component, loading, error, ownProps }) => {
//     //   if (loading) return <FancyLoader />
//     //   if (error) return <ErrorPage error="loaderror" />
//     //   return <Component {...ownProps} />
//     // },
//   }
// )
