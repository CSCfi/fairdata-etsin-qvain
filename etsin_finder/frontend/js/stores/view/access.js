/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, computed } from 'mobx'

import auth from '../domain/auth'

const accessTypes = {
  open: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  login: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
  embargo: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  permit: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  restricted: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted'
}

class Access {
  @observable
  restrictions = {
    // toggles access icon: locked => unlocked
    open: false,
    allowRemote: false,
    allowRemoteDownload: false,
    allowDataIda: false,
    // currently both buttons are disabled always at the same time
    allowDataInfoButton: false,
    allowDataDownload: false,
    allowAskForAccess: false,
  }

  @computed
  get accessDataTab() {
    return this.restrictions.allowRemote || this.restrictions.allowDataIda
  }

  updateAccess(access) {
    switch (access.access_type.identifier) {
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
        this.permitAccess()
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
      allowRemote: true,
      allowRemoteDownload: true,
      allowDataIda: true,
      allowDataInfoButton: true,
      allowDataDownload: true,
      allowAskForAccess: false,
    }
  }

  @action
  embargoAccess(av) {
    if (new Date(av).getTime() < new Date().getTime()) {
      this.restrictions = {
        open: true,
        allowRemote: true,
        allowRemoteDownload: true,
        allowDataIda: true,
        allowDataInfoButton: true,
        allowDataDownload: true,
        allowAskForAccess: false,
      }
    } else {
      this.restrictions = {
        open: false,
        allowRemote: true,
        allowRemoteDownload: true,
        allowDataIda: true,
        allowDataInfoButton: false,
        allowDataDownload: false,
        allowAskForAccess: false,
      }
    }
  }

  @action
  restrictedAccess() {
    this.restrictions = {
      open: false,
      allowRemote: true,
      allowRemoteDownload: true,
      allowDataIda: true,
      allowDataInfoButton: false,
      allowDataDownload: false,
      allowAskForAccess: false,
    }
  }

  @action
  permitAccess() {
    // TODO: check if user has permission
    // these are the default permissions
    // this can not be checked yet
    this.restrictions = {
      open: false,
      allowRemote: true,
      allowRemoteDownload: true,
      allowDataIda: true,
      allowDataInfoButton: false,
      allowDataDownload: false,
      allowAskForAccess: true,
    }
  }

  @action
  loginAccess() {
    if (auth.userLogged) {
      this.restrictions = {
        open: false,
        allowRemote: true,
        allowRemoteDownload: true,
        allowDataIda: true,
        allowDataInfoButton: true,
        allowDataDownload: true,
        allowAskForAccess: false,
      }
    } else {
      this.restrictions = {
        open: false,
        allowRemote: true,
        allowRemoteDownload: true,
        allowDataIda: true,
        allowDataInfoButton: false,
        allowDataDownload: false,
        allowAskForAccess: false,
      }
    }
  }
}

export default new Access()
