import React, { Component } from 'react'
import { TypeLocation } from '../../../utils/propTypes'
import MyMap from './map'

class Maps extends Component {
  static propTypes = {
    spatial: TypeLocation.isRequired,
  }
  render() {
    return (
      <div>
        {this.props.spatial.map(spatial => {
          if (spatial.as_wkt !== undefined) {
            console.log(spatial.as_wkt)
            return <MyMap geometry={spatial.as_wkt} />
          }
          return null
        })}
      </div>
    )
  }
}

export default Maps
