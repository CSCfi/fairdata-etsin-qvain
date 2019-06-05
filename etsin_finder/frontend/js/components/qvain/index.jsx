import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react';

import RightsAndLicenses from './licenses'
import Description from './description';
import Participants from './participants'
import { qvainFormSchema } from './utils/formValidation';
import Files from './files'
import Stores from '../../stores'
import LoginButton from '../general/navigation/loginButton';
import Card, { QvainContainer, SubHeader, SubHeaderText } from './general/card'

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
      fieldOfScience: values.fieldOfScience ? values.fieldOfScience.value : undefined,
      keywords: values.keywords,
      participants: values.participants,
      accessType: values.accessType,
      restrictionGrounds: values.restrictionGrounds.value,
      license: {
        idaPickerOpen: values.idaPickerOpen,
        license: values.license,
        otherLicenseUrl: values.otherLicenseUrl
      }
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
    let view;
    if (Stores.Auth.userLogged && Stores.Auth.CSCUserLogged) {
      view = (
        <form onSubmit={this.handleSubmit} className="container">
          <Description />
          <Participants />
          <RightsAndLicenses />
          <Files />
          <button type="submit">submit</button>
        </form>
      )
    } else if (Stores.Auth.userLogged && !Stores.Auth.CSCUserLogged) {
      view = (
        <div className="container">
          <Card>
            <h2><Translate content="qvain.unsuccessfullLogin" /></h2>
            <div>
              <Translate content="qvain.notCSCUser1" />
              <a href="https://sui.csc.fi"><Translate content="qvain.notCSCUserLink" /></a>.
              <Translate content="qvain.notCSCUser2" />
            </div>
          </Card>
        </div>
      )
    } else if (!Stores.Auth.userLogged && !Stores.Auth.CSCUserLogged) {
      view = (
        <div className="container">
          <Card>
            <h2><Translate content="qvain.notLoggedIn" /></h2>
            <LoginButton />
          </Card>
        </div>
      )
    } else {
      view = null
    }
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText><Translate content="qvain.title" /></SubHeaderText>
        </SubHeader>
        {view}
      </QvainContainer>
    )
  }
}

export default inject('Stores')(observer(Qvain));
