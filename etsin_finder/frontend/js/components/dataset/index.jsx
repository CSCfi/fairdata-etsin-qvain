import React from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import { Route } from 'react-router-dom'

import Sidebar from './Sidebar'
import Downloads from './downloads'
import Content from './Content'
import ErrorPage from '../errorpage'
import Identifier from './data/identifier'
import ErrorBoundary from '../general/errorBoundary'
import Tabs from './Tabs'
import checkDataLang from '../../utils/checkDataLang'
import DatasetQuery from '../../stores/view/datasetquery'
import NoticeBar from '../general/noticeBar'

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
      error: false,
    }

    this.goBack = this.goBack.bind(this)
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
        console.log(result.research_dataset)
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

  goBack() {
    this.props.history.goBack()
  }

  updateData(isLive) {
    const researchDataset = this.state.dataset.research_dataset

    const description = researchDataset.description.map(single => checkDataLang(single))
    const hasFiles = researchDataset.directories || researchDataset.files

    const {
      title,
      creator,
      contributor,
      issued,
      rights_holder,
    } = this.state.dataset.research_dataset

    this.setState({
      hasFiles,
      title,
      description,
      creator,
      contributor,
      issued,
      rights_holder,
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
            <div className="col-lg-8">
              <button className="btn btn-transparent nopadding btn-back" onClick={this.goBack}>
                {'< Go back'}
              </button>
              <ErrorBoundary>
                {this.state.dataset.data_catalog.catalog_json.harvested ||
                !this.state.hasFiles ? null : (
                  <Tabs identifier={this.props.match.params.identifier} live={this.state.live} />
                )}
              </ErrorBoundary>
              <ErrorBoundary>
                <Route
                  exact
                  path="/dataset/:identifier"
                  render={() => (
                    <Content
                      title={checkDataLang(this.state.title, currentLang)}
                      creator={this.state.creator}
                      rights_holder={this.state.rights_holder}
                      contributor={this.state.contributor}
                      issued={this.state.issued}
                      dataset={this.state.dataset.research_dataset}
                    >
                      {this.state.description}
                    </Content>
                  )}
                />
              </ErrorBoundary>
              {this.state.live ? (
                <ErrorBoundary>
                  {
                    // this.state.dataset.data_catalog.catalog_json.harvested ? (
                  }
                  {this.state.dataset.data_catalog.catalog_json.harvested ? (
                    <Identifier
                      idn={this.state.dataset.research_dataset.preferred_identifier}
                      button
                    >
                      <Translate content="dataset.data_location" fallback="this is fallback" />
                    </Identifier>
                  ) : (
                    <Route exact path="/dataset/:identifier/data" component={Downloads} />
                  )}
                </ErrorBoundary>
              ) : null}
            </div>
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
