import React from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'

import DatasetQuery from 'Stores/view/datasetquery'
import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import NoticeBar from '../general/noticeBar'

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
      email_info: DatasetQuery.email_info,
      error: false,
    }

    this.query = this.query.bind(this)
    this.updateData = this.updateData.bind(this)
  }

  componentDidMount() {
    this.query()
  }

  query() {
    if (process.env.NODE_ENV === 'production' && /^\d+$/.test(this.props.match.params.identifier)) {
      console.log('Using integer as identifier not permitted')
      this.setState({ error: 'wrong identifier' })
      this.setState({ loaded: true })
      return
    }
    DatasetQuery.getData(this.props.match.params.identifier)
      .then(result => {
        this.setState({ dataset: result.catalog_record, email_info: result.email_info })
        // TODO: The code below needs to be revised
        // TODO: Somewhere we need to think how 1) harvested, 2) accumulative, 3) deprecated, 4) removed, 5) ordinary
        // TODO: datasets are rendered. Maybe not here?
        if (result.harvested) {
          console.log('It seems the dataset is deprecated...')
          this.updateData(false)
        } else {
          this.updateData(true)
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  updateData(isLive) {
    const researchDataset = this.state.dataset.research_dataset
    const hasFiles = researchDataset.directories || researchDataset.files

    this.setState({
      hasFiles,
      live: isLive,
      loaded: true,
    })
  }

  render() {
    console.log(this.state.dataset)
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage error="notfound" />
    }

    // Loading not complete
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.loaded) {
      return <div />
    }

    const { currentLang } = this.props.Stores.Locale
    // CASE 2: Business as usual
    return (
      <div>
        {!this.state.live && <NoticeBar deprecated={translate('tombstone.info')} />}
        {!this.state.live && <NoticeBar cumulative="This is a cumulative dataset" />}
        <div className="container regular-row" pageid={this.props.match.params.identifier}>
          <div className="row">
            <Content
              history={this.props.history}
              match={this.props.match}
              dataset={this.state.dataset}
              live={this.state.live}
              hasFiles={this.state.hasFiles}
              emails={this.state.email_info}
            />
            <div className="col-lg-4">
              <ErrorBoundary>
                <Sidebar dataset={this.state.dataset} lang={currentLang} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dataset.propTypes = {
  history: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Dataset))
export const undecorated = Dataset
