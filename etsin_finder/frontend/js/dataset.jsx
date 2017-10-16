import React from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';

import DsSidebar from './components/dsSidebar';
import DsDownloads from './components/dsDownloads';
import DsContent from './components/dsContent';

@observer(['stores'])
class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.identifier = this.props.match.params.identifier;

    // Use Metax-test in dev env, actual Metax in production
    this.url = (process.env.NODE_ENV !== 'production')
      ? 'https://metax-test.csc.fi'
      : 'put_production_URL_here';

    this.state = { dataset: [] };
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then((res) => {
        const dataset = res.data;
        this.setState({ dataset });
        console.log(dataset);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // TODO: All of this, obvs
  render() {
    // Don't show anything until data has been loaded from Metax
    // TODO: Use a loading indicator instead
    // Do we need to worry about Metax sending us incomplete datasets?
    if (!this.state.dataset.research_dataset) {
      return <div />;
    }
    // from language store
    const { currentLang } = this.props.stores.Locale;

    const title = this.state.dataset.research_dataset.title[currentLang];
    const description = this.state.dataset.research_dataset.description.filter((single) => {
      if (!single.en) {
        return false
      }
      return true
    })[0].en;
    const { curator } = this.state.dataset.research_dataset;

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
            <DsSidebar dataset={this.state.dataset} lang={currentLang} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dataset;
