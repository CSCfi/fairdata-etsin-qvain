import { makeObservable, action } from 'mobx'
import DataOrigin from './sections/DataOrigin'
import Description from './sections/Description'
import Actors from './sections/Actors'
import Publications from './sections/Publications'
import Geographics from './sections/Geographics'
import TimePeriod from './sections/TimePeriod'
import Infrastructure from './sections/Infrastructure'
import History from './sections/History'
import Project from './sections/Project'

class Sections {
  constructor({ parent }) {
    makeObservable(this)
    this.all = {
      DataOrigin: new DataOrigin(),
      Description: new Description(),
      Actors: new Actors(),
      Publications: new Publications(),
      Geographics: new Geographics(),
      TimePeriod: new TimePeriod(),
      Infrastructure: new Infrastructure(),
      History: new History(),
      Project: new Project({ parent }),
    }

    for (const key in this.all) {
      if ({}.hasOwnProperty.call(this.all, key)) {
        this[key] = this.all[key]
      }
    }
  }

  @action.bound expandPopulatedSections(dataset) {
    Object.values(this.all).forEach(section => {
      section.setExpanded(section.metaxFieldName && dataset[section.metaxFieldName])
    })
  }
}

export default Sections
