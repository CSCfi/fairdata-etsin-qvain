import React, { Component, Fragment } from 'react'
import Translate from 'react-translate-component'
import DatasetQuery from '../../../stores/view/datasetquery'
import checkDataLang from '../../../utils/checkDataLang'
import { LinkButton } from '../../general/button'

export default class Citation extends Component {
  constructor(props) {
    super(props)
    const Data = DatasetQuery.results
    this.state = {
      // creators: Data.research_dataset.creator && Data.research_dataset.creator,
      // contributors: Data.research_dataset.contributor && Data.research_dataset.contributor,
      publisher: Data.data_catalog.catalog_json.publisher.name,
      release_date: Data.research_dataset.modified,
      title: Data.research_dataset.title,
      pid: Data.research_dataset.preferred_identifier,
    }
  }
  render() {
    console.log(DatasetQuery.results)
    return (
      <Fragment>
        <p>
          <span title="Title">{checkDataLang(this.state.title)}, </span>
          <span title="Publisher">{checkDataLang(this.state.publisher)}, </span>
          <span title="Release date">{this.state.release_date}, </span>
          {'Version, '}
          <span title="Preferred identifier">{this.state.pid}, </span>
        </p>
        <LinkButton noMargin>
          <Translate content="dataset.citation_formats" />
        </LinkButton>
      </Fragment>
    )
  }
}
