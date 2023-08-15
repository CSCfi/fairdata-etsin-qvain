/* eslint-disable import/prefer-default-export */

import { touch } from './track'

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
