import React from 'react'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'

import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import DatasetQuery from '../../stores/view/datasetquery'
import NoticeBar from '../general/noticeBar'

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
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
        this.setState({ dataset: result })
        if (result.harvested) {
          console.log('It seems the dataset is deprecated...')
          this.updateData(false)
        } else {
          this.updateData(true)
        }
      })
      .catch(err => {
        console.log(err)
        DatasetQuery.getRemovedData(this.props.match.params.identifier)
          .then(res => {
            this.setState({ dataset: res })
            this.updateData(false)
          })
          .catch(error => {
            console.log(error)
            this.setState({ error })
          })
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
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage />
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

export default inject('Stores')(observer(Dataset))
export const undecorated = Dataset
