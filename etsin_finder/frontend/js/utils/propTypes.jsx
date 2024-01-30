import PropTypes from 'prop-types'

export const TypeConcept = PropTypes.shape({
  url: PropTypes.string,
  pref_label: PropTypes.objectOf(PropTypes.string),
  definition: PropTypes.objectOf(PropTypes.string),
  in_scheme: PropTypes.string,
})

export const TypeDocument = PropTypes.shape({
  identifier: PropTypes.string.isRequired,
  title: PropTypes.objectOf(PropTypes.string),
  description: PropTypes.objectOf(PropTypes.string),
})

// TODO: check schema for consistent naming of checksum_value
// Currently two different locations for value.
export const TypeChecksum = PropTypes.shape({
  algorithm: PropTypes.string,
  checksum_value: PropTypes.string,
  value: PropTypes.string,
  checksum_checked: PropTypes.string,
})

export const TypeLicense = PropTypes.shape({
  identifier: PropTypes.string.isRequired,
  title: PropTypes.objectOf(PropTypes.string),
  description: PropTypes.objectOf(PropTypes.string),
  license: PropTypes.string,
})

export const TypeFileCharacteristics = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  encoding: PropTypes.string,
  file_format: PropTypes.string,
  format_version: PropTypes.string,
  application_name: PropTypes.string,
  file_created: PropTypes.string,
  metadata_modifier: PropTypes.string,
  open_access: PropTypes.bool,
  csv_delimiter: PropTypes.string,
  csv_record_separator: PropTypes.string,
  csv_quoting_char: PropTypes.string,
  csv_has_header: PropTypes.bool,
})

export const TypeObjectCharacteristics = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  application_name: PropTypes.string,
  encoding: PropTypes.string,
})

// --- TABLE TYPES ---

export const TypeTableRemote = PropTypes.shape({
  resource_type: TypeConcept,
  license: PropTypes.arrayOf(TypeLicense),
  mediatype: PropTypes.string,
  download_url: TypeDocument,
  access_url: TypeDocument,
  has_object_characteristics: TypeObjectCharacteristics,
  checksum: TypeChecksum,
})

export const TypeTableDirectory = PropTypes.shape({
  file_count: PropTypes.number.isRequired,
})

export const TypeTableFile = PropTypes.shape({
  file_format: PropTypes.string,
  open_access: PropTypes.bool,
  file_characteristics: TypeFileCharacteristics,
  checksum: TypeChecksum,
})

export const TypeLocation = PropTypes.arrayOf(
  PropTypes.shape({
    geographic_name: PropTypes.string,
    alt: PropTypes.string,
    full_address: PropTypes.string,
    as_wkt: PropTypes.arrayOf(PropTypes.string),
    place_uri: TypeConcept,
  })
)

const AllTypes = {
  TypeConcept,
  TypeDocument,
  TypeChecksum,
}

export default AllTypes
