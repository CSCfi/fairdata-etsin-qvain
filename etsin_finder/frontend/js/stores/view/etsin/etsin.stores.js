/* Etsin stores
  This class stores the dataset for Etsin React components
*/
import { makeObservable, observable, action, computed } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { DATA_CATALOG_IDENTIFIER, ACCESS_TYPE_URL } from '@/utils/constants'
import Cite from './cite'

class EtsinDatasetV2 {
  constructor({ Access, Locale }) {
    makeObservable(this)
    this.Access = Access
    this.Locale = Locale
    this.citations = new Cite({ Stores: this, Locale })
  }

  useV3 = false

  @observable catalogRecord = null // V2 only

  @observable relations = null

  @observable packages = null

  @observable files = null

  @observable versions = []

  @observable showCitationModal = false

  @observable inInfo = null

  @computed get dataset() {
    return this.catalogRecord?.research_dataset
  } // V2 only

  @computed get dataCatalog() {
    return this.shapeDataCatalog(this.catalogRecord?.data_catalog?.catalog_json)
  }

  @computed get persistentIdentifier() {
    return this.dataset?.persistent_identifier || this.dataset?.preferred_identifier
  }

  @computed get identifier() {
    return this.catalogRecord?.identifier
  }

  @computed get otherIdentifiers() {
    return this.dataset?.other_identifier
  }

  @computed get accessRights() {
    return this.shapeAccessRights(this.dataset?.access_rights)
  }

  @computed get draftOf() {
    return this.dataset?.draft_of
  }

  @computed get isDraft() {
    return Boolean(this.draftOf) || this.catalogRecord?.state === 'draft'
  }

  @computed get isPublished() {
    return !this.isDraft
  }

  @computed get isIda() {
    return this.dataCatalog?.id === DATA_CATALOG_IDENTIFIER.IDA
  }

