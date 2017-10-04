import React from "react";
import { Route } from 'react-router-dom'

export default class Content extends React.Component {
  render () {
    return (
    <div className="content">
      <Route path="/main" render={()=>{
        return (
          <div className="hero">
            <div className="container">
              <h2 className="text-center">Etsi aineistoa</h2>
            </div>
          </div>
        );
      }}/>
    </div>
    );
  }
}