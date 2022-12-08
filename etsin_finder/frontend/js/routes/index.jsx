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

export const Home = loadable(() => import('../components/frontpage' /* webpackPrefetch: true */))

export const Dataset = loadable(() => import('../components/dataset' /* webpackPrefetch: true */))

export const Search = loadable(() => import('../components/search' /* webpackPrefetch: true */))

export const Qvain = loadable(() =>
  import('../components/qvain/views/main' /* webpackPrefetch: true */)
)

export const QvainDatasetsV2 = loadable(() =>
  import('../components/qvain/views/datasetsV2' /* webpackPrefetch: true */)
)
