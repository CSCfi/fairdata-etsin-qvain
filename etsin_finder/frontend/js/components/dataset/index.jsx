import React from 'react'
import Translate from 'react-translate-component'
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

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
      error: false,
    }

    this.goBack = this.goBack.bind(this)
    this.updateData = this.updateData.bind(this)
  }

  componentDidMount() {
    DatasetQuery.getData(this.props.match.params.identifier)
      .then(result => {
        this.updateData(result)
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  goBack() {
    this.props.history.goBack()
  }

  updateData(results) {
    const researchDataset = results.research_dataset
    const description = researchDataset.description.map(single => checkDataLang(single))
    const { creator, contributor, issued, rights_holder } = researchDataset
    this.setState({
      dataset: results,
      title: researchDataset.title,
      description,
      creator,
      contributor,
      issued,
      rights_holder,
      loaded: true,
    })
  }

  render() {
    console.log('render dataset')
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage />
    }

    // CASE 2: Loading not complete
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.loaded) {
      return <div />
    }

    const { currentLang } = this.props.Stores.Locale

    return (
      <div className="container regular-row" pageid={this.props.match.params.identifier}>
        <div className="row">
          <div className="col-lg-8">
            <button className="btn btn-transparent nopadding btn-back" onClick={this.goBack}>
              {'< Go back'}
            </button>
            <ErrorBoundary>
              <Tabs identifier={this.props.match.params.identifier} />
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
            <ErrorBoundary>
              {this.state.dataset.data_catalog.catalog_json.harvested ? (
                <Identifier
                  idn={this.state.dataset.research_dataset.preferred_identifier}
                  classes="btn btn-primary"
                >
                  <Translate content="dataset.data_location" fallback="this is fallback" />
                </Identifier>
              ) : (
                <Route exact path="/dataset/:identifier/data" render={() => <Downloads />} />
              )}
            </ErrorBoundary>
          </div>
          <div className="col-lg-4">
            <ErrorBoundary>
              <Sidebar dataset={this.state.dataset} lang={currentLang} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    )
  }
}

export default inject('Stores')(observer(Dataset))
export const undecorated = Dataset
