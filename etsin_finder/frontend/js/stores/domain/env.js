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
import { RouterStore } from 'mobx-react-router'

const routingStore = new RouterStore()

class Env {
  @observable environment = process.env.NODE_ENV

  history = routingStore
}

export default new Env()
