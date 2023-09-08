/* Etsin stores
  This class stores the dataset for Etsin React components
*/
import { makeObservable, observable, action, computed } from 'mobx'
import checkNested from '@/utils/checkNested'
import { DATA_CATALOG_IDENTIFIER, ACCESS_TYPE_URL } from '@/utils/constants'

class EtsinDataset {
  constructor(Access) {
    makeObservable(this)
    this.Access = Access
  }

  @observable catalogRecord = null

  @observable relations = null

  @observable packages = null

  @observable files = null

  @observable versions = []

  @observable showCitationModal = false

  @observable inInfo = null

  @action setShowCitationModal = value => {
    this.showCitationModal = value
  }

  @action setInInfo = resource => {
    this.inInfo = resource
  }

  @computed get dataCatalog() {
    return this.catalogRecord?.data_catalog?.catalog_json
  }
  
  @computed get identifier() {
    return this.catalogRecord?.identifier
  }
  
  @computed get dataset() {
    return this.catalogRecord?.research_dataset
  }

  @computed get isDraft() {
    return (Boolean(this.dataset?.draft_of) || this.catalogRecord?.state === 'draft')
  }

  @computed get isPublished() {
    return !this.isDraft
  }

  @computed get isIda() {
    return this.dataCatalog?.identifier === DATA_CATALOG_IDENTIFIER.IDA
  }

  @computed get isPas() {
    return this.dataCatalog?.identifier === DATA_CATALOG_IDENTIFIER.PAS
  }

  @computed get isCumulative() {
    return this.catalogRecord?.cumulative_state === 1
  }

  @computed get isHarvested() {
    return this.dataCatalog?.harvested
  }

  @computed get isRemoved() {
    return Boolean(this.catalogRecord?.removed)
  }

  @computed get isDeprecated() {
    return Boolean(this.catalogRecord?.deprecated)
  }

  @computed get dateDeprecated() {
    return this.catalogRecord?.date_deprecated
  }

  @computed get isRems() {
    return this.accessRights?.access_type?.identifier === ACCESS_TYPE_URL.PERMIT
  }

  @computed get emailInfo() {
    return this.catalogRecord?.email_info
  }

  @computed get accessRights() {
    return checkNested(this.dataset, 'access_rights', 'access_type')
      ? this.dataset.access_rights
      : null
  }

  @computed get metadataFormats() {
    if(this.catalogRecord?.preservation_identifier?.includes('doi') || this.dataset?.preferred_identifier?.includes('doi')){
      return [{ value: 'metax' }, { value: 'datacite' }]
    }
    if(this.dataset?.preferred_identifier?.startsWith('urn:nbn:fi:att:') || this.dataset?.preferred_identifier?.startsWith('urn:nbn:fi:csc')){
      return [{ value: 'metax' }, { value: 'fairdata_datacite' }]
    }
    return [{ value: 'metax' }]
  }

  @computed get hasFiles() {
    return Boolean(this.files?.root?.directChildCount)
  }

  @computed get hasData() {
    if ((!this.hasFiles && !this.hasRemoteResources) || this.isRemoved || this.isDeprecated) {
      return false
    }
    if (this.hasFiles) {
      return this.Access.restrictions.allowDataIda
    }
    if (this.hasRemoteResources) {
      return this.Access.restrictions.allowDataRemote
    }
    return false
  }

  @computed get hasEvents() {
    return Boolean(
      this.hasVersion || 
      this.dataset.provenance?.length || 
      this.isDeprecated || 
      this.dataset.other_identifier?.length || 
      this.relations?.length
    )
  }

  @computed get hasMapData() {
    return Boolean(this.dataset?.spatial)
  }
  
  @computed get isDownloadAllowed() {
    return this.isPublished && (this.isIda || this.isPas) && this.Access.restrictions?.allowDataIdaDownloadButton
  }

  @computed get hasRemoteResources() {
    return this.dataset?.remote_resources !== undefined
  }

  @computed get remoteResources() {
    return this.dataset?.remote_resources
  }

  @computed get datasetVersions() {
    return this.catalogRecord?.dataset_version_set
  }

  @computed get hasVersion() {
    return this.versions.some(version => version.identifier !== this.identifier)
  }

  @computed get hasExistingVersion() {
    return this.versions.some(version => !version.isRemoved && version.identifier !== this.identifier)
  }
  
  @computed get hasRemovedVersion() { 
    return this.versions.some(version => version.isRemoved && version.identifier !== this.identifier)
  }

  @computed get versionTitles() {
    return this.versions.reduce((obj, val) => {
      obj[val.identifier] = val.dataset.title
      return obj
    }, {})
  }

  @computed get groupedRelations() {
    if (!this.relations?.length) {
      return null
    }

    return this.relations.reduce(
      (obj, val) => {
        if (val.type === 'other_identifier') {
          obj.otherIdentifiers.push(val)
        } else {
          obj.relations.push(val)
        }
        return obj
      },
      { otherIdentifiers: [], relations: [] }
    )
  }

  @computed get currentVersionDate() {
    return new Date(this.dataset?.date_created)
  }

  @computed get latestExistingVersionDate() {
    const existingVersions = (this.versions || []).filter(
      version => !version.catalogRecord.removed && !version.catalogRecord.deprecated
    )
    return new Date(Math.max(existingVersions.map(version => version.currentVersionDate)))
  }

  @computed get latestExistingVersionId() {
    if (!this.datasetVersions) return null
    return Object.values(this.datasetVersions).find(
      val => new Date(val.date_created).getTime() === this.latestExistingVersionDate.getTime()
    )
  }

  @computed get latestExistingVersionInfotext() {
    if (!this.datasetVersions) return null

    if (this.latestExistingVersionDate.getTime() > this.currentVersionDate.getTime()) {
      return {
        urlText: 'tombstone.urlToNew',
        linkToOtherVersion: 'tombstone.linkTextToNew',
      }
    }

    if (this.latestExistingVersionDate.getTime() < this.currentVersionDate.getTime()) {
      return {
        urlText: 'tombstone.urlToOld',
        linkToOtherVersion: 'tombstone.linkTextToOld',
      }
    }

    return null
  }

  @computed get draftInfotext() {
    return this.dataset?.draft_of ? 'dataset.draftInfo.changes' : 'dataset.draftInfo.draft'
  }

  @computed get downloadAllInfotext() {
    return this.isDraft ? 'dataset.dl.downloadDisabledForDraft' : 'dataset.dl.downloadAll'
  }

  @computed get tombstoneInfotext() {
    if (this.isRemoved) {
      return 'tombstone.removedInfo'
    }

    if (this.isDeprecated) {
      return 'tombstone.deprecatedInfo'
    }

    return null
  }

  @action.bound set(field, data) {
    const createVersion = _data => {
      const ds = new EtsinDataset()
      ds.set('dataset', _data)
      this.versions.push(ds)
    }

    switch (field) {
      case 'dataset':
        this.catalogRecord = data.catalog_record
        break
      case 'versions':
        createVersion(data)
        break
      default:
        this[field] = data
    }
  }
}

export default EtsinDataset
