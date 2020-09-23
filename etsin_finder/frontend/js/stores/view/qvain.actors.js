import axios from 'axios'
import { observable, action, runInAction, computed } from 'mobx'

import { METAX_FAIRDATA_ROOT_URL, ENTITY_TYPE, ROLE } from '../../utils/constants'

// helper methods

// Returns a Actor.
const createActor = (actorJson, roles) => {
  const entityType = actorJson['@type'].toLowerCase()

  const flattenOrganizations = org => {
    const orgs = []
    let currentOrg = org
    while (currentOrg) {
      orgs.unshift(
        Organization({
          name: currentOrg.name,
          email: currentOrg.email,
          identifier: currentOrg.identifier,
          isReference: null, // null here means we aren't sure yet
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

const actorToBackend = actor => ({
  type: actor.type,
  roles: actor.roles,
  person:
    actor.type === ENTITY_TYPE.PERSON
      ? {
        name: actor.person.name,
        email: actor.person.email || undefined,
        identifier: actor.person.identifier || undefined,
      }
      : undefined,
  organizations: actor.organizations.map(org => ({
    name: org.name,
    email: org.email || undefined,
    identifier: org.identifier || undefined,
  })),
})

const isActorEqual = (org1, org2) => isEqual(org1, org2, ['uiid', 'roles', 'isReference'])

const isOrganizationEqual = (org1, org2) => isEqual(org1, org2, ['uiid', 'isReference'])

// Compare two objects to see if they are the same.
// Optionally ignore specific keys (e.g. uiid).
const isEqual = (a1, a2, ignore = []) => {
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
  return actorUIIDCounter
}

let orgUIIDCounter = 0
export const createOrgUIID = () => {
  orgUIIDCounter += 1
  return orgUIIDCounter
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

export const Person = ({ name = '', email = '', identifier = '' } = {}) => ({
  name,
  email,
  identifier,
})

export const Organization = ({
  name = '',
  email = '',
  identifier = '',
  isReference = false,
  uiid = createOrgUIID(),
} = {}) => ({
  name,
  email,
  identifier, // Organization URI
  isReference,
  uiid,
})

class Actors {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.reset()
  }

  @observable actors

  @observable actorInEdit

  // Reference organizations by parent
  @observable referenceOrganizations = {}

  @observable referenceOrganizationErrors = {}

  @observable loadingReferenceOrganizations = {}

  @observable onSuccessfulCreationCallbacks = []

  @action clearReferenceOrganizations = () => {
    this.referenceOrganizations = {}
    this.loadingReferenceOrganizations = {}
    this.referenceOrganizationErrors = {}
  }

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

  @action fetchReferenceOrganizations = async parent => {
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
    this.actors.clear()
    this.actorInEdit = null
    this.onSuccessfulCreationCallbacks = []
  }

  editDataset = researchDataset => {
    // Load actors
    const actors = []
    if ('publisher' in researchDataset) {
      actors.push(createActor(researchDataset.publisher, [ROLE.PUBLISHER]))
    }
    if ('curator' in researchDataset) {
      researchDataset.curator.forEach(curator => actors.push(createActor(curator, [ROLE.CURATOR])))
    }
    if ('creator' in researchDataset) {
      researchDataset.creator.forEach(creator => actors.push(createActor(creator, [ROLE.CREATOR])))
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
        const match = refs.find(refOrg => isOrganizationEqual(org, refOrg))
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
          if (isOrganizationEqual(org, otherOrg)) {
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
        if (isActorEqual(actor1, actor2)) {
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
    const confirm = await this.Qvain.checkActorFromRefs(actor)
    if (!confirm) return null
    const actors = this.actors.filter(p => p.uiid !== actor.uiid)
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

  toBackend = () => this.actors.map(actor => ({
    type: actor.type,
    roles: actor.roles,
    person:
      actor.type === ENTITY_TYPE.PERSON
        ? {
          name: actor.person.name,
          email: actor.person.email || undefined,
          identifier: actor.person.identifier || undefined,
        }
        : undefined,
    organizations: actor.organizations.map(org => ({
      name: org.name,
      email: org.email || undefined,
      identifier: org.identifier || undefined,
    })),
  }))

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
    const afbs = actorsFromBackend.map(afb => createActor(afb, roles))
    this.addRefsOnlyToActors(afbs)
    this.setActorsRef(afbs, roles)
  }

  @observable actorsRef = {}

  @action clone = () => {
    const ref = new ActorsRef({ actors: this.actors, roles: this.roles })
    ref.actorsRef = { ...this.actorsRef }
    return ref
  }

  @action setActorsRef = (afbs, roles) => {
    const actorsRefArray = this.actors.actors.filter(actor =>
      afbs.find(afb => isActorEqual(afb, actor))
    )

    this.actorsRef = actorsRefArray.reduce((obj, ref) => {
      obj[ref.uiid] = ref
      return obj
    }, {})

    roles.forEach(role => this.addRoleForAll(role))
  }

  @action addRefsOnlyToActors = afbs => {
    afbs.forEach(afb => {
      const isInActors = this.actors.actors.find(actor => isActorEqual(afb, actor))
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
    return Object.values(this.actorsRef).map(actorToBackend)
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
