import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import checkDataLang from '../../../../utils/checkDataLang'
import checkNested from '../../../../utils/checkNested'
import { withStores } from '../../../../stores/stores'

class Citation extends Component {
  getAgents() {
    const researchDataset = this.props.Stores.DatasetQuery.results.research_dataset
    const creators = researchDataset.creator && researchDataset.creator.slice()
    const contributors = researchDataset.contributor && researchDataset.contributor.slice()
    const agents = []
    for (let i = 0; i < 3; i += 1) {
      if (creators && creators[i] && creators[i].name !== researchDataset.publisher) {
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
    const dataset = this.props.Stores.DatasetQuery.results
    const researchDataset = dataset.research_dataset

    const cit = []
    cit.push(
      this.getAgents().map(agent => {
        const currentAgent = agent.role
          ? `${checkDataLang(agent.name)}, ${checkDataLang(agent.role)}`
          : checkDataLang(agent.name)
        return currentAgent
      })
    )
    cit.push(checkDataLang(researchDataset.title))
    cit.push(checkDataLang(researchDataset.publisher && researchDataset.publisher.name))
    cit.push(checkDataLang(researchDataset.issued))
    if (dataset.draft_of) {
      cit.push(dataset.draft_of.preferred_identifier)
    } else if (dataset.state !== 'draft') {
      cit.push(researchDataset.preferred_identifier)
    }
    return (
      <>
        <span>{cit.filter(element => element).join(', ')}</span>
        {!researchDataset.issued && (
          <TextMuted>
            <Translate content="dataset.citationNoDateIssued" />
          </TextMuted>
        )}
      </>
    )
  }

  render() {
    const researchDataset = this.props.Stores.DatasetQuery.results.research_dataset
    const citation = researchDataset.bibliographic_citation
    if (citation) {
      return citation
    }
    return this.createCitation()
  }
}

Citation.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const TextMuted = styled.div`
  color: ${props => props.theme.color.gray};
  font-size: 0.9rem;
  margin-top: 0.3rem;
`

export default withStores(observer(Citation))
