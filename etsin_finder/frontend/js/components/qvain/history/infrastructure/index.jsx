import React from 'react'
import InfrastructureFieldContent from './InfrastructureFieldContent'
import Card from '../../general/card'

const brief = {
  title: 'qvain.history.infrastructure.title',
  description: 'qvain.history.infrastructure.description',
}

const Infrastructure = () => <Card><InfrastructureFieldContent {...brief} /></Card>
export default Infrastructure
