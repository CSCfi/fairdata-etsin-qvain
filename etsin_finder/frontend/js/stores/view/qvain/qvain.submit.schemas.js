import yup from '../../../utils/extendedYup'

import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import { titleSchema } from './qvain.title'
import { descriptionSchema, descriptionDraftSchema } from './qvain.description'
import { keywordsArraySchema, keywordsDraftSchema } from './qvain.keyword'
import { fieldsOfScienceSchema } from './qvain.fieldOfScience'
import { otherIdentifiersArraySchema } from './qvain.otherIdentifier'
import { licenseArraySchema } from './qvain.license'
import { accessTypeSchema } from './qvain.accessType'
import { restrictionGroundsSchema } from './qvain.restrictionGrounds'
import { actorsSchema, actorsDraftSchema } from './qvain.actors'
import {
  cumulativeStateSchema,
  useDoiSchema,
  dataCatalogSchema,
  dataCatalogDraftSchema,
} from './qvain.dataCatalog.schemas'
import { filesSchema, directoriesSchema } from './qvain.files'

// Entire form validation for normal dataset
const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  issuedDate: yup.mixed().when('useDoi', {
    is: true,
    then: yup.string().date().required('qvain.validationMessages.issuedDate.requiredIfUseDoi'),
    otherwise: yup.string().date().nullable(),
  }),
  fieldOfScience: fieldsOfScienceSchema,
  keywords: keywordsArraySchema,
  otherIdentifiers: otherIdentifiersArraySchema,
  accessType: accessTypeSchema,
  license: yup.mixed().when('dataCatalog', {
    is: DATA_CATALOG_IDENTIFIER.IDA,
    then: licenseArraySchema.required('qvain.validationMessages.license.requiredIfIDA'),
    otherwise: licenseArraySchema,
  }),
  restrictionGrounds: yup.mixed().when('accessType.url', {
    is: url => url !== ACCESS_TYPE_URL.OPEN,
    then: restrictionGroundsSchema,
  }),
  actors: actorsSchema,
  dataCatalog: dataCatalogSchema,
  cumulativeState: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
  useDoi: useDoiSchema,
})

// Entire form validation for draft
const qvainFormDraftSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionDraftSchema,
  issuedDate: yup.string().date().nullable(),
  fieldOfScience: fieldsOfScienceSchema,
  keywords: keywordsDraftSchema,
  otherIdentifiers: otherIdentifiersArraySchema,
  accessType: accessTypeSchema,
  license: licenseArraySchema,
  restrictionGrounds: yup.mixed().when('accessType.url', {
    is: url => url !== ACCESS_TYPE_URL.OPEN,
    then: restrictionGroundsSchema,
  }),
  actors: actorsDraftSchema,
  dataCatalog: dataCatalogDraftSchema,
  cumulativeState: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
  useDoi: useDoiSchema,
})

export { qvainFormSchema, qvainFormDraftSchema }
