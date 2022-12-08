import axios from 'axios'

import { getOrganizationSearchUrl } from './qvain.actors'
import { touch } from './track'
import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'

/**
 * Convert organization object from Metax to array.
 * Top level organization is last item in the array.
 *
 * @param {Object} organization Organization object from Metax
 */
export function parseOrganization(organization) {
  const out = []
  const { name, identifier, email } = organization
  touch(organization['@type'])
  out.push({ name: { ...name }, identifier, email })
  if ('is_part_of' in organization) {
    out.push(...parseOrganization(organization.is_part_of))
  }
  return out
}

/**
 * Validate an organization async. Returns validation errors,
 * if valid an empty array will be returned.
 */
export async function validate(schema, data) {
  try {
    await schema.validate(data, { abortEarly: false, strict: true })
    return {}
  } catch (validationErrors) {
    return parseValidationErrors(validationErrors)
  }
}

/**
 * Validate an organization in sync. Returns validation errors,
 * if valid an empty array will be returned.
 */
export function validateSync(schema, data) {
  try {
    schema.validateSync(data, { abortEarly: false })
    return {}
  } catch (validationErrors) {
    return parseValidationErrors(validationErrors)
  }
}

/**
 * Parse yup validation errors to object like {field: [errors]}
 */
export function parseValidationErrors(validationErrors) {
  const errors = {}
  validationErrors.inner.forEach(error => {
    const path = error.path.split('.')
    errors[path[0]] = error.errors
  })
  return errors
}

export function isEmptyObject(obj = {}) {
  return Object.getOwnPropertyNames(obj).length === 0
}

/**
 * Convert already added and valid organization to value for select.
 * Note: We need to check if value is manually added or selected from
 * reference data. If manually added, we need to display the form.
 *
 * @param {Object} organization Organization to convert
 * @param {String} lang Current UI language
 * @param {String || null} parentId Parent id for organization,
 * used to check if organization is manually added
 */
export async function organizationToSelectValue(organization, lang, parentId) {
  if (!organization) return undefined
  const { identifier, name, email } = organization
  const isCustomOrg = await isCustomOrganization(identifier, name, parentId)
  return {
    value: identifier || '',
    label: name[lang] || name.und,
    name: { ...name },
    email: email || '',
    formIsOpen: isCustomOrg,
  }
}

/**
 * Check if given identifier can be found from reference data.
 * If not, the organization is likely manually entered.
 *
 * @param {String} identifier
 * @param {Object} name
 * @param {String} parentId parent organization identifier
 */
async function isCustomOrganization(identifier, name, parentId) {
  const url = getOrganizationSearchUrl(parentId)
  const nameToComparer = 'und' in name ? name.und : null
  const response = await axios.get(url)
  if (response.status !== 200) return null
  const { hits } = response.data.hits
  return !hits.some(
    hit => hit._source.uri === identifier || hit._source.label.und === nameToComparer
  )
}

/**
 * Convert organization select value to comfort schema
 */
export function organizationSelectValueToSchema(organization) {
  if (!organization) return null
  const { name, email, value } = organization
  return { name: { ...name }, email, identifier: value }
}

/**
 * Fetch and parse options from Metax to select values
 */
export async function resolveOptions(referenceDataType) {
  const response = await axios.get(
    `${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${referenceDataType}/_search?pretty=true&size=100`
  )
  if (response.status !== 200) return {}
  return referenceDataToOptions(response.data.hits.hits)
}

/**
 * Convert reference data results to options for select component.
 * Returns an object with { en: [...options], fi:[...options] }
 */
export function referenceDataToOptions(hits) {
  return {
    en: hits.map(hit => getOption(hit, 'en')),
    fi: hits.map(hit => getOption(hit, 'fi')),
    all: hits.map(hit => ({ value: hit._source.uri, label: hit._source.label })),
  }
}

function getOption(hit, language) {
  return {
    value: hit._source.uri,
    label: hit._source.label[language] || hit._source.label.und,
    name: {
      en: hit._source.label.en || hit._source.label.und,
      fi: hit._source.label.fi || hit._source.label.und,
      und: hit._source.label.und,
    },
    inScheme: hit._source.scheme,
  }
}

