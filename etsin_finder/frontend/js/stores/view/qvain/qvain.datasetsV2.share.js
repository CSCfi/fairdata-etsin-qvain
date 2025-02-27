import { action, computed, reaction, makeObservable, observable, runInAction } from 'mobx'

import AbortClient, { isAbort } from '@/utils/AbortClient'
import PromiseManager from '../../../utils/promiseManager'
import urls from '../../../utils/urls'

import Modal from './modal'
import Tabs from './tabs'

const sortOpts = { numeric: true, sensitivity: 'base' }
const nameCompare = (a, b) => (a.name || '').localeCompare(b.name || '', undefined, sortOpts)

const roleValue = v => (v.role === 'creator' ? 0 : 1)
const roleCompare = (a, b) => roleValue(a) - roleValue(b)

const timeout = 20000

class Share {
  constructor(Env, Auth, QvainDatasets) {
    this.Env = Env
    this.Auth = Auth
    this.QvainDatasets = QvainDatasets
    this.promiseManager = new PromiseManager()
    this.modal = new Modal()
    this.tabs = new Tabs(
      { invite: 'qvain.datasets.share.tabs.invite', members: 'qvain.datasets.share.tabs.members' },
      'invite'
    )
    makeObservable(this)
    this.getTabItemCount = this.getTabItemCount.bind(this)
    this.isUpdatingUserPermission = this.isUpdatingUserPermission.bind(this)
    this.isRemovingUserPermission = this.isRemovingUserPermission.bind(this)
    reaction(() => this.modal.isOpen, this.handleToggle)
    this.client = new AbortClient()
  }

  @observable searchError = undefined

  @observable permissionLoadError = undefined

  @observable permissionChangeError = undefined

  @observable searchResults = []

  @observable selectedUsers = []

  @observable inviteMessage = ''

  @observable confirmClose = false

  @observable userPermissions = []

  @observable project = undefined

  @observable userPermissionToRemove = undefined

  @observable inviteResults = undefined

  @computed get datasetIdentifier() {
    return this.modal.data?.dataset.identifier
  }

  handleToggle = isOpen => {
    if (isOpen) {
      this.fetchPermissions()
    } else {
      this.resetValues()
    }
  }

  @action.bound resetValues() {
    this.searchError = undefined
    this.permissionLoadError = undefined
    this.permissionChangeError = undefined
    this.searchResults = []
    this.selectedUsers = []
    this.userPermissions = []
    this.project = undefined
    this.inviteMessage = ''
    this.confirmClose = false
    this.userPermissionToRemove = undefined
    this.inviteResults = undefined
  }

  @computed get hasInviteResults() {
    return !!this.inviteResults
  }

  @computed get hasUnsentInvite() {
    return this.selectedUsers.length > 0
  }

  @computed get isInviting() {
    return this.promiseManager.count('invite') > 0
  }

  @computed get isLoadingPermissions() {
    return this.promiseManager.count('permissions') > 0
  }

  @action.bound
  requestCloseModal() {
    if (this.isInviting) {
      return
    }
    if (this.hasInviteResults) {
      this.setInviteResults(undefined)
    } else if (this.hasUnsentInvite) {
      this.setConfirmClose(true)
    } else {
      this.modal.close()
    }
  }

  @action.bound
  setConfirmClose(confirmClose) {
    this.confirmClose = confirmClose
  }

  @action.bound
  setSelectedUsers(users) {
    this.selectedUsers.replace(users)
  }

  @action.bound
  setSearchError(err) {
    this.searchError = err
  }

  @action.bound
  async searchUsers(str) {
    this.client.abort('search')
    if (!str) {
      this.setSearchResults([])
      return []
    }
    const search = async () => {
      try {
        this.setSearchError(undefined)
        await Promise.delay(300)
        const resp = await this.client.get(urls.ldap.searchUser(str), { timeout, tag: 'search' })

        const options = resp.data
        this.setSearchResults(options)
        return options
      } catch (e) {
        if (!isAbort(e)) {
          console.error(e)
          this.setSearchError(e)
        }
        return []
      }
    }
    return this.promiseManager.add(search(), 'search')
  }

  @action.bound
  async sendInvite() {
    const invite = async () => {
      const resp = await this.client.post(
        urls.qvain.datasetEditorPermissions(this.datasetIdentifier),
        { users: this.selectedUsers.map(u => u.uid), message: this.inviteMessage },
        { timeout, tag: 'send-invite' }
      )
      this.setInviteResults(resp.data)
      this.fetchPermissions() // fetch in background
    }
    await this.promiseManager.add(invite(), 'invite')
  }

