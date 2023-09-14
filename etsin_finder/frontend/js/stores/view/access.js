/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, makeObservable } from 'mobx'

import { ACCESS_TYPE_URL } from '../../utils/constants'

export const accessTypes = {
  open: ACCESS_TYPE_URL.OPEN,
  login: ACCESS_TYPE_URL.LOGIN,
  embargo: ACCESS_TYPE_URL.EMBARGO,
  permit: ACCESS_TYPE_URL.PERMIT,
  restricted: ACCESS_TYPE_URL.RESTRICTED,
}

class Access {
  constructor(Auth) {
    this.Auth = Auth
    makeObservable(this)
  }

  @observable
  restrictions = {
    // ?
    open: false,
    // toggles the whole remote resource tab. If it is shown, all is shown
    allowDataRemote: false,
    // toggles the whole ida file tab.
    allowDataIda: false,
    // toggles whether to download button is disabled or not for ida files/dirs
    allowDataIdaDownloadButton: false,
    // Special button, use case for rems datasets
    showREMSbutton: false,
    // The state of user application for resource in REMS
    applicationState: null,
  }

  updateAccess(access, hasPermit, state) {
    switch (access?.access_type?.identifier) {
      case accessTypes.open:
        this.open()
        break
      case accessTypes.embargo:
        this.embargoAccess(access.available)
        break
      case accessTypes.restricted:
        this.restrictedAccess()
        break
      case accessTypes.permit:
        this.permitAccess(hasPermit, state)
        break
      case accessTypes.login:
        this.loginAccess()
        break
      default:
        this.restrictedAccess()
    }
  }

  @action
  open() {
    this.restrictions = {
      open: true,
      allowDataRemote: true,
      allowDataIda: true,
      allowDataIdaDownloadButton: true,
      showREMSbutton: false,
      applicationState: null,
    }
  }

  @action
  embargoAccess(av) {
    const embargoDate = new Date(av)
    if (embargoDate < new Date()) {
      this.restrictions = {
        open: true,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: true,
        showREMSbutton: false,
        applicationState: null,
      }
    } else {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: false,
        showREMSbutton: false,
        applicationState: null,
        embargoDate: av,
      }
    }
  }

  @action
  restrictedAccess() {
    this.restrictions = {
      open: false,
      allowDataRemote: true,
      allowDataIda: true,
      allowDataIdaDownloadButton: false,
      showREMSbutton: false,
      applicationState: null,
    }
  }

  @action
  permitAccess(hasPermit, state) {
    if (hasPermit) {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: true,
        showREMSbutton: true,
        applicationState: state,
      }
    } else {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: false,
        showREMSbutton: true,
        applicationState: state,
      }
    }
  }

  @action
  loginAccess() {
    if (this.Auth.userLogged) {
      this.restrictions = {
        open: true,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: true,
        showREMSbutton: false,
        applicationState: null,
      }
    } else {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: false,
        showREMSbutton: false,
        applicationState: null,
      }
    }
  }
}

export default Access
