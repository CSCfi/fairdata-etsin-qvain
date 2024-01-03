import { v4 as uuidv4 } from 'uuid'
import { observable, action, makeObservable, override, computed } from 'mobx'
import * as yup from 'yup'

import Locations from './qvain.provenances.locations'
import UsedEntities from './qvain.usedEntities'
import Field from './qvain.field'
import { ActorsRef } from './qvain.actors'
import { ROLE } from '../../../utils/constants'
import { touch } from './track'

export const Provenance = ({
  uiid = uuidv4(),
  name = { fi: '', en: '', und: '' },
  description = { fi: '', en: '', und: '' },
  outcomeDescription = { fi: '', en: '', und: '' },
  startDate = undefined,
  endDate = undefined,
  locations = undefined,
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
  locations,
  outcome,
  usedEntities,
  associations,
  lifecycle,
})

// PROVENANCE
export const provenanceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string().typeError('qvain.validationMessages.history.provenance.nameRequired'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.history.provenance.nameRequired')
      .required('qvain.validationMessages.history.provenance.nameRequired'),
  }),
  en: yup.string().typeError('qvain.validationMessages.history.provenance.nameRequired'),
})

const dateTest = yup.string().date({ allowTime: true })

export const provenanceSchema = yup.object().shape({
  name: provenanceNameSchema,
  startDate: dateTest,
  endDate: dateTest,
})

class Provenances extends Field {
  constructor(Qvain) {
    super(Qvain, Provenance, ProvenanceModel, 'provenances', [
      'associations',
      'usedEntities',
      'locations',
    ])
    makeObservable(this)
    this.Qvain = Qvain
  }

  @observable selectedActor = undefined

  @observable provenancesWithNonExistingActors = []

  @action saveAndClearLocations = () => {
    this.selectedActor = undefined
  }

  @override reset() {
    super.reset()
    this.selectedActor = undefined
    this.provenancesWithNonExistingActors = []
  }

  @override create() {
    this.setChanged(false)
    this.editMode = false
    this.inEdit = Provenance({
      associations: new ActorsRef({
        actors: this.Qvain.Actors,
      }),
      usedEntities: new UsedEntities(this),
      locations: new Locations(this, [], this.Qvain.Env),
    })
  }

  @action.bound
  toBackend() {
    return this.storage.map(p => ({
      title: p.name,
      description: p.description,
      outcome_description: p.outcomeDescription,
      temporal:
        p.startDate || p.endDate
          ? {
              start_date: p.startDate ? new Date(p.startDate).toISOString() : undefined,
              end_date: p.endDate ? new Date(p.endDate).toISOString() : undefined,
            }
          : undefined,
      spatial: p.locations.toBackend()[0],
      event_outcome: { identifier: (p.outcome || {}).url },
      used_entity: p.usedEntities.toBackend(),
      was_associated_with: p.associations.toBackend,
      lifecycle_event: { identifier: (p.lifecycle || {}).url },
    }))
  }

  @action.bound
  fromBackend(dataset, Qvain) {
    this.provenancesWithNonExistingActors = []
    if (dataset.provenance) {
      dataset.provenance.forEach(prov => {
        touch(prov.lifecycle_event, prov.event_outcome)
      })
    }
    this.fromBackendBase(dataset.provenance, Qvain)
  }

  @action checkActorFromRefs = actor => {
    const provenancesWithActorRefsToBeRemoved = this.storage.filter(
      p => p.associations.actorsRef[actor.uiid]
    )

    if (!provenancesWithActorRefsToBeRemoved.length) return Promise.resolve(true)
    this.provenancesWithNonExistingActors = provenancesWithActorRefsToBeRemoved
    return this.Qvain.createLooseProvenancePromise()
  }

  @action removeActorFromRefs = actor => {
    this.storage.forEach(p => p.associations.removeActorRef(actor.uiid))
  }

  schema = provenanceSchema

  @computed get translationsRoot() {
    return 'qvain.historyV2'
  }

  @computed get associationsTranslationsRoot() {
    return 'qvain.historyV2.actors'
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
  locations: new Locations(Qvain, provenanceData.spatial ? [provenanceData.spatial] : []),
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
  const values = {
    fi: value.fi || '',
    en: value.en || '',
    und: value.und || '',
  }
  return values
}

export default Provenances
