import React, { Component, Fragment } from 'react'
import DatasetQuery from '../../../stores/view/datasetquery'
import checkDataLang from '../../../utils/checkDataLang'
import checkNested from '../../../utils/checkNested'

export default class Citation extends Component {
  constructor(props) {
    super(props)
    const Data = DatasetQuery.results
    this.state = {
      creators: Data.research_dataset.creator && Data.research_dataset.creator,
      contributors: Data.research_dataset.contributor && Data.research_dataset.contributor,
      publisher: Data.research_dataset.publisher && Data.research_dataset.publisher.name,
      release_date: Data.research_dataset.modified,
      title: Data.research_dataset.title,
      pid: Data.research_dataset.preferred_identifier,
    }
  }

  getPeople() {
    const creators = this.state.creators && this.state.creators.slice()
    const contributors = this.state.contributors && this.state.contributors.slice()
    const people = []
    for (let i = 0; i < 3; i += 1) {
      if (creators && creators[i]) {
        people.push({ name: creators[i].name })
      } else if (contributors && contributors[i - creators.length]) {
        const person = {}
        if (contributors[i - creators.length].name) {
          person.name = contributors[i - creators.length].name
        }
        // TODO: needs revision
        if (checkNested(contributors[i - creators.length], 'contributor_role', 'pref_label')) {
          person.role = contributors[i - creators.length].contributor_role.pref_label
        }
        people.push(person)
      }
    }
    return people
  }

  render() {
    return (
      <Fragment>
        {this.getPeople().map((person, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <Fragment key={`${checkDataLang(person.name)}-${i}`}>
            <span name="Name">{checkDataLang(person.name)}, </span>
            {person.role && <span name="Role">{checkDataLang(person.role)}, </span>}
          </Fragment>
        ))}
        <span title="Title">{checkDataLang(this.state.title)}, </span>
        {this.state.publisher &&
          <span title="Publisher">{checkDataLang(this.state.publisher)}, </span>
        }
        <span title="Release date">{this.state.release_date}, </span>
        <span title="Preferred identifier">{this.state.pid}</span>
      </Fragment>
    )
  }
}
