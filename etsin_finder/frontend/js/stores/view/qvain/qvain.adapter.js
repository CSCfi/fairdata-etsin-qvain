import parseDateISO from 'date-fns/parseISO'
import format from 'date-fns/format'

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
      this.temporalV2ToV3,
      this.temporalV3ToV2,
    ]
    adapterFuncs.forEach(this.makeBoundAdapterFunc)
  }

  makeBoundAdapterFunc(func) {
    // Bind adapter helper functions
    // and add common functionality:
    // - falsy values are returned as such
    // - arrays are processed one-by-one
    const boundFunc = func.bind(this)
    const adapterFunc = value => {
      if (!value) {
        return value
      }
      if (Array.isArray(value)) {
        return value.map(boundFunc)
      }
      return boundFunc(value)
    }
    this[func.name] = adapterFunc
  }

  refdataV3ToV2(value) {
    const v = { ...value, identifier: value.url }
    delete value.url
    return v
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

  accessRightsV3ToV2(value) {
    return {
      access_type: this.refdataV3ToV2(value.access_type),
      restriction_grounds: this.refdataV3ToV2(value.restriction_grounds),
      license: this.refdataV3ToV2(value.license),
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
      },
      state: 'draft',
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
      license: this.refdataV2ToV3(value.license),
      // available: // TODO
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
        title: value.entity.title,
        description: value.entity.description,
        type: this.refdataV2ToV3(value.entity.type),
        entity_identifier: value.entity.identifier,
      },
      relation_type: this.refdataV2ToV3(value.relation_type),
    }
  }

  remoteResourceV2ToV3(value) {
    return {
      title: { en: value.title },
      description: { en: value.description },
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
      title: dataset.title,
      description: dataset.description,
      keyword: dataset.keyword,
      issued: dataset.issued,
      language: this.refdataV2ToV3(dataset.language),
      field_of_science: this.refdataV2ToV3(dataset.field_of_science),
      theme: this.refdataV2ToV3(dataset.theme),
      other_identifiers: this.otherIdentifierV2ToV3(dataset.other_identifier),
      access_rights: this.accessRightsV2ToV3(dataset.access_rights),
      spatial: this.spatialV2ToV3(dataset.spatial),
      relation: this.relationV2ToV3(dataset.relation),
      temporal: this.temporalV2ToV3(dataset.temporal),
      remote_resources: this.remoteResourceV2ToV3(dataset.remote_resources),
    }

    // include v3 fileset object as it is
    if (dataset.fileset) {
      d.fileset = dataset.fileset
    }

    d.metadata_owner = {
      user: { username: this.Qvain.Auth.user.name },
      organization: this.Qvain.Auth.user.homeOrganizationId,
    }

    return d
  }
}

export default Adapter
