import Tabs from '@/stores/view/tabs'
import AbortClient from '@/utils/AbortClient'
import PromiseManager from '@/utils/promiseManager'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

class REMSApplications {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
    this.client = new AbortClient()
    this.promiseManager = new PromiseManager()
    this.tabs = new Tabs(
      {
        details: 'qvain.applications.modal.tabs.details',
        events: 'qvain.applications.modal.tabs.events',
      },
      'details'
    )
  }

  @observable filter = 'all'

  @observable applications = []

  @observable selectedApplication = null

  @observable selectedAction = null

  @observable commentText = ''

  @observable loadingApplications = false

  @action.bound async fetchApplications() {
    const exec = async () => {
      let url
      if (this.filter === 'todo') {
        url = this.Env.metaxV3Url('remsApplicationsTodo')
      } else if (this.filter === 'handled') {
        url = this.Env.metaxV3Url('remsApplicationsHandled')
      } else {
        url = this.Env.metaxV3Url('remsApplications')
      }
      const resp = await this.client.get(url)
      const data = [...resp.data]
      data.sort((a, b) => b['application/id'] - a['application/id'])
      data.forEach(d => {
        d.hasDetails = false
      })
      this.setApplications(data)
    }
    this.promiseManager.add(exec(), 'fetch-applications')
  }

  @computed get isLoadingApplications() {
    return this.promiseManager.count('fetch-applications') > 0
  }

  @action.bound async fetchSelectedApplicationDetails() {
    const application = this.selectedApplication
    if (!application) {
      return
    }
    const applicationId = application['application/id']
    const resource = application['application/resources'][0]
    const resourceExtId = resource['resource/ext-id']
    const datasetId = resourceExtId.split(':')[1]
    const appUrl = this.Env.metaxV3Url('remsApplication', applicationId)
    const datasetUrl = this.Env.metaxV3Url('dataset', datasetId)
    const [appResp, datasetResp] = await Promise.all([
      this.client.get(appUrl),
      this.client.get(datasetUrl),
    ])
    runInAction(() => {
      Object.assign(application, appResp.data)
      application.dataset = datasetResp.data
      application.hasDetails = true
    })
  }

  @action.bound async applicationAction(action) {
    const application = this.selectedApplication
    const applicationId = application['application/id']
    let url
    if (action === 'approve') {
      url = this.Env.metaxV3Url('remsApplicationApprove', applicationId)
    } else if (action === 'reject') {
      url = this.Env.metaxV3Url('remsApplicationReject', applicationId)
    } else if (action === 'close') {
      url = this.Env.metaxV3Url('remsApplicationClose', applicationId)
    } else if (action === 'return') {
      url = this.Env.metaxV3Url('remsApplicationReturn', applicationId)
    } else {
      console.error('Unknown action', action)
    }
    let payload = null
    if (this.commentText) {
      payload = { comment: this.commentText }
    }
    await this.client.post(url, payload)
    await this.fetchSelectedApplicationDetails()
    this.setCommentText('')
    this.setSelectedAction(null)
  }

  @action.bound approveApplication() {
    return this.applicationAction('approve')
  }

  @action.bound rejectApplication() {
    return this.applicationAction('reject')
  }

  @action.bound closeApplication() {
    return this.applicationAction('close')
  }

  @action.bound returnApplication() {
    return this.applicationAction('return')
  }

  @action.bound setApplications(applications) {
    this.applications = applications
  }

  @action.bound setFilter(value) {
    this.filter = value
  }

  @action.bound setSelectedApplication(application) {
    this.selectedApplication = application
    this.setCommentText('')
    this.setSelectedAction(null)
  }

  @action.bound setSelectedAction(action) {
    this.selectedAction = action
  }

  @action.bound setCommentText(value) {
    this.commentText = value
  }
}

export default REMSApplications
