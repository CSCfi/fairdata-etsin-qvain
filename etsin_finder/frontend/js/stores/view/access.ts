import { observable, action } from 'mobx'

import { ACCESS_TYPE_URL } from '../../utils/constants'
import type Auth from '../domain/auth'

export const accessTypes = {
  open: ACCESS_TYPE_URL.OPEN,
  login: ACCESS_TYPE_URL.LOGIN,
  embargo: ACCESS_TYPE_URL.EMBARGO,
  permit: ACCESS_TYPE_URL.PERMIT,
  restricted: ACCESS_TYPE_URL.RESTRICTED,
}

interface AccessType {
  url: string
}

type ApprovalType = 'manual' | 'automatic'

interface DatasetAccess {
  available?: string
  access_type: AccessType
  rems_approval_type?: ApprovalType
}

interface AccessDataCatalog {
  rems_enabled: boolean
}

type ApplicationState =
  | 'apply'
  | 'draft'
  | 'returned'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'disabled'
  | null

export interface Restrictions {
  open: boolean
  allowDataRemote: boolean
  allowDataIda: boolean
  allowDataIdaDownloadButton: boolean
  showREMSbutton: boolean
  applicationState?: ApplicationState
  embargoDate?: Date
}

class Access {
  Auth: Auth

  constructor(Auth: Auth) {
    this.Auth = Auth
  }

  @observable accessor restrictions: Restrictions = {
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
    applicationState: undefined,
    // Embargo expiration date
    embargoDate: undefined,
  }

  updateAccess(
    access: DatasetAccess,
    hasPermit: boolean,
    applicationState: ApplicationState,
    dataCatalog: AccessDataCatalog
  ) {
    switch (access?.access_type?.url) {
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
        this.permitAccess(access.rems_approval_type, hasPermit, applicationState, dataCatalog)
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
  embargoAccess(av: string | undefined) {
    let embargoDate: Date | undefined
    if (av) {
      embargoDate = new Date(av)
      if (embargoDate < new Date()) {
        this.restrictions = {
          open: true,
          allowDataRemote: true,
          allowDataIda: true,
          allowDataIdaDownloadButton: true,
          showREMSbutton: false,
          applicationState: null,
        }
        return
      }
    }

    this.restrictions = {
      open: false,
      allowDataRemote: true,
      allowDataIda: true,
      allowDataIdaDownloadButton: false,
      showREMSbutton: false,
      applicationState: null,
      embargoDate,
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
  permitAccess(
    remsApprovalType: ApprovalType | undefined,
    hasPermit: boolean,
    applicationState: ApplicationState,
    dataCatalog: AccessDataCatalog
  ) {
    if (hasPermit) {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: true,
        showREMSbutton: true,
        applicationState,
      }
    } else {
      this.restrictions = {
        open: false,
        allowDataRemote: true,
        allowDataIda: true,
        allowDataIdaDownloadButton: false,
        showREMSbutton: !!(remsApprovalType && dataCatalog?.rems_enabled),
        applicationState,
      }
    }
  }

  @action
  loginAccess() {
    if (this.Auth.isAuthenticated) {
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
