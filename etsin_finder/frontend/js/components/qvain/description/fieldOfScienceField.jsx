import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';
import Translate from 'react-translate-component';

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card';

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fieldOfScienceEn: [{ value: '', label: '' }],
    fieldOfScienceFi: [{ value: '', label: '' }]
  }

  componentDidMount = () => {
    getReferenceData('field_of_science')
    .then(res => {
      const list = res.data.hits.hits;
      const refsEn = list.map(ref => (
        {
          value: ref._source.label.en,
          label: ref._source.label.en,
        }
        ))
      const refsFi = list.map(ref => (
        {
          value: ref._source.label.en,
          label: ref._source.label.fi,
        }
        ))
      this.setState({ fieldOfScienceEn: refsEn })
      this.setState({ fieldOfScienceFi: refsFi })
    })
    .catch(error => {
      if (error.response) {
        // Error response from Metax
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // No response from Metax
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  }

  render() {
    return (
      <Card>
        <Translate component="h3" content="qvain.description.fieldOfScience.title" />
        <Translate
          name="field-of-science"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          className="basic-single"
          classNamePrefix="select"
          options={
            this.props.Stores.Locale.lang === 'en'
            ? this.state.fieldOfScienceEn
            : this.state.fieldOfScienceFi
          }
          onChange={(fieldOfScience) => {
            this.props.Stores.Qvain.setFieldOfScience(fieldOfScience)
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField));
