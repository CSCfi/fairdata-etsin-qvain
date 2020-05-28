import React, { Component } from 'react'
import Field from '../../general/section/field'
import SpatialFieldContent from './SpatialFieldContent'

const brief = {
    title: 'qvain.temporalAndSpatial.spatial.title',
    description: 'qvain.temporalAndSpatial.spatial.description',
}

class Spatial extends Component {
 render() {
     return (
       <Field brief={brief}>
         <SpatialFieldContent />
       </Field>
     )
 }
}

export default Spatial
