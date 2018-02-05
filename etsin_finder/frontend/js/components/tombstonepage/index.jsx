import React from 'react';
import Translate from 'react-translate-component';
import DateFormat from '../dataset/data/dateFormat';
import HeroBanner from '../general/hero';

export default class TombstonePage extends React.Component {
  render() {
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <h1 className="text-center">
              <Translate content="tombstone.info" />
            </h1>
            <h2 className="text-center"><Translate content="tombstone.pid" />: {this.props.preferred_identifier}</h2>
            <h2 className="text-center"><Translate content="tombstone.version" />: {this.props.version_identifier}</h2>
          </div>
        </HeroBanner>
        <div className="text-center">
          <div><strong><Translate content="tombstone.title" /></strong>: {this.props.title}</div>
          <div><strong><Translate content="tombstone.last_modified" /></strong>: <DateFormat date={this.props.date_modified} /></div>
          <div><strong><Translate content="tombstone.description" /></strong>: {this.props.description}</div>
        </div>
      </div>
    );
  }
}