  @action.bound
  removeAddedUsersFromSelected() {
    // Remove users that already have permissions from selection.
    const successes = this.userPermissions.filter(u => u.role).map(u => u.uid)
    const unsuccessful = this.selectedUsers.filter(u => !successes.includes(u.uid))
    this.setSelectedUsers(unsuccessful)
  }

  @action.bound
  async fetchPermissions() {
    const fetchPerms = async () => {
      try {
        const resp = await this.client.get(
          urls.qvain.datasetEditorPermissions(this.datasetIdentifier),
          {
            timeout,
            tag: 'fetch-permissions',
          }
        )
        const users = (resp.data.users || []).map(user => ({
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
          isProjectMember: user.is_project_member,
        }))
        users.sort(nameCompare)
        users.sort(roleCompare) // creator first
        this.setUserPermissions(users)
        this.setProject(resp.data.project)
        this.removeAddedUsersFromSelected()
      } catch (err) {
        if (isAbort(err)) {
          return
        }
        this.setUserPermissions([])
        console.error(err)
        runInAction(() => {
          this.permissionLoadError = err
        })
      }
    }

    await this.promiseManager.add(fetchPerms(), 'permissions')
  }

  isUpdatingUserPermission(user) {
    return this.promiseManager.count(`update-user-${user.uid}`) > 0
  }

  isRemovingUserPermission(user) {
    return this.promiseManager.count(`remove-user-${user.uid}`) > 0
  }

  getRemoveUserUrl(user) {
    return urls.qvain.datasetEditorPermissionsUser(this.datasetIdentifier, user.uid)
  }

  @action.bound
  async removeUserPermission(user) {
    const loseAccess = this.loseAccessIfRemoved
    const remove = async () => {
      try {
        await this.client.delete(this.getRemoveUserUrl(user), { timeout, tag: 'delete' })

        const perms = [...this.userPermissions]
        const index = perms.findIndex(p => p.uid === user.uid)

        // remove only role if user is project member
        if (index >= 0) {
          perms[index] = { ...perms[index] }
          if (perms[index].isProjectMember) {
            delete perms[index].role
          } else {
            perms.splice(index, 1)
          }

          this.setUserPermissions(perms)
        }
        this.setPermissionChangeError(undefined)

        if (loseAccess) {
          // User no longer has access to dataset, remove from list
          this.QvainDatasets.removeDataset(this.modal.data.dataset)
          this.modal.close()
        }

        return true
      } catch (err) {
        this.setPermissionChangeError(err)
        return false
      }
    }

    this.setPermissionChangeError(undefined)
    const success = await this.promiseManager.add(remove(), [
      'remove-user',
      `remove-user-${user.uid}`,
    ])
    return success
  }

  @action.bound
  requestRemoveUserPermission(user) {
    this.userPermissionToRemove = user
  }

  @computed
  get loseAccessIfRemoved() {
    // Return true if logged in user will lose access to dataset when permission is removed
    const perm = this.userPermissionToRemove
    if (!perm) {
      return false
    }
    return perm.uid === this.Auth.userName && !perm.isProjectMember
  }

  @action.bound
  async confirmRemoveUserPermission() {
    const success = await this.removeUserPermission(this.userPermissionToRemove)
    if (success) {
      this.requestRemoveUserPermission(undefined)
    }
  }

  @action.bound
  cancelRemoveUserPermission() {
    this.userPermissionToRemove = undefined
    this.setPermissionChangeError(undefined)
  }

  @action.bound
  async setSearchResults(results) {
    this.searchResults.replace(results)
  }

  @action.bound
  setProject(project) {
    this.project = project
  }

  @action.bound
  setPermissionChangeError(error) {
    this.permissionChangeError = error
  }

  @action.bound
  setUserPermissions(perms) {
    this.userPermissions = perms
  }

  @action.bound
  setInviteMessage(message) {
    this.inviteMessage = message
  }

  @action.bound
  setInviteResults(results) {
    this.inviteResults = results
  }

  @computed get inviteSuccessUsers() {
    if (!this.inviteResults?.users) {
      return []
    }
    return this.inviteResults.users.filter(user => user.success)
  }

  @computed get inviteFailUsers() {
    if (!this.inviteResults?.users) {
      return []
    }
    return this.inviteResults.users.filter(user => !user.success)
  }

  getTabItemCount(tab) {
    if (tab === 'members') {
      if (this.isLoadingPermissions) {
        return { count: 0, loading: true }
      }
      return { count: this.userPermissions.length, loading: false }
    }
    return undefined
  }
}

export default Share
