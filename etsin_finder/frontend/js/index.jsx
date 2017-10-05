import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class FetchFromMetax extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Once routing is implemented, get this value from props
    // Note that this dataset may not be always available as test db may
    // be truncated at any time
    this.identifier = "pid:urn:cr1";

    // TODO: Use Metax-test in dev env, actual Metax in production
    this.url = "https://metax-test.csc.fi"

    // TODO: How many vars should we use to represent a dataset?
    this.state = {
      modified: "",
      urn: ""
    };
  }

  componentDidMount() {
    axios.get(`${this.url}/rest/datasets/${this.identifier}.json`)
      .then(res => {

        // TODO: Maybe just save the full dataset? Then create new subcomponents
        // and let them handle picking out whatever piece they want to use.
        // Right now I just want to print out some specific values to make sure I
        // can access everything.
        const modified = res.data.created_by_api;
        this.setState({ modified });
        const urn = res.data.research_dataset.urn_identifier;
        this.setState({ urn });

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // TODO: All of this, obvs
  render() {
    return (
      <div>
        Here be important values:<br />
        {this.state.modified}<br />
        {this.state.urn}<br />
      </div>
    );
  }
}

ReactDOM.render(
    <FetchFromMetax />,
    document.getElementById("content")
);
