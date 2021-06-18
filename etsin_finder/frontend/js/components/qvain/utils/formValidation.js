import * as yup from 'yup'

import {
  ACCESS_TYPE_URL,
  ENTITY_TYPE,
  ROLE,
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
} from '../../../utils/constants'
import { titleSchema } from '../../../stores/view/qvain/qvain.title'
import { descriptionSchema } from '../../../stores/view/qvain/qvain.description'
import { keywordsSchema, keywordsArraySchema } from '../../../stores/view/qvain/qvain.keyword'
import { fieldsOfScienceSchema } from '../../../stores/view/qvain/qvain.fieldOfScience'
import { issuedDateSchema } from '../../../stores/view/qvain/qvain.issuedDate'
import {
  otherIdentifierSchema,
  otherIdentifiersArraySchema,
} from '../../../stores/view/qvain/qvain.otherIdentifier'
import { licenseSchema, licenseArraySchema } from '../../../stores/view/qvain/qvain.license'
import { accessTypeSchema } from '../../../stores/view/qvain/qvain.accessType'
import { embargoExpDateSchema } from '../../../stores/view/qvain/qvain.embargoExpDate'
import { restrictionGroundsSchema } from '../../../stores/view/qvain/qvain.restrictionGrounds'
import {
  actorRolesSchema,
  actorType,
  personNameSchema,
  personEmailSchema,
  personIdentifierSchema,
  organizationNameSchema,
  organizationEmailSchema,
  organizationNameTranslationsSchema,
  organizationIdentifierSchema,
  actorSchema,
  actorsSchema,
  personSchema,
  organizationSchema,
  actorOrganizationSchema,
} from '../../../stores/view/qvain/qvain.actors'

// Validation for draft datasets: description is not .required()
const descriptionSchemaDraft = yup
  .object()
  .shape({
    fi: yup.mixed().when('en', {
      is: val => val.length > 0,
      then: yup
        .string()
        .typeError('qvain.validationMessages.description.string')
        .max(50000, 'qvain.validationMessages.description.max'),
      otherwise: yup
        .string()
        .typeError('qvain.validationMessages.description.string')
        .max(50000, 'qvain.validationMessages.description.max'),
    }),
    en: yup
      .string()
      .typeError('qvain.validationMessages.description.string')
      .max(50000, 'qvain.validationMessages.description.max'),
  })
  .nullable()

// Validation for draft datasets: keywords are not .required()
const keywordsSchemaDraft = yup
  .array()
  .nullable()
  .of(
    yup
      .string()
      .typeError('qvain.validationMessages.keywords.string')
      .max(1000, 'qvain.validationMessages.keywords.max')
  )

// LICENSE AND ACCESS VALIDATION

// you have to provide the license object and the otherLicenseUrl

