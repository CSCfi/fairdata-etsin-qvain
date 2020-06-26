import React from 'react'
import Translate from 'react-translate-component'

const TooltipContent = () => (
  <>
    <Translate component="h2" content="qvain.history.tooltipContent.infrastructure.title" />
    <Translate component="div" content="qvain.history.tooltipContent.infrastructure.paragraph" />
    <Translate component="h2" content="qvain.history.tooltipContent.relatedResource.title" />
    <Translate component="div" content="qvain.history.tooltipContent.relatedResource.paragraph" />
    <Translate component="h2" content="qvain.history.tooltipContent.provenance.title" />
    <Translate component="div" content="qvain.history.tooltipContent.provnance.paragraph" />
  </>
)

export default TooltipContent
