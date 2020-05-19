import React from 'react'
import Translate from 'react-translate-component'

/* add these when implementation of the fields are ready
<Translate component="h2" content="qvain.history.tooltipContent.references.title" />
<Translate component="div" content="qvain.history.tooltipContent.references.paragraph" />

<Translate component="h2" content="qvain.history.tooltipContent.provience.title" />
<Translate component="div" content="qvain.history.tooltipContent.provience.paragraph" />
*/

const TooltipContent = () => (
  <>
    <Translate component="h2" content="qvain.history.tooltipContent.infrastructure.title" />
    <Translate component="div" content="qvain.history.tooltipContent.infrastructure.paragraph" />
  </>
)

export default TooltipContent
