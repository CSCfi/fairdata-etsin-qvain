/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action } from 'mobx'

class SearchFilters {
    @observable fieldOfScienceIsOpen = false

    @observable keywordIsOpen = false

    @observable projectIsOpen = false

    @action toggleFieldOfScience = () => {
        this.fieldOfScienceIsOpen = !this.fieldOfScienceIsOpen
    }

    @action toggleKeyword = () => {
        this.keywordIsOpen = !this.keywordIsOpen
    }

    @action toggleProject = () => {
        this.projectIsOpen = !this.projectIsOpen
    }
}


export default new SearchFilters()
