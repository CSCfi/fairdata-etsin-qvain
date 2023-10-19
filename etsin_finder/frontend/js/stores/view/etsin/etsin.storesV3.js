import { makeObservable, observable, action, computed } from 'mobx'
import { DATA_CATALOG_IDENTIFIER, ACCESS_TYPE_URL } from '@/utils/constants'
import Cite from './cite'

class EtsinDatasetV3 {
  constructor({ Access, Locale }) {
    this.Access = Access
    this.Locale = Locale
    this.citations = new Cite({ Stores: this, Locale })
    makeObservable(this)
  }

  useV3 = true

  @observable dataset = null

  @observable relations = null

  @observable packages = null

  @observable files = null

  @observable versions = []

  @observable showCitationModal = false

  @observable inInfo = null

  @computed get dataCatalog() {
    // waiting for V3 implementation, this is a placeholder
    return {
      identifier: this.dataset?.data_catalog,
      title: { en: 'placeholder' },
      publisher: {
        name: { en: 'Placeholder Publisher' },
        homepage: [{ identifier: 'https://example.com' }],
      },
    }
  }

  @computed get persistentIdentifier() {
    return this.dataset?.persistent_identifier || this.identifier
  }

  @computed get identifier() {
    return this.dataset?.id
  }

  @computed get otherIdentifiers() {
    return this.dataset?.other_identifiers
  }

  @computed get accessRights() {
    return this.dataset?.access_rights
  }

  @computed get draftOf() {
    // waiting for V3 implementation
    console.warn('no draft implementation yet in metax V3')
    return null
  }

  @computed get isDraft() {
    // waiting for V3 implementation
    console.warn('no draft implementation yet in metax V3')
    return false
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
    return this.dataset?.cumulative_state === 1
  }

  @computed get isHarvested() {
    console.warn('no harvested info implementation yet in metax V3')
    return false
  }
  
  @computed get isRemoved() {
    return Boolean(this.dataset?.is_removed)
  }

  @computed get isDeprecated() {
    return Boolean(this.dataset?.is_deprecated)
  }

  @computed get dateDeprecated() {
    console.warn('no deprecation date implementation yet in metax V3')
    return null
  }

  @computed get isRems() {
    return this.accessRights.access_type.url === ACCESS_TYPE_URL.PERMIT
  }

  @computed get datasetMetadata() {
    return {
      releaseDate: this.dataset?.issued,
      modified: this.dataset?.modified,
      title: this.dataset?.title,
      description: this.dataset?.description || undefined,
      fieldOfScience: this.dataset?.field_of_science,
      subjectHeading: this.dataset?.theme,
      keywords: this.dataset?.keyword,
      language: this.dataset?.language,
      spatial: this.shapeSpatial(this.dataset?.spatial),
      temporal: undefined, // waiting for V3 implementation
      projects: undefined, // waiting for V3 implementation
      infrastructure: undefined, // waiting for V3 implementation
    }
  }

  @computed get provenance() {
    return this.dataset?.provenance
  }

  @computed get preservation() {
    // waiting for V3 implementation
    return {
      identifier: undefined,
      state: undefined,
      stateModified: undefined,
      useCopy: undefined,
      preservedCopy: undefined,
    }
  }

  @computed get emailInfo() {
    // waiting for V3 implementation
    return null
  }

  @computed get metadataFormats() {
    if (
      this.preservation.identifier?.includes('doi') ||
      this.persistentIdentifier?.includes('doi')
    ) {
      return [{ value: 'metax' }, { value: 'datacite' }]
    }
    if (
      this.persistentIdentifier?.startsWith('urn:nbn:fi:att:') ||
      this.persistentIdentifier?.startsWith('urn:nbn:fi:csc')
    ) {
      return [{ value: 'metax' }, { value: 'fairdata_datacite' }]
    }
    return [{ value: 'metax' }]
  }

  @computed get hasFiles() {
    return Boolean(this.files?.root?.existingDirectChildCount)
  }

  @computed get hasRemoteResources() {
    // waiting for V3 implementation
    return false
  }

