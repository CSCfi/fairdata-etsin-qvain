import axios from 'axios'
import { toJS, observable, action, runInAction, computed, makeObservable } from 'mobx'
import * as yup from 'yup'

import { METAX_FAIRDATA_ROOT_URL, ENTITY_TYPE, ROLE } from '../../../utils/constants'
import { touch } from './track'

// ACTOR VALIDATION SCHEMAS

export const actorType = yup
  .mixed()
  .oneOf(
    [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
    'qvain.validationMessages.actors.type.oneOf'
  )
  .required('qvain.validationMessages.actors.type.required')

export const actorRolesSchema = yup
  .array()
  .of(
    yup
      .mixed()
      .oneOf(
        [
          ROLE.CREATOR,
          ROLE.CURATOR,
          ROLE.PUBLISHER,
          ROLE.RIGHTS_HOLDER,
          ROLE.CONTRIBUTOR,
          ROLE.PROVENANCE,
        ],
        'qvain.validationMessages.actors.roles.oneOf'
      )
  )
  .min(1, 'qvain.validationMessages.actors.roles.min')
  .required('qvain.validationMessages.actors.roles.required')

export const personNameSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.name.string')
  .max(1000, 'qvain.validationMessages.actors.name.max')
  .required('qvain.validationMessages.actors.name.required')

export const personEmailSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.email.string')
  .max(1000, 'qvain.validationMessages.actors.email.max')
  .email('qvain.validationMessages.actors.email.email')
  .nullable()

export const personIdentifierSchema = yup
  .string()
  .max(1000, 'qvain.validationMessages.actors.identifier.max')
  .nullable()

export const organizationNameSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.organization.name')
  .min(1, 'qvain.validationMessages.actors.organization.name')
  .max(1000, 'qvain.validationMessages.actors.name.max')
  .required('qvain.validationMessages.actors.organization.name')

export const organizationEmailSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.email.string')
  .max(1000, 'qvain.validationMessages.actors.email.max')
  .email('qvain.validationMessages.actors.email.email')
  .nullable()

export const organizationNameTranslationsSchema = yup.lazy(translations => {
  // Each value in the translations must be an organization name string.
  const obj = Object.keys(translations).reduce((o, translation) => {
    o[translation] = organizationNameSchema
    return o
  }, {})
  // At least one translation is required.
  if (Object.keys(obj).length === 0) {
    obj.und = organizationNameSchema
  }
  return yup.object().shape(obj)
})

export const organizationIdentifierSchema = yup
  .string()
  .max(1000, 'qvain.validationMessages.actors.identifier.max')
  .nullable()

export const actorOrganizationSchema = yup.object().shape({
  type: yup
    .mixed()
    .oneOf(
      [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
      'qvain.validationMessages.actors.type.oneOf'
    )
    .required('qvain.validationMessages.actors.type.required'),
  organization: yup.mixed().when('type', {
    is: ENTITY_TYPE.PERSON,
    then: yup.object().required('qvain.validationMessages.actors.organization.required'),
    otherwise: yup.object('qvain.validationMessages.actors.organization.object').shape({
      value: yup
        .string()
        .typeError('qvain.validationMessages.actors.organization.string')
        .nullable(),
    }),
  }),
})

export const personSchema = yup.object().shape({
  name: personNameSchema.required('qvain.validationMessages.actors.name.required'),
  email: personEmailSchema,
  identifier: personIdentifierSchema,
})

export const organizationSchema = yup.object().shape({
  name: organizationNameTranslationsSchema,
  identifier: organizationIdentifierSchema,
})

export const actorSchema = yup.object().shape({
  type: actorType,
  roles: actorRolesSchema,
  person: yup.object().when('type', {
    is: ENTITY_TYPE.PERSON,
    then: personSchema.required(),
    otherwise: yup.object().nullable(),
  }),
  organizations: yup
    .array()
    .min(1, 'qvain.validationMessages.actors.organization.required')
    .of(organizationSchema)
    .required('qvain.validationMessages.actors.organization.required'),
})

const metaxOrganizationSchema = organizationSchema.shape({
  '@type': yup.string().oneOf([ENTITY_TYPE.ORGANIZATION]),
  is_part_of: yup.lazy(() => metaxOrganizationSchema.default(undefined)),
})

const metaxPersonSchema = personSchema.shape({
  '@type': yup.string().oneOf([ENTITY_TYPE.PERSON]),
  member_of: metaxOrganizationSchema.required(
    'qvain.validationMessages.actors.organization.required'
  ),
})

export const metaxActorSchema = yup.lazy(actor => {
  if (actor?.['@type'] === ENTITY_TYPE.PERSON) {
    return metaxPersonSchema
  }
  return metaxOrganizationSchema
})

export const getRequiredMetaxActorSchema = message =>
  yup.lazy(actor => {
    if (actor?.['@type'] === ENTITY_TYPE.PERSON) {
      return metaxPersonSchema.required(message)
    }
    return metaxOrganizationSchema.required(message)
  })

export const metaxActorsSchema = yup.array().of(metaxActorSchema)

// HELPERS

// Returns a Actor.
export const createActor = (actorJson, roles) => {
  const entityType = actorJson['@type']

  const flattenOrganizations = org => {
    const orgs = []
    let currentOrg = org
    while (currentOrg) {
      touch(currentOrg['@type'])
      orgs.unshift(
        Organization({
          name: { ...currentOrg.name },
          email: currentOrg.email,
          identifier: currentOrg.identifier,
          isReference: currentOrg.is_reference ?? null, // null here means we are not sure yet
          uiid: currentOrg.id,
          url: currentOrg.url,
          homepage: currentOrg.homepage,
        })
      )
      currentOrg = currentOrg.is_part_of
    }
    return orgs
  }

  let organizations
  let person = Person()
  if (entityType === ENTITY_TYPE.PERSON) {
    person = Person({
      name: actorJson.name,
      email: actorJson.email,
      identifier: actorJson.identifier,
      uiid: actorJson.id,
    })
    organizations = flattenOrganizations(actorJson.member_of)
  }

  if (entityType === ENTITY_TYPE.ORGANIZATION) {
    organizations = flattenOrganizations(actorJson)
  }

  return Actor({
    type: entityType,
    person,
    roles,
    organizations,
    uiid: actorJson.actor_id,
  })
}

// Organization may be a reference organizations if its identifier starts with the proper prefix.
export const ReferenceIdentifierPrefix = 'http://uri.suomi.fi/codelist/fairdata/organization/code/'
export const maybeReference = identifier =>
  (identifier && identifier.startsWith(ReferenceIdentifierPrefix)) || false

const codeRegExp = RegExp('http://uri.suomi.fi/codelist/fairdata/organization/code/(.*)')

export const getOrganizationSearchUrl = parentId => {
  let shortId = ''
  if (parentId) {
    const match = codeRegExp.exec(parentId)
    if (match) {
      shortId = `organization_${match[1]}`
    }
  }
  return `${METAX_FAIRDATA_ROOT_URL}/es/organization_data/organization/_search?size=3000&q=parent_id:"${shortId}"`
}

export const organizationArrayToMetax = orgs => {
  const metaxOrgs = orgs.map(org => ({
    name: { ...org.name },
    email: org.email || undefined,
    identifier: org.identifier || undefined,
    '@type': ENTITY_TYPE.ORGANIZATION,
  }))
  const subOrgFirst = metaxOrgs.reverse()
  const org = subOrgFirst[0]
  let currentLevel = org
  for (const nextOrg of subOrgFirst.slice(1)) {
    currentLevel.is_part_of = nextOrg
    currentLevel = nextOrg
  }
  return org
}

const actorToMetax = origActor => {
  const actor = toJS(origActor)
  const org = organizationArrayToMetax(actor.organizations)

  if (actor.type === ENTITY_TYPE.ORGANIZATION) {
    return org
  }

  const person = {
    name: actor.person.name,
    email: actor.person.email || undefined,
    identifier: actor.person.identifier || undefined,
    member_of: org,
    '@type': ENTITY_TYPE.PERSON,
  }
  return person
}

// Compare two objects to see if they are the same.
// Optionally ignore specific keys (e.g. uiid).
export const isEqual = (a1, a2, ignore = []) => {
  const isDifferent = (a, b) => {
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return Object.keys(a).some(key => !ignore.includes(key) && isDifferent(a[key], b[key]))
    }
    return a !== b
  }

  const equ = !isDifferent(a1, a2)
  return equ
}

// create a new UI Identifier based on existing UI IDs
// basically a simple number increment
// use the store actors by default
let actorUIIDCounter = 0
export const createActorUIID = () => {
  actorUIIDCounter += 1
  return `#${actorUIIDCounter}`
}

let orgUIIDCounter = 0
export const createOrgUIID = () => {
  orgUIIDCounter += 1
  return `#${orgUIIDCounter}`
}

let personUIIDCounter = 0
export const createPersonUIID = () => {
  personUIIDCounter += 1
  return `#${personUIIDCounter}`
}

export const Actor = ({
  type = ENTITY_TYPE.PERSON,
  person = Person(),
  organizations = [],
  roles = [],
  uiid = createActorUIID(),
} = {}) => ({
  type,
  roles,
  person,
  organizations, // array with top level organization first
  uiid,
})

export const Person = ({
  name = '',
  email = '',
  identifier = '',
  uiid = createPersonUIID(),
} = {}) => ({
  name,
  email,
  identifier,
  uiid,
})

export const Organization = ({
  name = '',
  email = '',
  identifier = '',
  isReference = false,
  url = null,
  homepage = null,
  uiid = createOrgUIID(),
} = {}) => ({
  name,
  email,
  identifier, // Organization URI
  isReference,
  uiid,
  url,
  homepage,
})

class Actors {
  constructor(Qvain) {
    this.Qvain = Qvain
    makeObservable(this)
    this.reset()
  }

  actorType = actorType

  personNameSchema = personNameSchema

  personEmailSchema = personEmailSchema

  personIdentifierSchema = personIdentifierSchema

  organizationNameSchema = organizationNameSchema

  organizationEmailSchema = organizationEmailSchema

  organizationNameTranslationsSchema = organizationNameTranslationsSchema

  organizationIdentifierSchema = organizationIdentifierSchema

  actorOrganizationSchema = actorOrganizationSchema

  personSchema = personSchema

  organizationSchema = organizationSchema

  actorSchema = actorSchema

  // Reference organizations by parent
  @observable referenceOrganizations = {}

  @observable referenceOrganizationErrors = {}

  @observable loadingReferenceOrganizations = {}

  @observable onSuccessfulCreationCallbacks = []

  @observable orphanActors = []

  @action clearReferenceOrganizations = () => {
    this.referenceOrganizations = {}
    this.loadingReferenceOrganizations = {}
    this.referenceOrganizationErrors = {}
  }

  isActorEqual = (org1, org2) => isEqual(org1, org2, ['uiid', 'roles', 'isReference'])

  isOrganizationEqual = (org1, org2) => isEqual(org1, org2, ['uiid', 'isReference'])

  getReferenceOrganizations = parent => {
    if (parent && !maybeReference(parent.identifier)) {
      return []
    }
    const parentId = parent ? parent.identifier : ''
    return this.referenceOrganizations[parentId]
  }

  getReferenceOrganizationsForActor = (actor, index) => {
    if (index < 0 || index > actor.organizations.length) {
      return []
    }
    if (index === 0) {
      return this.getReferenceOrganizations()
    }
    const parent = actor.organizations[index - 1]
    if (!parent || !parent.isReference) {
      return []
    }
    return this.getReferenceOrganizations(parent)
  }

  getDatasetOrganizations = parent => {
    // Get unique organization hierarchies used in the dataset.
    // Returns an array of flattened organization hierarchies
    // with an array for each organization depth.
    //
    // For example, if there is an actor with a 2-level hierarchy of:
    //   University -> Deparment
    // The resulting array will be:
    //   [[University], [University, Department]]

    const parentUIID = (parent && parent.uiid) || null
    const keys = {}
    const uniqueDatasetOrgs = []
    this.actors.forEach(actor => {
      const orgs = [...actor.organizations]
      if (parentUIID) {
        const orgIndex = orgs.findIndex(org => org.uiid === parentUIID)
        if (orgIndex < 0) {
          return
        }
        orgs.splice(0, orgIndex + 1)
      }
      for (let numParts = 0; numParts < orgs.length; numParts += 1) {
        const parts = orgs.slice(0, numParts + 1)
        const key = parts.map(org => org.uiid).join('-')
        if (!keys[key]) {
          uniqueDatasetOrgs.push(parts)
        }
        keys[key] = true
      }
    })
    return uniqueDatasetOrgs
  }

  @computed
  get allOrganizationsFlat() {
    // Return all organizations and currently known reference organizations as
    // a flat array. Does not fetch reference organiations. Useful for testing.
    const datasetOrganizations = this.getDatasetOrganizations()
    const refOrgs = Object.values(this.referenceOrganizations)
    const orgs = new Set([].concat(...datasetOrganizations, ...refOrgs))
    return [...orgs]
  }

  @action fetchAllDatasetReferenceOrganizations = async () => {
    // Fetch organization data to determine for each organization in the dataset
    // if it is in the reference data.

    await this.fetchReferenceOrganizations() // fetch top-level orgs
    this.actors.forEach(async actor => {
      // Fetch children of each parent reference organization.
      for (const org of actor.organizations.slice(0, -1)) {
        if (!org.isReference) {
          break
        }
        // eslint-disable-next-line no-await-in-loop
        await this.fetchReferenceOrganizations(org)
      }
    })
    await this.mergeActorsOrganizationsWithReferences()
  }

  @action.bound async fetchReferenceOrganizations(parent) {
    // Fetch child reference organizations of parent organization,
    // or all top-level organizations if no parent is defined.
    if (parent && !maybeReference(parent.identifier)) {
      return []
    }
    const parentId = parent ? parent.identifier : ''
    if (this.referenceOrganizations[parentId]) {
      return this.referenceOrganizations[parentId]
    }
    if (this.loadingReferenceOrganizations[parentId]) {
      return this.loadingReferenceOrganizations[parentId]
    }
    delete this.referenceOrganizationErrors[parentId]
    // eslint-disable-next-line no-async-promise-executor
    this.loadingReferenceOrganizations[parentId] = new Promise(async (resolve, reject) => {
      const url = getOrganizationSearchUrl(parentId)
      let orgs
      try {
        const response = axios.get(url)
        orgs = (await response).data.hits.hits

        runInAction(() => {
          this.loadingReferenceOrganizations[parentId] = null
          this.referenceOrganizations[parentId] = orgs.map(org =>
            Organization({
              name: org._source.label,
              identifier: org._source.uri,
              isReference: true,
            })
          )
          delete this.referenceOrganizationErrors[parentId]
        })
        this.mergeActorsOrganizationsWithReferences()
        resolve(this.referenceOrganizations[parentId])
      } catch (err) {
        runInAction(() => {
          this.loadingReferenceOrganizations[parentId] = null
          this.referenceOrganizationErrors[parentId] = err
        })
        reject(err)
      }
    })
    return this.loadingReferenceOrganizations[parentId]
  }

  @action
  reset = () => {
    this.actors = []
    this.orphanActors = []
    this.actorInEdit = null
    this.onSuccessfulCreationCallbacks = []
  }

  @action.bound
  fromBackend(researchDataset) {
    // Load actors
    this.orphanActors = []
    const actors = []
    if ('creator' in researchDataset) {
      researchDataset.creator.forEach(creator => actors.push(createActor(creator, [ROLE.CREATOR])))
    }
    if (researchDataset.publisher) {
      actors.push(createActor(researchDataset.publisher, [ROLE.PUBLISHER]))
    }
    if ('curator' in researchDataset) {
      researchDataset.curator.forEach(curator => actors.push(createActor(curator, [ROLE.CURATOR])))
    }
    if ('rights_holder' in researchDataset) {
      researchDataset.rights_holder.forEach(rightsHolder =>
        actors.push(createActor(rightsHolder, [ROLE.RIGHTS_HOLDER]))
      )
    }
    if ('contributor' in researchDataset) {
      researchDataset.contributor.forEach(contributor =>
        actors.push(createActor(contributor, [ROLE.CONTRIBUTOR]))
      )
    }
    this.actors.replace(actors)
    this.mergeTheSameActors()
    this.mergeTheSameActorOrganizations()
    this.mergeActorsOrganizationsWithReferences()
  }

  @observable actors = []

  @observable actorInEdit = Actor()

  // Creates a single instance of a actor, only has one role.

  @action updateSavedActorOrganizations = actor => {
    const existingOrganizations = [].concat(
      ...this.actors.map(act => act.organizations),
      ...Object.values(this.referenceOrganizations)
    )

    actor.organizations.forEach((org, index) => {
      for (const otherOrg of existingOrganizations) {
        if (otherOrg.uiid === org.uiid) {
          if (!org.isReference) {
            Object.assign(otherOrg, org)
          }
          actor.organizations[index] = otherOrg
          break
        }
      }
    })
  }

  // Merge actors organizations with references if possible.
  @action mergeActorsOrganizationsWithReferences = () => {
    const actors = [...this.actors]
    if (this.actorInEdit) {
      actors.push(this.actorInEdit)
    }
    actors.forEach(actor => {
      actor.organizations.forEach((org, index) => {
        if (org.isReference !== null) {
          return
        }
        if (!maybeReference(org.identifier)) {
          org.isReference = false
          return
        }
        let refs
        if (index === 0) {
          refs = this.referenceOrganizations['']
        } else {
          const parent = actor.organizations[index - 1]
          const parentId = parent.identifier
          if (!parentId || parent.isReference === false) {
            org.isReference = false
            return
          }
          refs = this.referenceOrganizations[parentId]
        }

        if (!refs) {
          return // references not loaded yet
        }
        const match = refs.find(refOrg => this.isOrganizationEqual(org, refOrg))
        if (match) {
          if (actor === this.actorInEdit) {
            // actorInEdit should remain a copy until it is saved
            actor.organizations[index] = JSON.parse(JSON.stringify(match))
          } else {
            actor.organizations[index] = match
          }
        } else {
          org.isReference = false
        }
      })
    })
  }

  // Merges actors' organizations with identical properties.
  @action mergeTheSameActorOrganizations = () => {
    const orgs = []
    this.actors.forEach(actor => {
      actor.organizations.forEach((org, index) => {
        for (const otherOrg of orgs) {
          if (this.isOrganizationEqual(org, otherOrg)) {
            actor.organizations[index] = otherOrg
            return
          }
        }
        orgs.push(org)
      })
    })
  }

  // Function that 'Merge' the actors with the same metadata (except UIid).
  // It looks for actors with the same info but different roles and adds their
  // roles together to get one actor with multiple roles.
  // Returns a new array with the merged actors.
  @action mergeTheSameActors = () => {
    const actors = this.actors
    const mergedActors = []
    actors.forEach(actor1 => {
      actors.forEach((actor2, index) => {
        if (actor1 === actor2) {
          return
        }
        if (this.isActorEqual(actor1, actor2)) {
          actor1.roles = [...new Set([...actor1.roles, ...actor2.roles])]
          delete actors[index]
        }
      })
      mergedActors.push(actor1)
    })
    this.actors.replace(mergedActors)
  }

  setSelectedActor

  @action
  setActors = actors => {
    this.actors.replace(actors)
    this.Qvain.setChanged(true)
  }

  @action saveActor = actor => {
    // Saving an actor that was previously added?
    const existing = this.actors.find(addedActor => addedActor.uiid === actor.uiid)

    if (existing) {
      // Update existing actor
      this.updateActor(existing, actor)
    } else {
      // Adding a new actor, generate a new UIID for them
      this.setActors([...this.actors, actor])
      this.onSuccessfulCreationCallbacks.forEach(cb => cb(actor))
      this.onSuccessfulCreationCallbacks = []
    }

    // Update changed organizations
    this.updateSavedActorOrganizations(actor)
    this.Qvain.setChanged(true)
  }

  @action
  removeActor = async actor => {
    const confirm = await this.checkActorFromRefs(actor)
    if (!confirm) return null
    const actors = this.actors.filter(p => p.uiid !== actor.uiid)
    this.Qvain.Provenances.removeActorFromRefs(actor)
    this.setActors(actors)
    this.Qvain.setChanged(true)
    return null
  }

  @action
  updateActor = (actor, values) => {
    Object.assign(actor, values)
  }

  @action
  editActor = (actor, callback) => {
    if (callback) {
      this.onSuccessfulCreationCallbacks.push(callback)
    }
    this.actorInEdit = JSON.parse(JSON.stringify(actor)) // clone actor
  }

  @action
  cancelActor = () => {
    this.onSuccessfulCreationCallbacks = []
    this.actorInEdit = null
  }

  @action
  updateOrganization = (organization, values) => {
    Object.assign(organization, values)
  }

  @action
  setActorOrganizations = (actor, organizations) => {
    actor.organizations = organizations
  }

  @action checkActorFromRefs = actor => {
    const provenancesWithActorRefsToBeRemoved = this.Qvain.Provenances.storage.filter(
      p => p.associations.actorsRef[actor.uiid]
    )
    if (!provenancesWithActorRefsToBeRemoved.length) return Promise.resolve(true)
    this.provenancesWithNonExistingActors = provenancesWithActorRefsToBeRemoved
    return this.Qvain.createLooseProvenancePromise()
  }

  @action checkProvenanceActors = () => {
    const provenanceActors = [
      ...new Set(
        this.Qvain.Provenances.storage
          .map(prov => Object.values(prov.associations.actorsRef))
          .flat()
      ),
    ].flat()
    const actorsWithOnlyProvenanceTag = this.actors.filter(
      actor => actor.roles.includes(ROLE.PROVENANCE) && actor.roles.length === 1
    )

    const orphanActors = actorsWithOnlyProvenanceTag.filter(
      actor => !provenanceActors.includes(actor)
    )
    if (!orphanActors.length) return Promise.resolve(true)
    this.orphanActors = orphanActors

    return this.Qvain.createLooseActorPromise()
  }

  otherActorsHaveRole = (actor, role) => {
    const existingRoles = new Set(
      this.actors
        .filter(a => a.uiid !== actor.uiid)
        .map(a => a.roles)
        .flat()
    )
    return existingRoles.has(role)
  }

  toBackend() {
    const roles = ['creator', 'publisher', 'curator', 'rights_holder', 'contributor']
    const result = {}

    for (const role of roles) {
      const roleActors = this.actors
        .filter(actor => actor.roles.includes(role))
        .map(actor => actorToMetax(actor))
      if (roleActors.length > 0) {
        if (role === 'publisher') {
          result[role] = roleActors[0]
        } else {
          result[role] = roleActors
        }
      }
    }
    return result
  }

  @computed get actorOptions() {
    return this.actors.map(ref => ({
      value: ref.uiid,
      label: ref.person.name || ref.organizations.map(org => org.name),
      roles: ref.roles,
    }))
  }
}

export default Actors

export class ActorsRef {
  constructor({ actors, actorsFromBackend = [], roles = [] }) {
    this.actors = actors // instance of the actors class in Stores.Qvain for example
    this.roles = roles
    makeObservable(this)
    const afbs = actorsFromBackend.map(afb => createActor(afb, roles))
    this.addRefsOnlyToActors(afbs)
    this.setActorsRef(afbs, roles)
  }

  @observable actorsRef = {}

  @action.bound clone() {
    const ref = new ActorsRef({ actors: this.actors, roles: this.roles })
    ref.actorsRef = { ...this.actorsRef }
    return ref
  }

  @action.bound setActorsRef(afbs, roles) {
    const actorsRefArray = this.actors.actors.filter(actor =>
      afbs.find(afb => this.actors.isActorEqual(afb, actor))
    )

    this.actorsRef = actorsRefArray.reduce((obj, ref) => {
      obj[ref.uiid] = ref
      return obj
    }, {})

    roles.forEach(role => this.addRoleForAll(role))
  }

  @action.bound addRefsOnlyToActors(afbs) {
    afbs.forEach(afb => {
      const isInActors = this.actors.actors.find(actor => this.actors.isActorEqual(afb, actor))
      if (!isInActors) {
        this.actors.actors.push(afb)
      }
    })
  }

  @computed get actorOptions() {
    // makes a list of actors based on the refs
    return Object.values(this.actorsRef).map(ref => ({
      value: ref.uiid,
      label: ref.person.name || ref.organizations.map(org => org.name),
      roles: ref.roles,
    }))
  }

  @computed get toBackend() {
    // makes a list of names to be stored to metax
    return Object.values(this.actorsRef).map(actorToMetax)
  }

  @action addActorRef = actor => {
    this.actorsRef = { ...this.actorsRef, [actor.uiid]: actor }
  }

  @action addActorWithId = id => {
    const actor = this.actors.actors.find(a => a.uiid === id)
    if (actor) this.addActorRef(actor)
  }

  @action addRole = (id, role) => {
    const actor = this.actors.actors.find(a => a.uiid === id)
    if (actor && !actor.roles.includes(role)) actor.roles = [...actor.roles, role]
  }

  @action addRoleForAll = role => {
    Object.values(this.actorsRef).forEach(ar => this.addRole(ar.uiid, role))
  }

  @action removeActorRef = uiid => {
    if (this.actorsRef[uiid]) delete this.actorsRef[uiid]
  }

  @action clearActorsRef = () => {
    this.actorsRef = {}
  }
}
