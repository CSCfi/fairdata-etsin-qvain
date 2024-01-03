import axios from 'axios'
import { override, runInAction } from 'mobx'
import Actors, { Organization, createActor } from './qvain.actors'
import { ENTITY_TYPE } from '@/utils/constants'
import symmetricDifference from '@/components/qvain/utils/symmetricDifference'

class ActorsV3 extends Actors {
  @override
  fromBackend(researchDataset) {
    const datasetActors = researchDataset.actors || []
    const actors = []
    for (const actor of datasetActors) {
      actors.push(createActor(actor, actor.roles))
    }
    this.actors.replace(actors)
    this.mergeTheSameActorOrganizations()
    // this.mergeActorsOrganizationsWithReferences()
  }

  isActorEqual = (actor1, actor2) => actor1.uiid === actor2.uiid

  isOrganizationEqual = (org1, org2) => org1.uiid === org2.uiid

  actorToBackend(actor) {
    const roles = actor.roles?.filter(v => v !== 'provenance')
    const obj = { id: actor.uiid, roles, person: null }
    if (actor.type === ENTITY_TYPE.PERSON && actor.person) {
      obj.person = {
        id: actor.person.uiid,
        name: actor.person.name,
        external_identifier: actor.person.identifier,
        email: actor.person.email || null,
      }
    }

    for (const org of actor.organizations) {
      const v3Org = {
        id: org.uiid,
        pref_label: org.name,
        external_identifier: org.identifier || null,
        url: org.url || null,
        email: org.email || null,
        homepage: org.homepage || null,
      }
      obj.organization = {
        ...v3Org,
        parent: obj.organization,
      }
    }
    return obj
  }

  toBackend() {
    return {
      actors: this.actors
        // avoid adding actors that are only in provenance to actors list
        .filter(actor => symmetricDifference(actor.roles, ['provenance']).length !== 0)
        .map(actor => this.actorToBackend(actor)),
    }
  }

  getOrganizationSearchUrl(parent) {
    const url = new URL(this.Qvain.Env.metaxV3Url('organizations'))
    if (parent) {
      url.searchParams.set('parent', parent.uiid)
    }
    return url.toString()
  }

  @override async fetchReferenceOrganizations(parent) {
    // Fetch child reference organizations of parent organization,
    // or all top-level organizations if no parent is defined.
    if (parent && !parent.isReference) {
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
      const url = this.getOrganizationSearchUrl(parent)
      let orgs
      try {
        const response = axios.get(url)
        orgs = (await response).data

        runInAction(() => {
          this.loadingReferenceOrganizations[parentId] = null
          this.referenceOrganizations[parentId] = orgs.map(org =>
            Organization({
              uiid: org.id,
              name: org.pref_label,
              identifier: org.url,
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
}

export default ActorsV3
