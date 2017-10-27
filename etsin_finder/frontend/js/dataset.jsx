import React from 'react';

import axios from 'axios';
import { inject, observer } from 'mobx-react';

import DsSidebar from './components/dsSidebar';
import DsDownloads from './components/dsDownloads';
import DsContent from './components/dsContent';
import ErrorPage from './components/errorPage';

@inject('Stores') @observer
class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.identifier = this.props.match.params.identifier;

    // Use Metax-test in dev env, actual Metax in production
    this.url = (process.env.NODE_ENV !== 'production') ? 'https://metax-test.csc.fi' : 'https://metax-test.csc.fi'
    this.state = { dataset: [], error: '' }
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then((res) => {
        const dataset = res.data;
        this.setState({ dataset });
        console.log(dataset)
      })
      .catch((res) => {
        this.setState({ error: res });
      });
  }

  goBack() {
    this.props.Stores.History.history.goBack()
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
    if (!this.state.dataset.research_dataset) {
      return <div />;
    }

    // CASE 3: Everything ok, give me the data!

    // from language store
    const { currentLang } = this.props.Stores.Locale
    const researchDataset = this.state.dataset.research_dataset
    const titles = researchDataset.title

    const title = titles[currentLang]


    const description = researchDataset.description.filter((single) => {
      if (!single.en) {
        return false
      }
      return true
    })[0].en;
    const { creator, contributor, issued } = researchDataset;

    return (
      <div className="container regular-row">
        <div className="row">
          <div className="col-md-8">
            <button className="btn btn-transparent" onClick={this.goBack}>
              Go back
            </button>
            <DsContent
              title={title}
              creator={creator}
              contributor={contributor}
              issued={issued}
              dataset={researchDataset}
            >
              { description }
            </DsContent>
            <DsDownloads />
          </div>
          <div className="col-md-4">
            <DsSidebar dataset={this.state.dataset} lang={currentLang} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dataset;
