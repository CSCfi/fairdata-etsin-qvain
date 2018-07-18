/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable } from 'mobx'

// metax url
const metax =
  process.env.NODE_ENV !== 'production' ? 'https://metax-test.csc.fi' : 'https://metax-test.csc.fi'

class Env {
  @observable environment = process.env.NODE_ENV
  @observable metaxUrl = metax
}

export default new Env()
