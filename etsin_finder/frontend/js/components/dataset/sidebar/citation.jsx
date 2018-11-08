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
      citation: Data.research_dataset.bibliographic_citation,
    }
  }

  getAgents() {
    const creators = this.state.creators && this.state.creators.slice()
    const contributors = this.state.contributors && this.state.contributors.slice()
    const agents = []
    for (let i = 0; i < 3; i += 1) {
      if (creators && creators[i] && creators[i].name !== this.state.publisher) {
        agents.push({ name: creators[i].name })
      } else if (contributors && contributors[i - creators.length]) {
        const agent = {}
        if (contributors[i - creators.length].name) {
          agent.name = contributors[i - creators.length].name
        }
        // TODO: needs revision
        if (checkNested(contributors[i - creators.length], 'contributor_role', 'pref_label')) {
          agent.role = contributors[i - creators.length].contributor_role.pref_label
        }
        agents.push(agent)
      }
    }
    return agents
  }

  render() {
    if (this.state.citation) {
      return (
        <Fragment>
          {this.state.citation}
        </Fragment>
      )
    }
    return (
      <Fragment>
        {this.getAgents().map((agent, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <Fragment key={`${checkDataLang(agent.name)}-${i}`}>
            <span name="Name">{checkDataLang(agent.name)}, </span>
            {agent.role && <span name="Role">{checkDataLang(agent.role)}, </span>}
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
