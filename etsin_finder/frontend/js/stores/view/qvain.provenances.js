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
    associations = [] // aka actors, please note that actors will written only when they are going to backend
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
        associations
    }
)

class Provenances extends Field {
    constructor(Qvain) {
        super(Qvain, Provenance, 'provenances', ['spatials', 'relatedResources'])
        this.Spatials = new Spatials(this)
        this.RelatedResources = new RelatedResources(this)
        this.ActorsRef = new ActorsRef(Qvain.Actors)
    }

    @observable spatials = []

    @observable relatedResources = []

    @action saveAndClearSpatials = () => {
        this.inEdit.spatials = cloneDeep(toJS(this.spatials))
        this.spatials = []
        this.relatedResources = []
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


export const ProvenanceModel = (provenanceData) => ({
    uiid: uuid(),
    name: provenanceData.name,
})

export default Provenances
