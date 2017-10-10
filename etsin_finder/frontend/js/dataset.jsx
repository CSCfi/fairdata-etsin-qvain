import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import counterpart from 'counterpart';

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

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="content">
              {
                // getting the description based on locale, should use mobX
                this.state.dataset.research_dataset.description.filter((single) => {
                  if (single[counterpart.getLocale()]) {
                    return true;
                  }
                })[0][counterpart.getLocale()]
              }
            </div>
            <div className="content-footer">
              Footer box
            </div>
          </div>
          <div className="col-md-4">
            <div className="sidebar">
              <div className="separator">Säilityspaikka</div>
              <div className="separator">Julkaisupaikka</div>
              <div>Tieteenala</div>
              <button type="button" className="btn btn-primary">
                Näytä lisää tietojava
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dataset;
