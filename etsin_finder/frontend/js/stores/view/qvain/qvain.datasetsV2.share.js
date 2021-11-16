import { action, computed, reaction, makeObservable, observable, runInAction } from 'mobx'
import axios from 'axios'

import PromiseManager from '../../../utils/promiseManager'
import urls from '../../../utils/urls'

import Modal from './modal'
import Tabs from './tabs'

const CancelToken = axios.CancelToken

const sortOpts = { numeric: true, sensitivity: 'base' }
const nameCompare = (a, b) => (a.name || '').localeCompare(b.name || '', undefined, sortOpts)

const roleValue = v => (v.role === 'creator' ? 0 : 1)
const roleCompare = (a, b) => roleValue(a) - roleValue(b)

const timeout = 20000

export const combineName = (firstName, lastName) => {
  const parts = []
  if (firstName) {
    parts.push(firstName)
  }
  if (lastName) {
    parts.push(lastName)
  }
  return parts.join(' ')
}

class Share {
  constructor() {
    this.promiseManager = new PromiseManager()
    this.modal = new Modal()
    this.tabs = new Tabs(
      { invite: 'qvain.datasets.share.tabs.invite', members: 'qvain.datasets.share.tabs.members' },
      'invite'
    )
    makeObservable(this)
    this.getTabItemCount = this.getTabItemCount.bind(this)
    this.isUpdatingUserPermission = this.isUpdatingUserPermission.bind(this)
    reaction(() => this.modal.isOpen, this.handleToggle)
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
    this.promiseManager.reset('search')
    if (!str) {
      this.setSearchResults([])
      return []
    }
    const cancelSource = CancelToken.source()
    const cancelToken = cancelSource.token
    const search = async () => {
      try {
        this.setSearchError(undefined)
        await Promise.delay(300)
        const resp = await axios.get(urls.ldap.searchUser(str), { cancelToken, timeout })

        const options = resp.data
        this.setSearchResults(options)
        return options
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error(e)
          this.setSearchError(e)
        }
        return []
      }
    }
    return this.promiseManager.add(search(), 'search', { onCancel: cancelSource.cancel })
  }

  @action.bound
  async sendInvite() {
    const invite = async () => {
      await axios.post(
        urls.qvain.datasetEditorPermissions(this.datasetIdentifier),
        { users: this.selectedUsers.map(u => u.uid) },
        { timeout }
      )
      this.resetValues()
      this.modal.close()
    }
    await this.promiseManager.add(invite(), 'invite')
  }

  @action.bound
  async fetchPermissions() {
    const fetchPerms = async () => {
      try {
        const resp = await axios.get(urls.qvain.datasetEditorPermissions(this.datasetIdentifier), {
          timeout,
        })
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
      } catch (err) {
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

  @action.bound
  async removeUserPermission(user) {
    const remove = async () => {
      try {
        await axios.delete(
          urls.qvain.datasetEditorPermissionsUser(this.datasetIdentifier, user.uid),
          { timeout }
        )
        const users = this.userPermissions.filter(u => u.uid !== user.uid)
        this.setUserPermissions(users)
      } catch (err) {
        this.setPermissionChangeError(err)
      }
    }

    this.setPermissionChangeError(undefined)
    await this.promiseManager.add(remove(), ['update-user', `update-user-${user.uid}`])
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
