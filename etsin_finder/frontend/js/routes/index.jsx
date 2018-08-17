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