  @computed get remoteResources() {
    // waiting for V3 implementation
    return null
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
      this.provenance?.length ||
      this.isDeprecated ||
      this.otherIdentifiers?.length ||
      this.relations?.length
    )
  }

  @computed get hasMapData() {
    return Boolean(this.datasetMetadata?.spatial)
  }

  @computed get isDownloadAllowed() {
    return (
      this.isPublished &&
      (this.isIda || this.isPas) &&
      this.Access.restrictions?.allowDataIdaDownloadButton
    )
  }

  @computed get datasetVersions() {
    // waiting for V3 implementation
    return null
  }

  @computed get hasVersion() {
    return this.versions.some(version => version.identifier !== this.identifier)
  }

  @computed get hasExistingVersion() {
    return this.versions.some(
      version => !version.isRemoved && version.identifier !== this.identifier
    )
  }

  @computed get hasRemovedVersion() {
    return this.versions.some(
      version => version.isRemoved && version.identifier !== this.identifier
    )
  }

  @computed get deletedVersions() {
    if (!this.datasetVersions) return []
    return this.datasetVersions
      .map((single, i, set) => ({
        removed: single.removed,
        dateRemoved: single.date_removed ? /[^T]*/.exec(single.date_removed.toString()) : '',
        label: set.length - i,
        identifier: single.identifier,
        url: `/dataset/${single.identifier}`,
      })).filter(v => v.removed)
  }

  @computed get versionTitles() {
    return this.versions.reduce((obj, val) => {
      obj[val.identifier] = val.datasetMetadata.title
      return obj
    }, {})
  }

  @computed get datasetRelations() {
    // waiting for V3 implementation
    return []
  }

  @computed get groupedRelations() {
    // waiting for V3 implementation
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
    return new Date(this.dataset?.created)
  }

  @computed get latestExistingVersionDate() {
    const existingVersions = (this.versions || []).filter(
      version => !version.isRemoved && !version.isDeprecated
    )
    return new Date(Math.max(...existingVersions.map(version => version.currentVersionDate)))
  }

  @computed get latestExistingVersionId() {
    if (!this.datasetVersions) return null
    const latestVersion = Object.values(this.datasetVersions).find(
      val => new Date(val.date_created).getTime() === this.latestExistingVersionDate.getTime()
    )
    return latestVersion?.identifier
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
    return this.draftOf ? 'dataset.draftInfo.changes' : 'dataset.draftInfo.draft'
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

  @computed get creators() {
    return this.dataset?.actors.filter(actor => actor.role === 'creator')
  }

  @computed get contributors() {
    return this.dataset?.actors.filter(actor => actor.role === 'contributor')
  }

  @computed get curators() {
    return this.dataset?.actors.filter(actor => actor.role === 'curator')
  }

  @computed get publisher() {
    const publishers = this.dataset?.actors.filter(actor => actor.role === 'publisher')

    if (publishers.length > 0) {
      return publishers[0]
    }

    return null
  }

  @computed get rightsHolders() {
    return this.dataset?.actors.filter(actor => actor.role === 'rights_holder')
  }

  @computed get actors() {
    return {
      creators: this.creators,
      contributors: this.contributors,
      curators: this.curators,
      publisher: this.publisher,
      rightsHolders: this.rightsHolders,
    }
  }

  @action setShowCitationModal = value => {
    this.showCitationModal = value
  }

  @action setInInfo = resource => {
    this.inInfo = resource
  }

  @action.bound set(field, data) {
    const createVersion = _data => {
      const ds = new EtsinDatasetV3({ Access: this.Access, Locale: this.Locale })
      ds.set('dataset', _data)
      this.versions.push(ds)
    }

    switch (field) {
      case 'versions':
        createVersion(data)
        break
      default:
        this[field] = data
    }
  }

  @action shapeSpatial(spatial) {
    if (!spatial) return null

    return spatial.map(location => {
      let referenceWKT
      if (location.reference?.as_wkt && location.reference?.as_wkt !== ''){
        referenceWKT = [location.reference.as_wkt]
      }
      location.wkt = location.custom_wkt || referenceWKT
      return location
    })
  }
}

export default EtsinDatasetV3
