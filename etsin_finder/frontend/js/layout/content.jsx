import React from "react";
import { Route } from 'react-router-dom';
import Dataset from '../dataset';

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
      <Route path="/dataset" render={()=>{
        return (
          <div className="dataset">
            <div className="container">
              <h2 className="text-center">Single Dataset</h2>
            </div>
          </div>
        )
      }}/>
      <Route path="/datasets" render={()=>{
        return (
          <div className="datasets">
            <div className="container">
              <h2 className="text-center">All Datasets</h2>
            </div>
          </div>
        )
      }}/>
    </div>
    );
  }
}