// Draft actor
export const actorTypeDraft = yup
  .mixed()
  .oneOf(
    [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
    'qvain.validationMessages.actors.type.oneOf'
  )

const actorRolesSchemaDraft = yup
  .array()
  .of(
    yup
      .mixed()
      .oneOf(
        [
          ROLE.CREATOR,
          ROLE.CURATOR,
          ROLE.PUBLISHER,
          ROLE.RIGHTS_HOLDER,
          ROLE.CONTRIBUTOR,
          ROLE.PROVENANCE,
        ],
        'qvain.validationMessages.actors.roles.oneOf'
      )
  )
  .min(1, 'qvain.validationMessages.actors.roles.min')

const personNameSchemaDraft = yup
  .string()
  .typeError('qvain.validationMessages.actors.name.string')
  .max(1000, 'qvain.validationMessages.actors.name.max')

// Data catalog
const dataCatalogSchema = yup
  .string()
  .required('qvain.validationMessages.files.dataCatalog.required')
  .matches(
    /urn:nbn:fi:att:data-catalog-(?!dft)/,
    'qvain.validationMessages.files.dataCatalog.wrongType'
  )

// Data catalog for draft
const dataCatalogSchemaDraft = yup.string()

// CUMULATIVE STATE
const cumulativeStateSchema = yup
  .mixed()
  .oneOf([CUMULATIVE_STATE.NO, CUMULATIVE_STATE.YES, CUMULATIVE_STATE.CLOSED])

// FILE AND DIRECTORY (IDA RESOURCES) VALIDATION

const fileUseCategorySchema = yup
  .object()
  .required('qvain.validationMessages.files.file.useCategory.required')

const fileTitleSchema = yup.string().required('qvain.validationMessages.files.file.title.required')

const fileDescriptionSchema = yup
  .string()
  .required('qvain.validationMessages.files.file.description.required')

const fileSchema = yup.object().shape({
  title: fileTitleSchema,
  description: fileDescriptionSchema,
  useCategory: fileUseCategorySchema,
  fileType: yup.object().nullable(),
})

const filesSchema = yup.array().of(fileSchema)

const directoryTitleSchema = yup
  .string()
  .required('qvain.validationMessages.files.directory.title.required')

const directoryDescriptionSchema = yup.string()

const directoryUseCategorySchema = yup
  .object()
  .required('qvain.validationMessages.files.directory.useCategory.required')

const directorySchema = yup.object().shape({
  title: directoryTitleSchema,
  description: directoryDescriptionSchema,
  useCategory: directoryUseCategorySchema,
  fileType: yup.object().nullable(),
})

const directoriesSchema = yup.array().of(directorySchema)

// USE DOI SCHEMA (IDA)
const useDoiSchema = yup.boolean()

// PAS METADATA VALIDATION

export const fileMetadataSchema = yup.object().shape({
  fileFormat: yup.string().required(),
  formatVersion: yup.string(),
  encoding: yup.string().required(),
  csvHasHeader: yup.boolean().required(),
  csvDelimiter: yup.string().required(),
  csvRecordSeparator: yup.string().required(),
  csvQuotingChar: yup.string().required(),
})

// PROJECT VALIDATION
const organizationSelectSchema = yup.object().shape({
  identifier: yup.string(),
  name: yup.object().shape({
    und: yup.string().required('qvain.validationMessages.projects.organization.name'),
  }),
  email: yup.string().email('qvain.validationMessages.projects.organization.email'),
})

const organizationObjectSchema = yup.object().shape({
  organization: organizationSelectSchema
    .nullable()
    .required('qvain.validationMessages.projects.organization.name'),
  department: organizationSelectSchema.nullable(),
  subDepartment: organizationSelectSchema.nullable(),
})

const fundingAgencySchema = yup.object().shape({
  identifier: yup
    .mixed()
    .required('qvain.validationMessages.projects.fundingAgency.contributorType.identifier'),
  labelFi: yup.string(),
  labelEn: yup.string(),
  definitionFi: yup.string(),
  definitionEn: yup.string(),
  inScheme: yup.string(),
})

const projectSchema = yup.object().shape({
  details: yup.object().shape({
    titleFi: yup.mixed().when('titleEn', {
      is: val => Boolean(val),
      then: yup.string().typeError('qvain.validationMessages.projects.title.string'),
      otherwise: yup
        .string()
        .typeError('qvain.validationMessages.projects.title.string')
        .required('qvain.validationMessages.projects.title.required'),
    }),
    titleEn: yup.string().typeError('qvain.vaidationMessages.projects.title.string'),
    identifier: yup.string(),
    fundingIdentifier: yup.string(),
    funderType: yup.object().nullable(),
  }),
  organizations: yup.array().min(1, 'qvain.validationMessages.projects.organization.min'),
  fundingAgencies: yup.array().min(0),
})

// EXTERNAL RESOURCES VALIDATION

const externalResourceTitleSchema = yup
  .string()
  .required('qvain.validationMessages.externalResources.title.required')

// Use category is one of preset 7 options (all strings)
const externalResourceUseCategorySchema = yup.object().shape({
  value: yup.string().required('qvain.validationMessages.externalResources.useCategory.required'),
})

const externalResourceAccessUrlSchema = yup
  .string()
  .url('qvain.validationMessages.externalResources.accessUrl.validFormat')

const externalResourceDownloadUrlSchema = yup
  .string()
  .url('qvain.validationMessages.externalResources.downloadUrl.validFormat')

const externalResourceSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  accessUrl: externalResourceAccessUrlSchema,
  downloadUrl: externalResourceDownloadUrlSchema,
})

// ENTIRE ACTOR SCHEMAS

const personSchemaDraft = yup.object().shape({
  name: personNameSchemaDraft,
  email: personEmailSchema,
  identifier: personIdentifierSchema,
})

const actorSchemaDraft = yup.object().shape({
  type: actorTypeDraft,
  roles: actorRolesSchemaDraft,
  person: yup.object().when('type', {
    is: ENTITY_TYPE.PERSON,
    then: personSchemaDraft,
    otherwise: yup.object().nullable(),
  }),
  organizations: yup.array().of(organizationSchema),
})

