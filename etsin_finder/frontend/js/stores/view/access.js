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
  open: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open_access',
  closed: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/closed_access',
  embargoed: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargoed_access',
  restricted_access:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access',
  restricted_access_permit_fairdata:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_fairdata',
  restricted_access_permit_external:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_external',
  restricted_access_research:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_research',
  restricted_access_research_education_studying:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_education_studying',
  restricted_access_registration:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_registration',
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
      case accessTypes.closed:
        this.closed()
        break
      case accessTypes.embargoed:
        this.embargoed(access.available)
        break
      case accessTypes.restricted_access:
        this.restrictedAccess()
        break
      case accessTypes.restricted_access_permit_external:
        this.restrictedAccessPermitExternal()
        break
      case accessTypes.restricted_access_permit_fairdata:
        this.restrictedAccessPermitFairdata()
        break
      case accessTypes.restricted_access_registration:
        this.restrictedAccessRegistration()
        break
      case accessTypes.restricted_access_research:
        this.restrictedAccessResearch()
        break
      case accessTypes.restricted_access_research_education_studying:
        this.restrictedAccessResearchEducationStudying()
        break
      default:
        this.closed()
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
  closed() {
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
  embargoed(av) {
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
        allowRemote: false,
        allowRemoteDownload: false,
        allowDataIda: false,
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
  restrictedAccessPermitFairdata() {
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
  restrictedAccessPermitExternal() {
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
  restrictedAccessResearch() {
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
  restrictedAccessResearchEducationStudying() {
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

  @action
  restrictedAccessRegistration() {
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
