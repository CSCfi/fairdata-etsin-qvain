import React from 'react'
import axios from 'axios'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { Route } from 'react-router-dom'

import DsSidebar from './components/dsSidebar'
import DsDownloads from './components/dsDownloads'
import DsContent from './components/dsContent'
import ErrorPage from './components/errorPage'
import Identifier from './components/identifier'
import ErrorBoundary from './components/errorBoundary'
import DsTabs from './components/dsTabs'

class Dataset extends React.Component {
  constructor(props) {
    super(props);

    // Use Metax-test in dev env, actual Metax in production
    this.url = (process.env.NODE_ENV !== 'production') ? 'https://metax-test.csc.fi' : 'https://metax-test.csc.fi'
    this.state = {
      dataset: [],
      error: '',
    }
    this.goBack = this.goBack.bind(this)
    this.updateData = this.updateData.bind(this)
  }
  componentDidMount() {
    this.getData(this.props.match.params.identifier)
  }

  componentWillReceiveProps(newProps) {
    this.getData(newProps.match.params.identifier)
  }

  getData(id) {
    let dataid = id;
    if (this.props.dataid) {
      dataid = this.props.dataid
    }
    axios.get(`${this.url}/rest/datasets/${dataid}.json`)
      .then((res) => {
        const dataset = res.data;
        this.setState({ dataset });
        this.updateData()
      })
      .catch((res) => {
        this.setState({ error: res });
      });
  }

  goBack() {
    this.props.Stores.History.history.goBack()
  }

  updateData() {
    const { currentLang } = this.props.Stores.Locale
    this.setState({ currentLang })
    const researchDataset = this.state.dataset.research_dataset
    const titles = researchDataset.title

    this.setState({ title: titles[this.state.currentLang] })

    const description = researchDataset.description.filter((single) => {
      if (!single.en) {
        return false
      }
      return true
    })[0].en;
    this.setState({ description })
    const { creator, contributor, issued } = this.state.dataset.research_dataset;
    this.setState({ creator, contributor, issued })
    console.log(this.state)
    this.setState({ loaded: 'true' })
  }

  render() {
    // CASE 1: Houston, we have a problem
    if (this.state.error !== '') {
      return <ErrorPage />;
    }

    // CASE 2: Loading not complete
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.loaded) {
      return <div />;
    }

    return (
      <div className="container regular-row" pageid={this.props.match.params.identifier}>
        <div className="row">
          <div className="col-md-8">
            <ErrorBoundary>
              <DsTabs identifier={this.identifier} />
            </ErrorBoundary>
            {/* <button className="btn btn-transparent nopadding btn-back" onClick={this.goBack}>
              {'< Go back'}
            </button> */}
            <ErrorBoundary>
              <Route
                exact
                path="/dataset/:identifier"
                render={() => (
                  <DsContent
                    title={this.state.title}
                    creator={this.state.creator}
                    contributor={this.state.contributor}
                    issued={this.state.issued}
                    dataset={this.state.dataset.research_dataset}
                  >
                    { this.state.description }
                  </DsContent>
                )}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              {
                this.state.dataset.data_catalog.catalog_json.harvested
                  ?
                    <Identifier idn={this.state.dataset.research_dataset.preferred_identifier} classes="btn btn-primary" >
                      <Translate content="dataset.data_location" fallback="this is fallback" />
                    </Identifier>
                  :
                    <Route
                      exact
                      path="/dataset/:identifier/data"
                      render={() => (
                        <DsDownloads />
                      )}
                    />
              }
            </ErrorBoundary>
          </div>
          <div className="col-md-4">
            <ErrorBoundary>
              <DsSidebar dataset={this.state.dataset} lang={this.state.currentLang} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('Stores')(observer(Dataset))
export const undecorated = Dataset