  @computed get isPas() {
    return this.dataCatalog?.id === DATA_CATALOG_IDENTIFIER.PAS
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

  @computed get datasetMetadata() {
    return {
      releaseDate: this.dataset.issued,
      modified: this.dataset.modified,
      title: this.dataset.title,
      description: this.dataset.description,
      fieldOfScience: this.dataset.field_of_science,
      subjectHeading: this.shapeThemes(this.dataset.theme),
      keywords: this.dataset.keyword,
      language: this.shapeLanguages(this.dataset.language),
      spatial: this.shapeSpatial(this.dataset.spatial),
      temporal: this.dataset.temporal,
      projects: this.shapeProjects(this.dataset.is_output_of),
      infrastructure: this.shapeInfrastructure(this.dataset.infrastructure),
    }
  }

  @computed get provenance() {
    return this.shapeProvenance(this.dataset?.provenance)
  }

  @computed get creators() {
    if (!this.dataset.creator) return []
    return this.dataset.creator.map(c => this.shapeActor(c, 'creator'))
  }

  @computed get contributors() {
    if (!this.dataset.contributor) return []
    return this.dataset.contributor?.map(c => this.shapeActor(c, 'contributor'))
  }

  @computed get curators() {
    if (!this.dataset.curator) return []
    return this.dataset.curator?.map(c => this.shapeActor(c, 'curator'))
  }

  @computed get publisher() {
    return this.shapeActor(this.dataset.publisher, 'publisher')
  }

  @computed get rightsHolders() {
    if (!this.dataset.rights_holder) return []
    return this.dataset.rights_holder.map(r => this.shapeActor(r, 'rights_holder'))
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
    const useCopy = this.catalogRecord?.preservation_dataset_origin_version
    const preservedCopy = this.catalogRecord?.preservation_dataset_version
    if (useCopy) {
      useCopy.id = useCopy.identifier
      useCopy.persistent_identifier = useCopy.preferred_identifier
    }
    if (preservedCopy) {
      preservedCopy.id = preservedCopy.identifier
      preservedCopy.persistent_identifier = preservedCopy.preferred_identifier
    }
    return {
      id: this.catalogRecord?.preservation_identifier,
      state: this.catalogRecord?.preservation_state,
      modified: this.catalogRecord?.preservation_state_modified,
      useCopy,
      preservedCopy,
      // v3 also includes contract, description, and reason_description
      // but these are not used by Etsin
    }
  }

  @computed get emailInfo() {
    return this.catalogRecord?.email_info
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
    return Boolean(this.files?.root?.directChildCount)
  }

  @computed get hasRemoteResources() {
    return Boolean(this.dataset?.remote_resources?.length)
  }

  @computed get remoteResources() {
    if (this.hasRemoteResources) {
      return this.shapeRemoteResources(this.dataset.remote_resources)
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
    return Boolean(this.dataset?.spatial)
  }

  @computed get isDownloadAllowed() {
    return (
      this.isPublished &&
      (this.isIda || this.isPas) &&
      this.Access.restrictions?.allowDataIdaDownloadButton
    )
  }

  @computed get v2VersionSet() {
    return this.catalogRecord?.dataset_version_set
  }

  @computed get datasetVersions() {
    return this.shapeVersionSet(this.v2VersionSet)
  }

  @computed get hasVersion() {
    return this.datasetVersions.some(version => version.id !== this.identifier)
  }

  @computed get hasExistingVersion() {
    return this.datasetVersions.some(version => !version.removed && version.id !== this.identifier)
  }

  @computed get hasRemovedVersion() {
    return this.datasetVersions.some(version => version.removed && version.id !== this.identifier)
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
    return this.shapeRelations(this.dataset?.relation)
  }

  @computed get metaxRelations() {
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
    return new Date(this.catalogRecord?.date_created)
  }

  @computed get latestExistingVersionDate() {
    const existingVersions = (this.datasetVersions || []).filter(version => !version.removed)
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
      const ds = new EtsinDatasetV2({ Access: this.Access, Locale: this.Locale })
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

  @action shapeLanguages(languages) {
    if (!languages) return null
    return languages.map(language => ({
      id: null,
      url: language.identifier,
      in_scheme: null,
      pref_label: language.title,
      broader: null,
      narrower: null,
    }))
  }

  @action shapeActor(actor, role) {
    if (!actor) return null

    let person = null
    let organization = null

    if (actor['@type'] === 'Person') {
      person = {
        name: actor.name,
        email: null,
        external_id: null,
      }
      organization = mapOrgV2ToV3(actor.member_of)
    } else {
      organization = mapOrgV2ToV3(actor)
    }

    return {
      role,
      organization,
      person,
    }
  }

  @action shapeThemes(themes) {
    return themes?.map(theme => ({
      id: null,
      url: theme.identifier,
      in_scheme: theme.in_scheme,
      pref_label: theme.pref_label,
    }))
  }

  @action shapeAccessType(type) {
    return {
      id: null,
      url: type.identifier,
      in_scheme: type.in_scheme,
      pref_label: type.pref_label,
    }
  }

  @action shapeLicense(license) {
    return {
      custom_url: license.license,
      url: license.identifier,
      pref_label: license.title,
      description: null,
      id: null,
      in_scheme: null,
    }
  }

  @action shapeAccessRights(accessRights) {
    if (!accessRights) return null
    const license = accessRights.license?.map(l => this.shapeLicense(l))
    const type = this.shapeAccessType(accessRights.access_type)
    let restrictionGrounds
    if (accessRights.restriction_grounds) {
      restrictionGrounds = accessRights.restriction_grounds.map(grounds => {
        grounds.url = grounds.identifier
        return grounds
      })
    }
    accessRights.license = license
    accessRights.access_type = type
    accessRights.restriction_grounds = restrictionGrounds
    return accessRights
  }

  @action shapeSpatial(spatial) {
    if (!spatial) return null

    return spatial.map(location => {
      const reference = location.place_uri
        ? {
            id: null,
            url: location.place_uri?.identifier,
            in_scheme: location.place_uri?.in_scheme,
            pref_label: location.place_uri?.pref_label,
          }
        : null

      return {
        full_address: location.full_address,
        geographic_name: location.geographic_name,
        altitude_in_meters: location.alt,
        wkt: location.as_wkt,
        reference,
      }
    })
  }

  @action shapeProvenance(provenance) {
    if (!provenance) return []

    return provenance?.map(event => {
      const shapedEvent = { ...event }
      if (shapedEvent.event_outcome) {
        shapedEvent.event_outcome.url = event.event_outcome?.identifier
      }
      if (shapedEvent.lifecycle_event) {
        shapedEvent.lifecycle_event.url = event.lifecycle_event?.identifier
      }
      if (shapedEvent.preservation_event) {
        shapedEvent.preservation_event.url = event.preservation_event?.identifier
      }
      shapedEvent.is_associated_with = event.was_associated_with?.map(actor =>
        this.shapeActor(actor)
      )
      if (shapedEvent.spatial) {
        shapedEvent.spatial = this.shapeSpatial(new Array(event.spatial))[0]
      }

      shapedEvent.id = uuidv4()
      return shapedEvent
    })
  }

  @action shapeProjects(projects) {
    if (!projects) return []
    return projects.map(project => {
      const title = project.name
      const projectIdentifier = project.identifier
      const funderType = project.funder_type
      if (funderType) {
        funderType.url = funderType.identifier
      }

      const participatingOrganizations = project.source_organization?.map(
        org => this.shapeActor(org).organization
      )

      let funding = project.has_funding_agency?.map(org => {
        const v3org = this.shapeActor(org)?.organization
        return {
          funder: {
            organization: v3org,
            funder_type: funderType,
          },
          funding_identifier: project.has_funder_identifier,
        }
      })

      if (!funding && (funderType || project.has_funder_identifier)) {
        funding = [
          {
            funder: {
              funder_type: funderType,
            },
            funding_identifier: project.has_funder_identifier,
          },
        ]
      }

      return {
        title,
        project_identifier: projectIdentifier,
        participating_organizations: participatingOrganizations,
        funding,
      }
    })
  }

  @action shapeInfrastructure(infrastructure) {
    if (!infrastructure) return null
    return infrastructure.map(infra => {
      infra.id = infra.identifier
      return infra
    })
  }

  @action shapeVersionSet(versionSet) {
    if (!versionSet) return []
    return versionSet.map((version, i, set) => {
      const versionInstance = this.versions.find(v => v.identifier === version.identifier)
      const title = versionInstance?.datasetMetadata?.title
      const removed = versionInstance?.catalogRecord?.date_removed
      const deprecated = versionInstance?.catalogRecord?.deprecated
      return {
        id: version.identifier,
        title,
        persistent_identifier: version.preferred_identifier,
        created: version.date_created,
        removed: removed || null,
        deprecated,
        version: set.length - i,
      }
    })
  }

  @action shapeRemoteResources(resources) {
    if (!resources) return null
    return resources.map(resource => {
      const shapedResource = {
        title: { und: resource.title },
        description: null,
        use_category: resource.use_category,
        access_url: resource.access_url?.identifier,
        download_url: resource.download_url?.identifier,
        checksum: null,
        file_type: resource.file_type,
        mediatype: null,
      }

      if (shapedResource.use_category) {
        shapedResource.use_category.url = shapedResource.use_category.identifier
      }
      if (shapedResource.file_type) {
        shapedResource.file_type.url = shapedResource.file_type.identifier
      }

      return shapedResource
    })
  }

  @action shapeDataCatalog(catalog) {
    if (!catalog) return null

    catalog.id = catalog.identifier

    if (catalog.publisher?.homepage) {
      for (const page of catalog.publisher.homepage) {
        page.url = page.identifier
      }
    }

    return catalog
  }

  @action shapeRelations(relations) {
    if (!relations) return null

    return relations.map(relation => {
      relation.entity.entity_identifier = relation.entity.identifier
      return relation
    })
  }
}

function mapOrgV2ToV3(orig) {
  if (!orig) return null

  return {
    pref_label: orig.name,
    homepage: orig.homepage,
    url: orig.identifier,
    parent: mapOrgV2ToV3(orig.is_part_of),
  }
}

export default EtsinDatasetV2
