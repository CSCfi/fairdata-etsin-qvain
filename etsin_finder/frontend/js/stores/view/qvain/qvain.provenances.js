import { v4 as uuidv4 } from 'uuid'
import { observable, action, makeObservable } from 'mobx'
import Spatials from './qvain.spatials'
import UsedEntities from './qvain.usedEntities'
import Field from './qvain.field'
import { ActorsRef } from './qvain.actors'
import { ROLE } from '../../../utils/constants'

const Provenance = ({
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  outcomeDescription = { fi: '', en: '', und: '' },
  startDate = undefined,
  endDate = undefined,
  spatials, // aka location
  outcome = undefined,
  usedEntities,
  associations = undefined,
  lifecycle = undefined,
}) => ({
  uiid,
  name,
  description,
  outcomeDescription,
  startDate,
  endDate,
  spatials,
  outcome,
  usedEntities,
  associations,
  lifecycle,
})

class Provenances extends Field {
  constructor(Qvain) {
    super(Qvain, Provenance, ProvenanceModel, 'provenances', [
      'associations',
      'usedEntities',
      'spatials',
    ])
    makeObservable(this)
    this.Qvain = Qvain
  }

  @observable selectedActor = undefined

  @observable provenancesWithNonExistingActors = []

  @action reset = () => {
    this.selectedActor = undefined
    this.provenancesWithNonExistingActors = []
  }

  @action saveAndClearSpatials = () => {
    this.selectedActor = undefined
  }

  @action reset() {
    super.reset()
    this.selectedActor = undefined
  }

  @action create() {
    this.setChanged(false)
    this.editMode = false
    this.inEdit = new Provenance({
      associations: new ActorsRef({
        actors: this.Qvain.Actors,
      }),
      usedEntities: new UsedEntities(this.Qvain),
      spatials: new Spatials(this.Qvain),
    })
  }

  @action
  toBackend = () =>
    this.storage.map(p => ({
      title: p.name,
      description: p.description,
      outcome_description: p.outcomeDescription,
      temporal:
        p.startDate || p.endDate
          ? {
              start_date: new Date(p.startDate).toISOString(),
              end_date: new Date(p.endDate).toISOString(),
            }
          : undefined, // TODO: move this conversion to Temporal when it's implemented
      spatial: p.spatials.toBackend()[0],
      event_outcome: { identifier: (p.outcome || {}).url },
      used_entity: p.usedEntities.toBackend(),
      was_associated_with: p.associations.toBackend,
      lifecycle_event: { identifier: (p.lifecycle || {}).url },
    }))

  @action
  fromBackend = (dataset, Qvain) => {
    this.provenancesWithNonExistingActors = []
    this.fromBackendBase(dataset.provenance, Qvain)
  }

  @action checkActorFromRefs = actor => {
    const provenancesWithActorRefsToBeRemoved = this.storage.filter(
      p => p.associations.actorsRef[actor.uiid]
    )
    if (!provenancesWithActorRefsToBeRemoved.length) return Promise.resolve(true)
    this.provenancesWithNonExistingActors = provenancesWithActorRefsToBeRemoved
    return this.Parent.createLooseProvenancePromise()
  }

  @action removeActorFromRefs = actor => {
    this.storage.forEach(p => p.associations.removeActorRef(actor.uiid))
  }
}

export const Outcome = (name, url) => ({
  name,
  url,
})

export const Lifecycle = (name, url) => ({
  name,
  url,
})

export const ProvenanceModel = (provenanceData, Qvain) => ({
  uiid: uuidv4(),
  name: parseTranslationField(provenanceData.title),
  description: parseTranslationField(provenanceData.description),
  outcomeDescription: parseTranslationField(provenanceData.outcome_description),
  startDate: (provenanceData.temporal || {}).start_date,
  endDate: (provenanceData.temporal || {}).end_date,
  spatials: new Spatials(Qvain, provenanceData.spatial ? [provenanceData.spatial] : []),
  outcome: provenanceData.event_outcome
    ? Outcome(provenanceData.event_outcome.pref_label, provenanceData.event_outcome.identifier)
    : undefined,
  usedEntities: new UsedEntities(Qvain, provenanceData.used_entity),
  associations: new ActorsRef({
    actors: Qvain.Actors,
    actorsFromBackend: provenanceData.was_associated_with,
    roles: [ROLE.PROVENANCE],
  }),
  lifecycle: provenanceData.lifecycle_event
    ? Lifecycle(
        provenanceData.lifecycle_event.pref_label,
        provenanceData.lifecycle_event.identifier
      )
    : undefined,
})

const parseTranslationField = value => {
  if (!value) return { fi: '', en: '', und: '' }
  if (!value.fi) value.fi = ''
  if (!value.en) value.en = ''
  if (!value.und) {
    value.und = value.fi || value.en || ''
  }
  return value
}

export default Provenances
