import uuid from 'uuid/v4'
import cloneDeep from 'lodash.clonedeep'
import { toJS, observable, action } from 'mobx'
import Spatials from './qvain.spatials'
import RelatedResources from './qvain.relatedResources'
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
        super(Qvain, Provenance, 'provenances', [{ dataIdentifier: 'associations', refIdentifier: 'actors', Prototype: ActorsRef, Origin: Qvain.Actors }])
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

    toBackend = () => this.Qvain.provenances.map(p => ({
            name: p.name,
            description: p.description,
            outcome_description: p.outcomeDescription,

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
    name: provenanceData.name,
})

export default Provenances
