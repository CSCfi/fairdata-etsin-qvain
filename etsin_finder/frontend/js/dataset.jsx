import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.identifier = this.props.match.params.identifier;

    // Use Metax-test in dev env, actual Metax in production
    this.url = (process.env.NODE_ENV !== 'production') ? "https://metax-test.csc.fi" : "https://metax-test.csc.fi";
    this.state = { dataset: [] };
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then(res => {
        const dataset = res.data;
        this.setState({ dataset });
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
      <div>
        Here be important values:<br />
        {this.state.dataset.created_by_api}<br />
        {this.state.dataset.research_dataset.urn_identifier}<br />
      </div>
    );
  }
}

export default Dataset;
