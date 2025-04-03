import * as yup from 'yup'

import { observable, action, makeObservable } from 'mobx'
import axios from 'axios'
import urls from '../../utils/urls'

const emailSchema = yup
  .string()
  .typeError('dataset.validationMessages.email.string')
  .max(1000, 'dataset.validationMessages.email.max')
  .email('dataset.validationMessages.email.email')
  .nullable()

const requiredEmailSchema = emailSchema.required()

class Notifications {
  // Handling subscriptions to package generation notifications

  constructor(Packages) {
    this.Packages = Packages
    makeObservable(this)
  }

  @observable email = ''

  @observable emailError = null

  @action.bound reset() {
    this.email = ''
    this.emailError = null
  }

  @action.bound setEmailError(error) {
    this.emailError = error
  }

  @action.bound setEmail(email) {
    this.email = email

    // remove error if email is ok
    try {
      emailSchema.validateSync(this.email)
      this.emailError = null
    } catch (e) {
      // do nothing
    }
  }

  @action.bound validateEmail(required) {
    try {
      const schema = required ? requiredEmailSchema : emailSchema
      schema.validateSync(this.email)
      this.emailError = null
    } catch (e) {
      this.emailError = e.message
    }
  }

  subscribe = async params => {
    if (!this.Packages.Env.Flags.flagEnabled('DOWNLOAD_API_V2.EMAIL.FRONTEND')) {
      return
    }

    if (!this.email) {
      return
    }

    const subParams = {
      ...params,
      email: this.email,
    }
    try {
      const url = urls.metaxV3.download.subscriptions()
      await axios.post(url, subParams)
    } catch (err) {
      console.error(err)
      this.setEmailError(err)
    }
  }

  subscribeToPath = async path => {
    const params = this.Packages.getParamsForPath(path)
    this.subscribe(params)
  }
}

export default Notifications
