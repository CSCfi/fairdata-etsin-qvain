import { observable, action, makeObservable, computed } from 'mobx'

class QvainAdminOrg {
  constructor(Env, Auth, Locale, Qvain) {
    this.Env = Env
    this.Auth = Auth
    this.Locale = Locale
    this.Qvain = Qvain
    makeObservable(this)
  }

  @observable selectedAdminOrg

  @observable confirmationSelected = false

  @computed get adminOrgOptions() {
    const options = this.Auth.user.available_admin_organizations.map(org => ({
      value: org.id,
      label: this.Locale.getValueTranslation(org.pref_label),
    }))
    if (!options.find(org => org.value === this.Auth.user.default_admin_organization?.id)) {
      options.push({
        value: 'not-selected',
        label: this.Locale.getValueTranslation({ en: '<Not selected>', fi: '<Ei valittu>' }),
      })
    }
    return options
  }

  @action.bound setSelectedAdminOrg(adminOrg) {
    if (adminOrg?.value === this.selectedAdminOrg?.value) {
      return
    }
    this.selectedAdminOrg = adminOrg
    this.setConfirmationSelected(false)
  }

  @action.bound selectDefaultAdminOrg() {
    if (this.Qvain.isNewDataset) {
      let defaultAdminOrg
      if (this.Auth.user?.default_admin_organization === null) {
        defaultAdminOrg = this.adminOrgOptions.find(org => org.value === 'not-selected')
      } else {
        defaultAdminOrg = this.adminOrgOptions.find(
          org => org.value === this.Auth.user?.default_admin_organization?.id
        )
      }

      this.setSelectedAdminOrg(defaultAdminOrg)
    } else {
      let originalAdminOrg
      if (!this.Qvain.original?.metadata_owner_admin_org) {
        originalAdminOrg = this.adminOrgOptions.find(org => org.value === 'not-selected')
      } else {
        originalAdminOrg = this.adminOrgOptions.find(
          org => org.value === this.Qvain.original?.metadata_owner_admin_org
        )
      }
      this.setSelectedAdminOrg(originalAdminOrg)
      this.setConfirmationSelected(true)
    }
  }
  @action.bound reset() {
    this.selectDefaultAdminOrg()
    this.setConfirmationSelected(false)
  }

  @action.bound setConfirmationSelected(confirmationSelected) {
    this.confirmationSelected = confirmationSelected
    this.Qvain.Submit.prevalidate()
  }
}

export default QvainAdminOrg
