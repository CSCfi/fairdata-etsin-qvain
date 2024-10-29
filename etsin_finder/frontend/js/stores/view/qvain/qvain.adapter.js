import parseDateISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import { ENTITY_TYPE } from '@/utils/constants'

class Adapter {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.convertV3ToV2 = this.convertV3ToV2.bind(this)
    this.convertQvainV2ToV3 = this.convertQvainV2ToV3.bind(this)
    this.makeBoundAdapterFunc = this.makeBoundAdapterFunc.bind(this)

    const adapterFuncs = [
      this.accessRightsV2ToV3,
      this.accessRightsV3ToV2,
      this.otherIdentifierV2ToV3,
      this.otherIdentifierV3ToV2,
      this.refdataV2ToV3,
      this.refdataV3ToV2,
      this.remoteResourceV2ToV3,
      this.remoteResourceV3ToV2,
      this.relationV2ToV3,
      this.relationV3ToV2,
      this.spatialV2ToV3,
      this.spatialV3ToV2,
      this.provenanceV2ToV3,
      this.provenanceV3ToV2,
      this.temporalV2ToV3,
      this.temporalV3ToV2,
      this.orgV3ToV2,
      this.actorV3ToV2,
      this.provenanceActorV2ToV3,
      this.relatedDraftV3ToV2,
    ]
    adapterFuncs.forEach(this.makeBoundAdapterFunc)
  }

  makeBoundAdapterFunc(func) {
    // Bind adapter helper functions
    // and add common functionality:
    // - falsy values are returned as such
    // - arrays are processed one-by-one
    const boundFunc = func.bind(this)
    const adapterFunc = (value, ...args) => {
      if (!value) {
        return value
      }
      if (Array.isArray(value)) {
        return value.map(v => boundFunc(v, ...args))
      }
      return boundFunc(value)
    }
    this[func.name] = adapterFunc
  }

  removeMissingTranslations(value) {
    // Clear empty values from translations, return
    // undefined if no translations are found, e.g. {fi: ""} --> undefined
    if (!value) {
      return value
    }
    const entries = Object.entries(value).filter(([, trans]) => !!trans)
    if (entries.length === 0) {
      return undefined
    }
    return Object.fromEntries(entries)
  }

  refdataV3ToV2(value) {
    const v = { ...value, identifier: value.url }
    delete value.url
    return v
  }

  licenseV3toV2(value) {
    return value.map(l => {
      if (l.custom_url) {
        return {
          license: l.custom_url,
        }
      }
      return this.refdataV3ToV2(l)
    })
  }

  otherIdentifierV3ToV2(value) {
    return { notation: value.notation }
  }

  spatialV3ToV2(value) {
    return {
      geographic_name: value.geographic_name,
      alt: (value.altitude_in_meters || '').toString(),
      as_wkt: value.custom_wkt,
      place_uri: this.refdataV3ToV2(value.reference),
      full_address: value.full_address,
    }
  }

  provenanceV3ToV2(value) {
    return {
      title: value.title,
      description: value.description,
      outcome_description: value.outcome_description,
      spatial: this.spatialV3ToV2(value.spatial),
      temporal: this.temporalV3ToV2(value.temporal),
      was_associated_with: this.actorV3ToV2(value.is_associated_with, { includeRoles: false }),
      lifecycle_event: this.refdataV3ToV2(value.lifecycle_event),
      preservation_event: this.refdataV3ToV2(value.preservation_event),
      event_outcome: this.refdataV3ToV2(value.event_outcome),
    }
  }

  accessRightsV3ToV2(value) {
    return {
      access_type: this.refdataV3ToV2(value.access_type),
      restriction_grounds: this.refdataV3ToV2(value.restriction_grounds),
      license: this.licenseV3toV2(value.license),
      available: value.available,
      description: value.description,
    }
  }

  relationV3ToV2(value) {
    return {
      entity: value.entity && {
        title: value.entity.title,
        description: value.entity.description || {},
        type: this.refdataV3ToV2(value.entity.type),
        identifier: value.entity.entity_identifier,
      },
      relation_type: this.refdataV3ToV2(value.relation_type),
    }
  }

  getSingleTranslation(value) {
    if (!value) {
      return value
    }
    return value.en || Object.values(value)[0]
  }

  remoteResourceV3ToV2(value) {
    return {
      title: this.getSingleTranslation(value.title),
      description: this.getSingleTranslation(value.description),
      use_category: this.refdataV3ToV2(value.use_category),
      file_type: this.refdataV3ToV2(value.file_type),
      access_url: {
        identifier: value.access_url || undefined,
      },
      download_url: {
        identifier: value.download_url || undefined,
      },
    }
  }

  temporalV3ToV2(value) {
    return { ...value }
  }

  orgV3ToV2(value) {
    return {
      '@type': ENTITY_TYPE.ORGANIZATION,
      name: value.pref_label,
      is_part_of: this.orgV3ToV2(value.parent),
      identifier: value.external_identifier,
      url: value.url,
      email: value.email,
      homepage: value.homepage,
      is_reference: !!value.url,
      id: value.id,
    }
  }

  actorV3ToV2(actor, { includeRoles = true } = {}) {
    let obj
    if (actor.person) {
      obj = {
        '@type': ENTITY_TYPE.PERSON,
        name: actor.person.name,
        member_of: this.orgV3ToV2(actor.organization),
        id: actor.person.id,
        email: actor.person.email,
        identifier: actor.person.external_identifier,
      }
    } else {
      obj = this.orgV3ToV2(actor.organization)
    }
    if (includeRoles) {
      obj.roles = actor.roles || []
    }
    obj.actor_id = actor.id
    return obj
  }

  relatedDraftV3ToV2(draft) {
    return {
      ...draft,
      identifier: draft.id,
    }
  }

  convertV3ToV2(dataset) {
    // Convert Metax V3 object to V2-style input object.
    const d = {
      id: dataset.id,
      identifier: dataset.id,
      data_catalog: dataset.data_catalog && { identifier: dataset.data_catalog },
      research_dataset: {
        title: dataset.title,
        description: dataset.description,
        keyword: dataset.keyword,
        issued: dataset.issued,
        language: this.refdataV3ToV2(dataset.language),
        field_of_science: this.refdataV3ToV2(dataset.field_of_science),
        theme: this.refdataV3ToV2(dataset.theme),
        other_identifier: this.otherIdentifierV3ToV2(dataset.other_identifiers),
        access_rights: this.accessRightsV3ToV2(dataset.access_rights),
        spatial: this.spatialV3ToV2(dataset.spatial),
        relation: this.relationV3ToV2(dataset.relation),
        temporal: this.temporalV3ToV2(dataset.temporal),
        remote_resources: this.remoteResourceV3ToV2(dataset.remote_resources),
        actors: this.actorV3ToV2(dataset.actors), // needs v3 actors store
        provenance: this.provenanceV3ToV2(dataset.provenance),
        projects: dataset.projects, // shortcut to use projects as is
      },
      date_created: dataset.created,
      state: dataset.state,
      use_doi_for_published: dataset.pid_type === 'DOI',
      draft_of: this.relatedDraftV3ToV2(dataset.draft_of),
      next_draft: this.relatedDraftV3ToV2(dataset.next_draft),
      cumulative_state: dataset.cumulative_state,
      bibliographic_citation: dataset.bibliographic_citation,
      metadata_provider_user: dataset.metadata_owner?.user,
    }

    // include v3 fileset object as it is
    if (dataset.fileset) {
      d.fileset = dataset.fileset
    }

    return d
  }

  refdataV2ToV3(value) {
    if (!value.identifier) {
      return null
    }
    return { url: value.identifier }
  }

  licenseV2toV3(value) {
    return value.map(l => {
      if (l.license) {
        return { custom_url: l.license }
      }
      return this.refdataV2ToV3(l)
    })
  }

  otherIdentifierV2ToV3(value) {
    return { notation: value.notation }
  }

  spatialV2ToV3(value) {
    return {
      geographic_name: value.geographic_name,
      altitude_in_meters: parseInt(value.alt, 10),
      custom_wkt: value.as_wkt,
      reference: this.refdataV2ToV3(value.place_uri?.identifier && value.place_uri),
      full_address: value.full_address,
    }
  }

  accessRightsV2ToV3(value) {
    return {
      access_type: this.refdataV2ToV3(value.access_type),
      restriction_grounds: this.refdataV2ToV3(value.restriction_grounds),
      license: this.licenseV2toV3(value.license),
      available: value.available,
      description: value.description,
    }
  }

  provenanceActorV2ToV3(value) {
    const actor = { ...value }
    delete actor.roles
    return actor
  }

  provenanceV2ToV3(value) {
    return {
      title: this.removeMissingTranslations(value.title),
      description: this.removeMissingTranslations(value.description),
      outcome_description: this.removeMissingTranslations(value.outcome_description),
      spatial: this.spatialV2ToV3(value.spatial),
      temporal: this.temporalV2ToV3(value.temporal),
      is_associated_with: this.provenanceActorV2ToV3(value.was_associated_with),
      lifecycle_event: this.refdataV2ToV3(value.lifecycle_event),
      preservation_event: this.refdataV2ToV3(value.preservation_event),
      event_outcome: this.refdataV2ToV3(value.event_outcome),
    }
  }

  temporalV2ToV3(value) {
    return {
      ...value,
      start_date: value.start_date && format(parseDateISO(value.start_date), 'yyyy-MM-dd'),
      end_date: value.end_date && format(parseDateISO(value.end_date), 'yyyy-MM-dd'),
    }
  }

  relationV2ToV3(value) {
    return {
      entity: value.entity && {
        title: this.removeMissingTranslations(value.entity.title),
        description: this.removeMissingTranslations(value.entity.description),
        type: this.refdataV2ToV3(value.entity.type),
        entity_identifier: value.entity.identifier,
      },
      relation_type: this.refdataV2ToV3(value.relation_type),
    }
  }

  remoteResourceV2ToV3(value) {
    return {
      title: this.removeMissingTranslations({ en: value.title }),
      description: this.removeMissingTranslations({ en: value.description }),
      use_category: this.refdataV2ToV3(value.use_category),
      file_type: this.refdataV2ToV3(value.file_type),
      access_url: value.access_url?.identifier,
      download_url: value.download_url?.identifier,
    }
  }

  convertQvainV2ToV3(dataset) {
    // Convert Qvain front->backend V2 format to Metax V3 format
    const d = {
      id: dataset.original?.id,
      data_catalog: dataset.data_catalog,
      title: this.removeMissingTranslations(dataset.title),
      description: this.removeMissingTranslations(dataset.description),
      keyword: dataset.keyword,
      issued: dataset.issued,
      language: this.refdataV2ToV3(dataset.language),
      field_of_science: this.refdataV2ToV3(dataset.field_of_science),
      theme: this.refdataV2ToV3(dataset.theme),
      other_identifiers: this.otherIdentifierV2ToV3(dataset.other_identifier),
      access_rights: this.accessRightsV2ToV3(dataset.access_rights),
      spatial: this.spatialV2ToV3(dataset.spatial),
      provenance: this.provenanceV2ToV3(dataset.provenance),
      relation: this.relationV2ToV3(dataset.relation),
      temporal: this.temporalV2ToV3(dataset.temporal),
      remote_resources: this.remoteResourceV2ToV3(dataset.remote_resources),
      actors: dataset.actors, // conversion done in actors store
      projects: dataset.projects,
      pid_type: dataset.use_doi ? 'DOI' : 'URN',
      cumulative_state: dataset.cumulative_state,
      bibliographic_citation: dataset.bibliographic_citation,
    }

    // include v3 fileset object as it is
    if (dataset.fileset) {
      d.fileset = dataset.fileset
    }

    return d
  }
}

export default Adapter
