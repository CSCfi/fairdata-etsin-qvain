import React from "react";
import ReactDOM from "react-dom";

import axios from "axios";
import counterpart from 'counterpart';
import { inject, observer } from 'mobx-react';
import Translate from 'react-translate-component';

import DsSidebar from './components/dsSidebar';
import DsDownloads from './components/dsDownloads';
import DsContent from './components/dsContent';

@inject("stores") @observer
class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.identifier = this.props.match.params.identifier;

    // Use Metax-test in dev env, actual Metax in production
    this.url = (process.env.NODE_ENV !== 'production') ? "https://metax-test.csc.fi" : "https://metax-test.csc.fi";
    this.state = { dataset: [], error: "" };
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then(res => {
        const dataset = res.data;
        this.setState({ dataset });
      })
      .catch(res => {
        this.setState({ error: res });
      });
  }

  // TODO: All of this, obvs
  render() {
    // from language store
    let current_lang = this.props.stores.locale.current_lang;

    // CASE 1: Houston, we have a problem
    if (this.state.dataset.error !== "") {
      return (
        <div>
          <Translate content="error.notFound" />
        </div>
      );
    }

    // CASE 2: Loading not complete
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.dataset.research_dataset) {
      return <DsNotFound />;
    }

    // CASE 3: Everything ok, give me the data!
    let title = this.state.dataset.research_dataset.title[current_lang];
    let description = this.state.dataset.research_dataset.description.filter((single) => {
      if (single["en"]) {
        return true;
      }
    })[0]["en"];
    let curator = this.state.dataset.research_dataset.curator;

    return (
      <div className="container regular-row">
        <div className="row">
          <div className="col-md-8">
            <DsContent title={title} curator={curator}>
            { description }
            </DsContent>
            <DsDownloads />
          </div>
          <div className="col-md-4">
            <DsSidebar dataset={this.state.dataset} lang={current_lang}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Dataset;
