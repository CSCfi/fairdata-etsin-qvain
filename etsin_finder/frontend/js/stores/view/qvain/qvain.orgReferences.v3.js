import { action, makeObservable, observable, runInAction } from 'mobx'
import axios from 'axios'

class OrgReferences {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
  }

  @observable data = {
    organizations: {},
  }

  @observable loading = {
    organizations: {},
  }

  @observable errors = {
    organizations: {},
  }

  @action.bound isLoading(referenceName, scope) {
    const loading = this.loading[referenceName]
    return scope ? loading[scope] : loading
  }

  getOrganizationSearchUrl(parent) {
    const url = new URL(this.Env.metaxV3Url('organizations'))
    if (parent) {
      url.searchParams.set('parent', parent.id)
    }
    return url.toString()
  }

  @action.bound async fetchOrganizations(parent) {
    // Fetch child reference organizations of parent organization,
    // or all top-level organizations if no parent is defined.
    if (parent && parent.isReference === false) {
      return []
    }

    const parentId = parent?.id || ''
    if (this.data.organizations[parentId]) {
      return this.data.organizations[parentId]
    }
    if (this.data.organizations[parentId]) {
      return this.loading.organizations[parentId]
    }

    delete this.errors.organizations[parentId]

    // eslint-disable-next-line no-async-promise-executor
    const url = this.getOrganizationSearchUrl(parent)
    let orgs
    try {
      const response = axios.get(url)
      orgs = (await response).data

      runInAction(() => {
        this.loading.organizations[parentId] = null
        this.data.organizations[parentId] = orgs
        delete this.errors.organizations[parentId]
      })
    } catch (err) {
      runInAction(() => {
        this.loading.organizations[parentId] = null
        this.errors.organizations[parentId] = err
      })
    }
    return this.loading.organizations[parentId]
  }
}

export default OrgReferences
