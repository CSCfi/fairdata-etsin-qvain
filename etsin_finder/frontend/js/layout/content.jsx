import React from "react";
import { Route } from 'react-router-dom';
import Translate from 'react-translate-component';

export default class Content extends React.Component {
  render () {
    return (
    <div className="content">
      <Route path="/main" render={()=>{
        return (
          <div className="hero">
            <div className="container">
              <h2 className="text-center">
                <Translate content="home.title" />
              </h2>
            </div>
          </div>
        );
      }}/>
    </div>
    );
  }
}