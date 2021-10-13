import { action, computed, reaction, makeObservable, observable } from 'mobx'
import axios from 'axios'

import PromiseManager from '../../../utils/promiseManager'

import Modal from './modal'
import Tabs from './tabs'

const CancelToken = axios.CancelToken

export const combineName = (first, last) => {
  const parts = []
  if (first) {
    parts.push(first)
  }
  if (last) {
    parts.push(last)
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
    reaction(() => this.modal.isOpen, this.handleToggle)
  }

  @observable searchError = undefined

  @observable searchResults = []

  @observable selectedUsers = []

  @observable inviteMessage = ''

  @observable confirmClose = false

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
    this.inviteMessage = ''
    this.confirmClose = false
  }

  @computed get hasUnsentInvite() {
    return this.selectedUsers.length > 0 || this.inviteMessage.trim().length > 0
  }

  @computed get isInviting() {
    return this.promiseManager.count('invite') > 0
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

        const first = arr => arr?.[0]
        const options = resp.data.map(person => ({
          uid: first(person.attributes.uid),
          name: combineName(first(person.attributes.givenName), first(person.attributes.sn)),
          email: first(person.attributes.mail),
        }))
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

  async fetchPermissions() {
    // TODO: fetch user and project permissions
  }

  @action.bound
  setInviteMessage(message) {
    this.inviteMessage = message
  }
}

export default Share
