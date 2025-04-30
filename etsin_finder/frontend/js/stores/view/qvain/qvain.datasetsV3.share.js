import { override, runInAction } from 'mobx'

import { isAbort } from '@/utils/AbortClient'

import ShareV2 from './qvain.datasetsV2.share'

const sortOpts = { numeric: true, sensitivity: 'base' }
const nameCompare = (a, b) => (a.name || '').localeCompare(b.name || '', undefined, sortOpts)

const roleValue = v => (v.role === 'creator' ? 0 : 1)
const roleCompare = (a, b) => roleValue(a) - roleValue(b)

const timeout = 20000

class ShareV3 extends ShareV2 {
  @override
  async sendInvite() {
    const results = []
    const invite = async user => {
      let success = false
      try {
        await this.client.post(
          this.Env.metaxV3Url('datasetPermissionsEditors', this.datasetIdentifier),
          {
            username: user.uid,
            share_message: {
              service: 'qvain',
              content: this.inviteMessage,
            },
          },
          { timeout, tag: 'send-invite' }
        )
        success = true
      } catch (err) {
        console.error(err)
      }

      results.push({ ...user, success })
    }
    await this.promiseManager.add(Promise.all(this.selectedUsers.map(invite)), 'invite')
    this.setInviteResults({ users: results })
    this.fetchPermissions() // fetch in background
  }

  @override
  async fetchPermissions() {
    const fetchPerms = async () => {
      try {
        const resp = await this.client.get(
          this.Env.metaxV3Url('datasetPermissions', this.datasetIdentifier),
          {
            timeout,
            tag: 'fetch-permissions',
          }
        )
        const mapUsers = (users, role, is_member = false) =>
          users.map(user => ({
            uid: user.username,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email === '<hidden>' ? undefined : user.email,
            role,
            isProjectMember: is_member,
          }))

        const creators = mapUsers(resp.data.creators || [], 'creator')
        const editors = mapUsers(resp.data.editors || [], 'editor')
        const members = mapUsers(resp.data.csc_project_members || [], undefined, true)
        const users = [...creators, ...editors, ...members]
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

  getRemoveUserUrl(user) {
    return this.Env.metaxV3Url('datasetPermissionsEditor', this.datasetIdentifier, user.uid)
  }
}

export default ShareV3
