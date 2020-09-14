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
import loadable from '@loadable/component'
// eslint-disable-next-line
export const Home = loadable(() => import('../components/frontpage'))

export const Dataset = loadable(() => import('../components/dataset' /* webpackPrefetch: true */))
// eslint-disable-next-line
export const Search = loadable(() => import('../components/search' /* webpackPrefetch: true */))

export const Qvain = loadable(() => import('../components/qvain/main' /* webpackPrefetch: true */))

export const QvainDatasets = loadable(() =>
  import('../components/qvain/datasets' /* webpackPrefetch: true */)
)
