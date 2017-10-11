import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import counterpart from 'counterpart';
import { observer } from 'mobx-react';

import DsSidebar from './components/dsSidebar';
import DsDownloads from './components/dsDownloads';
import DsContent from './components/dsContent';

@observer(['stores'])
class Dataset extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Once routing is implemented, get this value from props
    // Note that this dataset may not be always available as test db may
    // be truncated at any time
    this.identifier = "pid:urn:cr1";

    // TODO: Use Metax-test in dev env, actual Metax in production
    this.url = "https://metax-test.csc.fi",

    this.state = { dataset: [] };
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then(res => {
        const dataset = res.data;
        this.setState({ dataset });
        console.log(dataset);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // TODO: All of this, obvs
  render() {
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.dataset.research_dataset) {
      return <div></div>;
    }
    // from language store
    let current_lang = this.props.stores.locale.current_lang;

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
