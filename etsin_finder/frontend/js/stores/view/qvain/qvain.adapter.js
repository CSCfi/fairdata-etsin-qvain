import parseDateISO from 'date-fns/parseISO'
import format from 'date-fns/format'

class Adapter {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.convertQvainV2ToV3 = this.convertQvainV2ToV3.bind(this)
    this.convertV3ToV2 = this.convertV3ToV2.bind(this)
    this.spatialV3ToV2 = this.spatialV3ToV2.bind(this)
    this.spatialV2ToV3 = this.spatialV2ToV3.bind(this)
  }

  refdataV3ToV2(value) {
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.refdataV3ToV2)
    }
    const v = { ...value, identifier: value.url }
    delete value.url
    return v
  }

  otherIdentifierV3ToV2(value) {
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.otherIdentifierV3ToV2)
    }
    return { notation: value.notation }
  }

  spatialV3ToV2(value) {
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.spatialV3ToV2)
    }
    return {
      geographic_name: value.geographic_name,
      alt: (value.altitude_in_meters || '').toString(),
      as_wkt: value.custom_wkt,
      place_uri: this.refdataV3ToV2(value.reference),
      full_address: value.full_address,
    }
  }

  accessRightsV3ToV2(value) {
    if (!value) {
      return value
    }
    return {
      access_type: this.refdataV3ToV2(value.access_type),
      restriction_grounds: this.refdataV3ToV2(value.restriction_grounds),
      license: this.refdataV3ToV2(value.license),
      // available: // TODO
    }
  }

  convertV3ToV2(dataset) {
    // Convert Metax V3 object to V2-style input object.
    const d = {
      id: dataset.id,
      identifier: dataset.id,
      data_catalog: { identifier: dataset.data_catalog },
      research_dataset: {
        title: dataset.title,
        description: dataset.description,
        keyword: dataset.keyword,
        issued: (dataset.issued && format(parseDateISO(dataset.issued), 'yyyy-MM-dd')) || undefined,
        language: this.refdataV3ToV2(dataset.language),
        field_of_science: this.refdataV3ToV2(dataset.field_of_science),
        theme: this.refdataV3ToV2(dataset.theme),
        other_identifier: this.otherIdentifierV3ToV2(dataset.other_identifiers),
        access_rights: this.accessRightsV3ToV2(dataset.access_rights),
        spatial: this.spatialV3ToV2(dataset.spatial),
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
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.refdataV2ToV3)
    }
    const v = { url: value.identifier }
    delete value.identifier
    return v
  }

  otherIdentifierV2ToV3(value) {
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.otherIdentifierV2ToV3)
    }
    return { notation: value.notation }
  }

  spatialV2ToV3(value) {
    if (!value) {
      return value
    }
    if (Array.isArray(value)) {
      return value.map(this.spatialV2ToV3)
    }
    return {
      geographic_name: value.geographic_name,
      altitude_in_meters: parseInt(value.alt, 10),
      custom_wkt: value.as_wkt,
      reference: this.refdataV2ToV3(value.place_uri?.identifier && value.place_uri),
      full_address: value.full_address,
    }
  }

  accessRightsV2ToV3(value) {
    if (!value) {
      return value
    }
    return {
      access_type: this.refdataV2ToV3(value.access_type),
      restriction_grounds: this.refdataV2ToV3(value.restriction_grounds),
      license: this.refdataV2ToV3(value.license),
      // available: // TODO
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
      issued: parseDateISO(dataset.issued),
      language: this.refdataV2ToV3(dataset.language),
      field_of_science: this.refdataV2ToV3(dataset.field_of_science),
      theme: this.refdataV2ToV3(dataset.theme),
      other_identifiers: this.otherIdentifierV2ToV3(dataset.other_identifier),
      access_rights: this.accessRightsV2ToV3(dataset.access_rights),
      spatial: this.spatialV2ToV3(dataset.spatial),
    }

    // include v3 fileset object as it is
    if (dataset.fileset) {
      d.fileset = dataset.fileset
    }
    return d
  }
}

export default Adapter
