import { action, computed, reaction, makeObservable, observable } from 'mobx'
import axios from 'axios'

import PromiseManager from '../../../utils/promiseManager'

import Modal from './modal'
import Tabs from './tabs'

const CancelToken = axios.CancelToken

const first = arr => arr?.[0]

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

const toPerson = ({ attributes }) => ({
  uid: first(attributes.uid),
  name: combineName(first(attributes.givenName), first(attributes.sn)),
  email: first(attributes.mail),
})

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
    reaction(() => this.modal.isOpen, this.handleToggle)
  }

  @observable searchError = undefined

  @observable searchResults = []

  @observable selectedUsers = []

  @observable inviteMessage = ''

  @observable confirmClose = false

  @observable userPermissions = []

  handleToggle = isOpen => {
    if (isOpen) {
      this.fetchPermissions()
    } else {
      this.resetValues()
    }
  }

  @action.bound resetValues() {
    this.error = undefined
    this.searchResults = []
    this.selectedUsers = []
    this.userPermissions = []
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
        const resp = await axios.get(`/api/ldap/users/${str}`, { cancelToken, timeout: 10000 })

        const options = resp.data.map(toPerson)
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
    // TODO: send invitation
    const invite = async () => {
      await Promise.delay(2000)
      this.resetValues()
      this.modal.close()
    }
    await this.promiseManager.add(invite(), 'invite')
  }

  @action.bound
  async setSearchResults(results) {
    this.searchResults.replace(results)
  }

  @action.bound
  setUserPermissions(perms) {
    this.userPermissions = perms
  }

  async fetchPermissions() {
    // TODO: fetch user and project permissions

    const fetchPerms = async () => {
      await Promise.delay(5000)

      this.setUserPermissions([
        {
          uid: 'teppo',
          name: 'teppo testaaja',
          email: 'teppo@example.com',
          isProjectMember: true,
          role: 'owner',
        },
        {
          uid: 'other',
          name: 'Other Person',
          email: 'other@example.com',
          isProjectMember: false,
          role: 'editor',
        },
        {
          uid: 'longname',
          name: 'Longlong von Longlonglonglongname',
          email: 'long@example.com',
          isProjectMember: true,
        },
      ])
    }

    await this.promiseManager.add(fetchPerms(), 'permissions')
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