// Actors schema for draft
const actorsSchemaDraft = yup.array().of(actorSchemaDraft)

// SPATIAL VALIDATION
const spatialNameSchema = yup
  .string()
  .typeError('qvain.validationMessages.temporalAndSpatial.spatial.nameRequired')
  .required('qvain.validationMessages.temporalAndSpatial.spatial.nameRequired')

const spatialAltitudeSchema = yup
  .string()
  .number()
  .typeError('qvain.validationMessages.temporalAndSpatial.spatial.altitudeNan')

// TEMPORAL VALIDATION
const temporalDateSchema = yup.object().shape({
  startDate: yup
    .string()
    .date()
    .when('endDate', {
      is: undefined,
      then: yup
        .string()
        .date()
        .required('qvain.validationMessages.temporalAndSpatial.temporal.dateMissing'),
      otherwise: yup.string().date(),
    }),
  endDate: yup.string().date(),
})

// RELATED RESOURCE
const relatedResourceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string().typeError('qvain.validationMessages.history.relatedResource.nameRequired'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.history.relatedResource.nameRequired')
      .required('qvain.validationMessages.history.relatedResource.nameRequired'),
  }),
  en: yup.string().typeError('qvain.validationMessages.history.relatedResource.nameRequired'),
})

const relatedResourceTypeSchema = yup
  .object()
  .required('qvain.validationMessages.history.relatedResource.typeRequired')

// PROVENANCE
const provenanceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string().typeError('qvain.validationMessages.history.provenance.nameRequired'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.history.provenance.nameRequired')
      .required('qvain.validationMessages.history.provenance.nameRequired'),
  }),
  en: yup.string().typeError('qvain.validationMessages.history.provenance.nameRequired'),
})

const provenanceDateSchema = yup.object().shape({
  startDate: yup.string().date(),
  endDate: yup.string().date(),
})

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
const qvainFormSchemaDraft = yup.object().shape({
  title: titleSchema,
  description: descriptionSchemaDraft,
  issuedDate: yup.string().date().nullable(),
  fieldOfScience: fieldsOfScienceSchema,
  keywords: keywordsSchemaDraft,
  otherIdentifiers: otherIdentifiersArraySchema,
  accessType: accessTypeSchema,
  license: licenseArraySchema,
  restrictionGrounds: yup.mixed().when('accessType.url', {
    is: url => url !== ACCESS_TYPE_URL.OPEN,
    then: restrictionGroundsSchema,
  }),
  actors: actorsSchemaDraft,
  dataCatalog: dataCatalogSchemaDraft,
  cumulativeState: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
  useDoi: useDoiSchema,
})

export {
  qvainFormSchema,
  issuedDateSchema,
  otherIdentifierSchema,
  otherIdentifiersArraySchema,
  keywordsSchema,
  keywordsArraySchema,
  accessTypeSchema,
  licenseSchema,
  embargoExpDateSchema,
  restrictionGroundsSchema,
  actorsSchema,
  actorSchema,
  actorType,
  personNameSchema,
  actorRolesSchema,
  personEmailSchema,
  personIdentifierSchema,
  organizationNameSchema,
  organizationEmailSchema,
  organizationIdentifierSchema,
  actorOrganizationSchema,
  dataCatalogSchema,
  fieldsOfScienceSchema,
  fileTitleSchema,
  fileDescriptionSchema,
  fileUseCategorySchema,
  fileSchema,
  filesSchema,
  directoryTitleSchema,
  directoryDescriptionSchema,
  directoryUseCategorySchema,
  directorySchema,
  directoriesSchema,
  useDoiSchema,
  externalResourceSchema,
  externalResourceTitleSchema,
  externalResourceAccessUrlSchema,
  externalResourceDownloadUrlSchema,
  spatialNameSchema,
  spatialAltitudeSchema,
  projectSchema,
  organizationSelectSchema,
  fundingAgencySchema,
  relatedResourceNameSchema,
  relatedResourceTypeSchema,
  provenanceNameSchema,
  provenanceDateSchema,
  temporalDateSchema,
  organizationObjectSchema,
  // Schemas specific to draft datasets
  qvainFormSchemaDraft,
  descriptionSchemaDraft,
  keywordsSchemaDraft,
  dataCatalogSchemaDraft,
  actorsSchemaDraft,
  actorSchemaDraft,
}
