import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react';

import RightsAndLicenses from './licenses'
import Description from './description';
import Participants from './participants'
import { qvainFormSchema } from './utils/formValidation';
import Files from './files'
import { QvainContainer, SubHeader, SubHeaderText } from './general/card'

class Qvain extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const values = this.props.Stores.Qvain;
    const obj = {
      title: {
        fi: values.title.fi,
        en: values.title.en
      },
      description: {
        fi: values.description.fi,
        en: values.description.en
      },
      identifiers: values.otherIdentifiers,
      fieldOfScience: values.fieldOfScience.value,
      keywords: values.keywords,
      participants: values.participants,
      accessType: values.accessType,
      restrictionGrounds: values.restrictionGrounds.value,
      license: values.license
    };
    console.log(JSON.stringify(obj, null, 4));
    qvainFormSchema.validate(obj, { abortEarly: false })
      .then((val) => {
        console.log(val)
      })
      .catch(err => {
        // console.log(err.name)
        console.log(err.errors)
      })
  }

  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText><Translate content="qvain.title" /></SubHeaderText>
        </SubHeader>
        <form onSubmit={this.handleSubmit} className="container">
          <Description />
          <Participants />
          <RightsAndLicenses />
          <Files />
          <button type="submit">submit</button>
        </form>
      </QvainContainer>
    )
  }
}

export default inject('Stores')(observer(Qvain));
