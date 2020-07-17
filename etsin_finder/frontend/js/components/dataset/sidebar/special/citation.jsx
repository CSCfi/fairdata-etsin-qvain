import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import DatasetQuery from '../../../../stores/view/datasetquery'
import checkDataLang from '../../../../utils/checkDataLang'
import checkNested from '../../../../utils/checkNested'

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

  createCitation() {
    const cit = []
    cit.push(
      this.getAgents().map(agent => {
        const currentAgent = agent.role
          ? `${checkDataLang(agent.name)}, ${checkDataLang(agent.role)}`
          : checkDataLang(agent.name)
        return currentAgent
      })
    )
    cit.push(checkDataLang(this.state.title))
    cit.push(checkDataLang(this.state.publisher))
    cit.push(checkDataLang(this.state.release_date))
    cit.push(checkDataLang(this.state.pid))
    return (
      <Fragment>
        <span>{cit.filter(element => element).join(', ')}</span>
        { !this.state.release_date &&
          <TextMuted><Translate content="dataset.citationNoReleaseDate" /></TextMuted> }
      </Fragment>
    )
  }

  render() {
    if (this.state.citation) return this.state.citation
    return this.createCitation()
  }
}

const TextMuted = styled.div`
  color: ${props => props.theme.color.gray};
  font-size: .9rem;
  margin-top: .3rem;
`
