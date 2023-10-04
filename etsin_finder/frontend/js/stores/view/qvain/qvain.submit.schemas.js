import * as yup from 'yup'

import { ACCESS_TYPE_URL } from '../../../utils/constants'
import { titleSchema } from './qvain.title'
import { descriptionSchema, descriptionDraftSchema } from './qvain.description'
import { keywordsArraySchema, keywordsDraftSchema } from './qvain.keyword'
import { fieldsOfScienceSchema } from './qvain.fieldOfScience'
import { otherIdentifiersArraySchema } from './qvain.otherIdentifier'
import { licenseArrayMetaxSchema } from './qvain.license'
import { accessTypeMetaxSchema } from './qvain.accessType'
import { restrictionGroundsMetaxSchema } from './qvain.restrictionGrounds'
import { metaxActorsSchema, metaxActorSchema, getRequiredMetaxActorSchema } from './qvain.actors'
import {
  cumulativeStateSchema,
  useDoiSchema,
  dataCatalogSchema,
  dataCatalogDraftSchema,
} from './qvain.dataCatalog.schemas'
import { filesSchema, directoriesSchema } from './qvain.files'
import { embargoExpDateSchema } from './qvain.embargoExpDate'

const accessRightsDraftSchema = yup
  .object()
  .shape({
    license: licenseArrayMetaxSchema,
    access_type: accessTypeMetaxSchema,
    restriction_grounds: yup.mixed().when('access_type.identifier', {
      is: url => url !== ACCESS_TYPE_URL.OPEN,
      then: restrictionGroundsMetaxSchema,
    }),
    available: embargoExpDateSchema,
  })
  .noUnknown()

const accessRightsSchema = yup
  .object()
  .shape({
    license: licenseArrayMetaxSchema,
    access_type: accessTypeMetaxSchema.required('qvain.validationMessages.accessType.required'),
    restriction_grounds: yup.mixed().when('access_type.identifier', {
      is: url => url !== ACCESS_TYPE_URL.OPEN,
      then: restrictionGroundsMetaxSchema,
    }),
    available: embargoExpDateSchema,
  })
  .noUnknown()
  .required('qvain.validationMessages.accessType.required')

// Entire form validation for normal dataset
const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  issued: yup.mixed().when('use_doi', {
    is: true,
    then: yup.string().date().required('qvain.validationMessages.issuedDate.requiredIfUseDoi'),
    otherwise: yup.string().date().nullable(),
  }),
  access_rights: accessRightsSchema,
  field_of_science: fieldsOfScienceSchema,
  keyword: keywordsArraySchema,
  otheridentifiers: otherIdentifiersArraySchema,
  creator: metaxActorsSchema
    .min(1, 'qvain.validationMessages.actors.requiredActors.creator')
    .required('qvain.validationMessages.actors.requiredActors.creator'),
  publisher: getRequiredMetaxActorSchema(
    'qvain.validationMessages.actors.requiredActors.publisher'
  ),
  rights_holder: metaxActorsSchema,
  curator: metaxActorsSchema,
  contributor: metaxActorsSchema,
  data_catalog: dataCatalogSchema,
  cumulative_state: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
  use_doi: useDoiSchema,
})

// Entire form validation for draft
const qvainFormDraftSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionDraftSchema,
  issued: yup.string().date().nullable(),
  field_of_science: fieldsOfScienceSchema,
  keyword: keywordsDraftSchema,
  other_identifiers: otherIdentifiersArraySchema,
  access_rights: accessRightsDraftSchema,
  creator: metaxActorsSchema,
  publisher: metaxActorSchema,
  rights_holder: metaxActorsSchema,
  curator: metaxActorsSchema,
  contributor: metaxActorsSchema,
  data_catalog: dataCatalogDraftSchema,
  cumulative_state: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
  use_doi: useDoiSchema,
})

export { qvainFormSchema, qvainFormDraftSchema }
