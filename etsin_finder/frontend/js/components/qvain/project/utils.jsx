import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

import { getOrganizationSearchUrl } from '../../../stores/view/qvain.actors'
import ValidationError from '../general/validationError'

export const ErrorMessages = ({ errors }) => {
  if (!errors.length) return null
  return (
    <ValidationError>
      { errors.map(error => error) }
    </ValidationError>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
}

ErrorMessages.defaultProps = {
  errors: []
}

/**
 * Convert organization object from Metax to array.
 * Top level organization is last item in the array.
 *
 * @param {Object} organization Organization object from Metax
 */
export function parseOrganization(organization) {
  const out = []
  const { name, identifier, email } = organization
  out.push({ name, identifier, email })
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
    await schema.validate(data, { abortEarly: false })
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
    email,
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
  return hits.every(hit => (
    hit._source.uri !== identifier ||
    hit._source.label.und === nameToComparer
  ))
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
 * Convert reference data results to options for select component.
 * Returns an object with { en: [...options], fi:[...options] }
 */
export function referenceDataToOptions(hits) {
  return {
    en: hits.map(hit => getOption(hit, 'en')),
    fi: hits.map(hit => getOption(hit, 'fi')),
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

/**
 * Simple expand/collapse element, without any tooltip hassle.
 * TODO: Consider refactoring to a general component outside project scope.
 */
export class Expand extends Component {
  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  }

  static defaultProps = { open: false }

  state = { open: this.props.open }

  render() {
    const { title, children } = this.props
    const { open } = this.state
    return (
      <Container>
        <Title onClick={() => this.setState({ open: !open })}>
          <Translate
            component={NoStyleButton}
            type="button"
            attributes={{
              'aria-label': open ? 'general.showLess' : 'general.showMore',
            }}
          >
            {open ? <IconStyles icon={faMinus} /> : <IconStyles icon={faPlus} />}
          </Translate>
          { title }
        </Title>
        { open ? children : null }
      </Container>
    )
  }
}

const Container = styled.div`
  margin-top: 1.5rem;
`

const Title = styled.div`
  display: flex;
  cursor: pointer;
  h3 { margin: 0; }
`

const IconStyles = styled(FontAwesomeIcon)`
  color: ${props => props.theme.color.primary};
  :hover {
    color: #004d79;
  }
`

const NoStyleButton = styled.button`
  border: none;
  background-color: unset;
`
