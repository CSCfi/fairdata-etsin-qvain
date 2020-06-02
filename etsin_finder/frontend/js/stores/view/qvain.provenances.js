import uuid from 'uuid/v4'
import { observable, action, toJS } from 'mobx'

const Provenance = (
    uiid = uuid(),
    name = { fi: '', en: '' },
    description = { fi: '', en: '' },
    outcomeDescription = { fi: '', en: '' },
    startDate = undefined,
    endDate = undefined) => ({
        uiid,
        name,
        description,
        outcomeDescription,
        startDate,
        endDate
    }
)

class Provenances {
    constructor(Qvain) {
        this.Qvain = Qvain
        this.init()
    }

    init() {
    }

    @observable hasChanged

    @observable provenanceInEdit

    @action setChanged = (val) => {
        this.hasChanged = val
    }

    @action startNewProvenance = () => {
        this.setChanged(false)
        this.provenanceInEdit = Provenance()
    }

    @action changeProvenanceAttribute = (attribute, value) => {
        this.setChanged(true)
        this.provenanceInEdit[attribute] = value
    }

    @action saveProvenance = () => {
        this.setChanged(false)
        const editedProvenance = this.Qvain.provenences.find(p => p.uiid === this.provenanceInEdit.uiid)
        if (editedProvenance) {
            const indexOfProvenance = this.Qvain.provenance.indexOf(editedProvenance)
            this.Qvain.provenences[indexOfProvenance] = {
                ...this.provenanceInEdit,
            }
        } else {
        this.Qvain.provenances.push({
            ...this.provenanceInEdit,
        })
        }
    }

    @action clearProvenanceInEdit = () => {
        this.setChanged(false)
        this.provenanceInEdit = undefined
    }

    @action removeProvenance = (uiid) => {
        this.Qvain.provenances = this.Qvain.provenances.filter(p => p.uiid !== uiid)
    }

    @action editProvenance = (uiid) => {
        this.setChanged(false)
        const provenance = this.Qvain.provenances.find(p => p.uiid === uiid)
        this.provenanceInEdit = {
            ...provenance,
        }
    }

    toBackend = () => this.Qvain.provenances.map(p => ({
            name: p.name,
        }))
}

export const Location = (name, url) => ({
    name,
    url
})

export const ProvenanceModel = (provenanceData) => ({
    uiid: uuid(),
    name: provenanceData.name,
})

export default Provenances
