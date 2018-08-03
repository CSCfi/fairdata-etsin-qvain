/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import counterpart from 'counterpart'

import finnish from './finnish'
import english from './english'

counterpart.registerTranslations('en', english)
counterpart.registerTranslations('fi', finnish)
