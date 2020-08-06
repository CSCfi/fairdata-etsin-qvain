import uuid from 'uuid/v4'
import cloneDeep from 'lodash.clonedeep'
import { toJS, observable, action } from 'mobx'
import Spatials, { SpatialModel } from './qvain.spatials'
import RelatedResources, { RelatedResourceModel } from './qvain.relatedResources'
import Field from './qvain.field'
import { ActorsRef } from './qvain.actors'
import { ROLE } from '../../utils/constants'

const Provenance = ({
    uiid = uuid(),
    name = { fi: '', en: '', und: '' },
    description = { fi: '', en: '', und: '' },
    outcomeDescription = { fi: '', en: '', und: '' },
    startDate = undefined,
    endDate = undefined,
    spatials = [], // aka location
    outcome = undefined,
    relatedResources = [], // aka usedEntity
    associations = undefined,
    lifecycle = undefined
}) => ({
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
            ['associations']
        )
        this.Spatials = new Spatials(this)
        this.RelatedResources = new RelatedResources(this)
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
        this.inEdit = new Provenance({ associations: new ActorsRef({ actors: this.Parent.Actors }) })
      }

    toBackend = () => this.Parent.provenances.map(p => ({
            title: p.name,
            description: p.description,
            outcome_description: p.outcomeDescription,
            temporal: p.startDate || p.endDate ? {
                start_date: new Date(p.startDate).toISOString(),
                end_date: new Date(p.endDate).toISOString(),
            } : undefined, // TODO: move this conversion to Temporal when it's implemented
            spatial: this.Spatials.toBackend(),
            event_outcome: { identifier: (p.outcome || {}).url },
            used_entity: this.RelatedResources.toBackend(),
            was_associated_with: p.associations.toBackend,
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

export const ProvenanceModel = (Parent, provenanceData) => ({
    uiid: uuid(),
    name: parseTranslationField(provenanceData.title),
    description: parseTranslationField(provenanceData.description),
    outcomeDescription: parseTranslationField(provenanceData.outcome_description),
    startDate: (provenanceData.temporal || {}).start_date,
    endDate: (provenanceData.temporal || {}).end_date,
    spatials: (provenanceData.spatial || []).map(s => SpatialModel(s)),
    outcome: provenanceData.event_outcome
        ? Outcome(provenanceData.event_outcome.pref_label, provenanceData.event_outcome.identifier)
        : undefined,
    relatedResources: (provenanceData.used_entity || []).map(ue => RelatedResourceModel(ue)),
    associations: new ActorsRef({ actors: Parent.Actors, actorsFromBackend: provenanceData.was_associated_with, roles: [ROLE.PROVENANCE] }),
    lifecycle: provenanceData.lifecycle_event
        ? Lifecycle(provenanceData.lifecycle_event.pref_label, provenanceData.lifecycle.identifier)
        : undefined
})

const parseTranslationField = (value) => {
    if (!value) return { fi: '', en: '', und: '' }
    if (!value.fi) value.fi = ''
    if (!value.en) value.en = ''
    if (!value.und) {
        value.und = value.fi || value.en || ''
    }
    return value
}

export default Provenances
