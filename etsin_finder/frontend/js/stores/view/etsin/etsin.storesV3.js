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

  @observable packages = null

  @observable files = null

  @observable emailInfo = null

  @observable showCitationModal = false

  @observable inInfo = null

  @computed get dataCatalog() {
    return this.dataset?.data_catalog
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
    return this.dataset?.draft_of
  }

  @computed get isDraft() {
    return this.dataset?.state === 'draft'
  }

  @computed get isPublished() {
    return this.dataset?.state === 'published'
  }

  @computed get isIda() {
    return this.dataCatalog?.id === DATA_CATALOG_IDENTIFIER.IDA
  }

  @computed get isPas() {
    return this.dataCatalog?.id === DATA_CATALOG_IDENTIFIER.PAS
  }

  @computed get isCumulative() {
    return this.dataset?.cumulative_state === 1
  }

  @computed get isHarvested() {
    return this.dataCatalog?.harvested
  }

  @computed get isRemoved() {
    return Boolean(this.dataset?.removed)
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
      temporal: this.dataset?.temporal,
      projects: this.dataset?.projects,
      infrastructure: this.dataset?.infrastructure,
    }
  }

  @computed get provenance() {
    return this.dataset?.provenance
  }

  @computed get creators() {
    return this.dataset?.actors.filter(actor => actor.roles.some(role => role === 'creator'))
  }

  @computed get contributors() {
    return this.dataset?.actors.filter(actor => actor.roles.some(role => role === 'contributor'))
  }

  @computed get curators() {
    return this.dataset?.actors.filter(actor => actor.roles.some(role => role === 'curator'))
  }

  @computed get publisher() {
    const publishers = this.dataset?.actors.filter(actor =>
      actor.roles.some(role => role === 'publisher')
    )

    if (publishers.length > 0) {
      return publishers[0]
    }

    return null
  }

  @computed get rightsHolders() {
    return this.dataset?.actors.filter(actor => actor.roles.some(role => role === 'rights_holder'))
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

  @computed get preservation() {
    const preservationObject = this.dataset?.preservation

    if (!preservationObject)
      return {
        state: -1,
      }

    preservationObject.useCopy = preservationObject.dataset_origin_version
    preservationObject.preservedCopy = preservationObject.dataset_version
    return preservationObject
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
    return Boolean(this.files?.root?.existingFileCount)
  }

  @computed get fileTypes() {
    if (this.hasFiles) {
      return this.Locale.getValueTranslation(this.dataset?.fileset?.file_types)
    }
    if (this.hasRemoteResources) {
      const typeSet = this.dataset?.remote_resources?.reduce((types, single) => {
        if (single.file_type) {
          types.add(this.Locale.getValueTranslation(single.file_type.pref_label))
        }
        return types
      }, new Set())

      const filetypes = [...typeSet].filter(type => type).sort()
      return filetypes
    }
    return null
  }

  @computed get hasRemoteResources() {
    return Boolean(this.dataset?.remote_resources?.length)
  }

  @computed get remoteResources() {
    if (this.hasRemoteResources) {
      return this.dataset.remote_resources
    }
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
        this.datasetRelations?.length ||
        this.preservation?.useCopy?.persistent_identifier
    )
  }

  @computed get hasMapData() {
    return Boolean(this.datasetMetadata?.spatial.length)
  }

  @computed get isDownloadAllowed() {
    return this.dataset?.allowed_actions.download
  }

  @computed get datasetVersions() {
    // remove drafts (and datasets with unpublished changes, when previewing the changes-draft) for now
    return this.dataset.dataset_versions?.filter(
      version =>
        (version.state === 'published' && version.next_draft !== this.identifier) ||
        version.id === this.identifier
    )
  }

  @computed get hasVersion() {
    return this.datasetVersions?.some(version => version.id !== this.identifier)
  }

  @computed get hasExistingVersion() {
    return this.datasetVersions?.some(version => !version.removed && version.id !== this.identifier)
  }

  @computed get hasRemovedVersion() {
    return this.datasetVersions?.some(version => version.removed && version.id !== this.identifier)
  }

  @computed get deletedVersions() {
    if (!this.datasetVersions) return []
    return this.datasetVersions
      .map(single => ({
        removed: Boolean(single.removed),
        dateRemoved: single.removed ? /[^T]*/.exec(single.removed.toString()) : '',
        label: single.version,
        identifier: single.id,
        url: `/dataset/${single.id}`,
      }))
      .filter(v => v.removed)
  }

  @computed get datasetRelations() {
    return this.dataset?.relation
  }

  @computed get metaxRelations() {
    if (!this.datasetRelations.length && !this.otherIdentifiers) {
      return null
    }

    const otherIdentifiers = this.dataset.other_identifiers.reduce((idList, identifier) => {
      if (identifier.metax_ids) {
        for (const metaxId of identifier.metax_ids) {
          idList.push({
            type: 'other_identifier',
            identifier: identifier.notation,
            metax_identifier: metaxId,
          })
        }
      }
      return idList
    }, [])

    const relations = this.dataset.relation.reduce((relationList, relation) => {
      if (relation.metax_ids) {
        for (const metaxId of relation.metax_ids) {
          relationList.push({
            type: relation.relation_type,
            identifier: relation.entity.entity_identifier,
            metax_identifier: metaxId,
          })
        }
      }
      return relationList
    }, [])

    return { otherIdentifiers, relations }
  }

  @computed get currentVersionDate() {
    return new Date(this.dataset?.created)
  }

  @computed get latestExistingVersionDate() {
    const existingVersions = (this.datasetVersions || []).filter(
      version => !version.removed && !version.deprecated
    )
    return new Date(Math.max(...existingVersions.map(version => Date.parse(version.created))))
  }

  @computed get latestExistingVersionId() {
    if (!this.hasExistingVersion) return null
    const latestVersion = Object.values(this.datasetVersions).find(
      val => new Date(val.created).getTime() === this.latestExistingVersionDate.getTime()
    )
    return latestVersion?.id
  }

  @computed get latestExistingVersionInfotext() {
    if (!this.hasExistingVersion) return null

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
      case 'emails':
        this.emailInfo = data
        break
      default:
        this[field] = data
    }
  }

  @action shapeSpatial(spatial) {
    if (!spatial) return null

    return spatial.map(location => {
      let referenceWKT
      if (location.reference?.as_wkt && location.reference?.as_wkt !== '') {
        referenceWKT = [location.reference.as_wkt]
      }
      location.wkt = location.custom_wkt || referenceWKT
      return location
    })
  }
}

export default EtsinDatasetV3
