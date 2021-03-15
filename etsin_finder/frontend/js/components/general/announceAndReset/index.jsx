{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import Accessibility from '../../../stores/view/accessibility'
import TextToAnnounce from './textToAnnounce'

const AnnounceAndReset = () => (
  <>
    <div className="sr-only" aria-live="polite">
      <TextToAnnounce location="politeAnnouncement" />
    </div>
    <div
      className="sr-only"
      aria-live="assertive"
      tabIndex="-1"
      ref={Accessibility.focusableElement}
    >
      <TextToAnnounce location="assertiveAnnouncement" />
    </div>
  </>
)

export default AnnounceAndReset
