import uuid from 'uuid/v4'
import cloneDeep from 'lodash.clonedeep'
import { toJS, observable, action } from 'mobx'
import Spatials, { SpatialModel } from './qvain.spatials'
import RelatedResources, { RelatedResourceModel } from './qvain.relatedResources'
import Field from './qvain.field'
import { ActorsRef } from './qvain.actors'

const Provenance = (
    uiid = uuid(),
    name = { fi: '', en: '' },
    description = { fi: '', en: '' },
    outcomeDescription = { fi: '', en: '' },
    startDate = undefined,
    endDate = undefined,
    spatials = [], // aka location
    outcome = undefined,
    relatedResources = [], // aka usedEntity
    associations = [], // actors
    lifecycle = undefined
    ) => ({
        uiid,
        name,
        description,
        outcomeDescription,
        startDate,
        endDate,
        spatials,
        outcome,
        relatedResources,
        associations,
        lifecycle
    }
)

class Provenances extends Field {
    constructor(Qvain) {
        super(
            Qvain,
            Provenance,
            'provenances',
            [{
                dataIdentifier: 'associations',
                refIdentifier: 'actors',
                Prototype: ActorsRef,
                Origin: Qvain.Actors
            }]
        )
        this.Spatials = new Spatials(this)
        this.RelatedResources = new RelatedResources(this)
        this.ActorsRef = new ActorsRef(Qvain.Actors, this)
    }

    @observable spatials = []

    @observable relatedResources = []

    @observable selectedActor = undefined

    @action saveAndClearSpatials = () => {
        this.inEdit.spatials = cloneDeep(toJS(this.spatials))
        this.spatials = []
        this.relatedResources = []
        this.selectedActor = undefined
    }

    @action create = () => {
        this.setChanged(false)
        this.editMode = false
        this.inEdit = this.Template()
        this.inEdit.actors = new ActorsRef(this.Parent.Actors)
      }

    toBackend = () => this.Parent.provenances.map(p => ({
            title: p.name,
            description: p.description,
            outcome_description: p.outcomeDescription,
            temporal: {
                start_date: new Date(p.startDate).toISOString(),
                end_date: new Date(p.endDate).toISOString()
            }, // TODO: move this conversion to Temporal when it's implemented
            spatial: this.Spatials.toBackend(),
            event_outcome: { identifier: (p.outcome || {}).url },
            used_entity: this.RelatedResources.toBackend(),
            was_associated_with: p.associations,
            lifecycle_event: { identifier: (p.lifecycle || {}).url }
        }))
}

export const Outcome = (name, url) => ({
    name,
    url,
})

export const Lifecycle = (name, url) => ({
    name,
    url,
})

export const ProvenanceModel = (provenanceData) => ({
    uiid: uuid(),
    name: provenanceData.title,
    description: provenanceData.description,
    outcomeDescription: provenanceData.outcome_description,
    startDate: provenanceData.temporal.start_date,
    endDate: provenanceData.temporal.end_date,
    spatials: (provenanceData.spatial || []).map(s => SpatialModel(s)),
    outcome: provenanceData.event_outcome
        ? Outcome(provenanceData.event_outcome.pref_label, provenanceData.event_outcome.identifier)
        : undefined,
    relatedResources: (provenanceData.used_entity || []).map(ue => RelatedResourceModel(ue)),
    associations: provenanceData.was_associated_with,
    lifecycle: provenanceData.lifecycle_event
        ? Lifecycle(provenanceData.lifecycle_event.pref_label, provenanceData.lifecycle.identifier)
        : undefined
})

export default Provenances
