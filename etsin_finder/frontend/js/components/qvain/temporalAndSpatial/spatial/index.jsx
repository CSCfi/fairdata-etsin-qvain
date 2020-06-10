import React, { Component } from 'react'
import Card from '../../general/card'
import Brief from '../../general/brief'
import SpatialFieldContent from './SpatialFieldContent'

const brief = {
    title: 'qvain.temporalAndSpatial.spatial.title',
    description: 'qvain.temporalAndSpatial.spatial.description',
}

class Spatial extends Component {
 render() {
     return (
       <Card>
         <Brief {...brief} />
         <SpatialFieldContent />
       </Card>
     )
 }
}

export default Spatial
