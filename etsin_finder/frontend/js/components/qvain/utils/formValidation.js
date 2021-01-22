import * as yup from 'yup'
import translate from 'counterpart'
import {
  ACCESS_TYPE_URL,
  ENTITY_TYPE,
  ROLE,
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
} from '../../../utils/constants'

// DATASET DESCRIPTION VALIDATION

const titleSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string(translate('qvain.validationMessages.title.string'))
      .max(500, translate('qvain.validationMessages.title.max')),
    otherwise: yup
      .string(translate('qvain.validationMessages.title.string'))
      .max(500, translate('qvain.validationMessages.title.max'))
      .required(translate('qvain.validationMessages.title.required')),
  }),
  en: yup
    .string(translate('qvain.validationMessages.title.string'))
    .max(500, translate('qvain.validationMessages.title.max')),
})

const descriptionSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string(translate('qvain.validationMessages.description.string'))
      .max(50000, translate('qvain.validationMessages.description.max')),
    otherwise: yup
      .string(translate('qvain.validationMessages.description.string'))
      .max(50000, translate('qvain.validationMessages.description.max'))
      .required(translate('qvain.validationMessages.description.required')),
  }),
  en: yup
    .string(translate('qvain.validationMessages.description.string'))
    .max(50000, translate('qvain.validationMessages.description.max')),
})

// Validation for draft datasets: description is not .required()
const descriptionSchemaDraft = yup
  .object()
  .shape({
    fi: yup.mixed().when('en', {
      is: val => val.length > 0,
      then: yup
        .string(translate('qvain.validationMessages.description.string'))
        .max(50000, translate('qvain.validationMessages.description.max')),
      otherwise: yup
        .string(translate('qvain.validationMessages.description.string'))
        .max(50000, translate('qvain.validationMessages.description.max')),
    }),
    en: yup
      .string(translate('qvain.validationMessages.description.string'))
      .max(50000, translate('qvain.validationMessages.description.max')),
  })
  .nullable()

const keywordsSchema = yup
  .array()
  .of(
    yup
      .string(translate('qvain.validationMessages.keywords.string'))
      .max(1000, translate('qvain.validationMessages.keywords.max'))
  )
  .required(translate('qvain.validationMessages.keywords.required'))

// Validation for draft datasets: keywords are not .required()
const keywordsSchemaDraft = yup
  .array()
  .nullable()
  .of(
    yup
      .string(translate('qvain.validationMessages.keywords.string'))
      .max(1000, translate('qvain.validationMessages.keywords.max'))
  )

const fieldsOfScienceSchema = yup.array().of(yup.string())

const issuedDateSchema = yup.date().nullable()

const otherIdentifierSchema = yup
  .string(translate('qvain.validationMessages.otherIdentifiers.string'))
  .min(10, translate('qvain.validationMessages.otherIdentifiers.min'))
  .url(translate('qvain.validationMessages.otherIdentifiers.url'))
  .max(1000, translate('qvain.validationMessages.otherIdentifiers.max'))

const otherIdentifiersArraySchema = yup.array().of(otherIdentifierSchema).nullable()

// LICENSE AND ACCESS VALIDATION

// you have to provide the license object and the otherLicenseUrl
const licenseSchema = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup.string().required(),
  otherLicenseUrl: yup
    .string(translate('qvain.validationMessages.license.otherUrl.string'))
    .url(translate('qvain.validationMessages.license.otherUrl.url'))
    .required(translate('qvain.validationMessages.license.otherUrl.required'))
    .nullable(),
})

const licenseArrayObject = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup
    .string(translate('qvain.validationMessages.license.otherUrl.string'))
    .url(translate('qvain.validationMessages.license.otherUrl.url'))
    .required(translate('qvain.validationMessages.license.otherUrl.required')),
})

const licenseArraySchema = yup.array().of(licenseArrayObject).nullable()

const accessTypeSchema = yup.object().shape({
  name: yup.string(),
  url: yup
    .string(translate('qvain.validationMessages.accessType.string'))
    .url(translate('qvain.validationMessages.accessType.url'))
    .required(translate('qvain.validationMessages.accessType.required')),
})

const embargoExpDateSchema = yup.date().nullable()

const restrictionGroundsSchema = yup
  .string(translate('qvain.validationMessages.restrictionGrounds.string'))
  .url(translate('qvain.validationMessages.restrictionGrounds.url'))
  .required(translate('qvain.validationMessages.restrictionGrounds.required'))

// ACTOR VALIDATION SCHEMAS

const actorType = yup
  .mixed()
  .oneOf(
    [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
    translate('qvain.validationMessages.actors.type.oneOf')
  )
  .required(translate('qvain.validationMessages.actors.type.required'))

// Draft actor
const actorTypeDraft = yup
  .mixed()
  .oneOf(
    [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
    translate('qvain.validationMessages.actors.type.oneOf')
  )

const actorRolesSchema = yup
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
        translate('qvain.validationMessages.actors.roles.oneOf')
      )
  )
  .required(translate('qvain.validationMessages.actors.roles.required'))

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
        translate('qvain.validationMessages.actors.roles.oneOf')
      )
  )

const personNameSchema = yup
  .string(translate('qvain.validationMessages.actors.name.string'))
  .max(1000, translate('qvain.validationMessages.actors.name.max'))
  .required(translate('qvain.validationMessages.actors.name.required'))

const personNameSchemaDraft = yup
  .string(translate('qvain.validationMessages.actors.name.string'))
  .max(1000, translate('qvain.validationMessages.actors.name.max'))

const personEmailSchema = yup
  .string(translate('qvain.validationMessages.actors.email.string'))
  .max(1000, translate('qvain.validationMessages.actors.email.max'))
  .email(translate('qvain.validationMessages.actors.email.email'))
  .nullable()

const personIdentifierSchema = yup
  .string()
  .max(1000, translate('qvain.validationMessages.actors.identifier.max'))
  .nullable()

const organizationNameSchema = yup
  .string(translate('qvain.validationMessages.actors.organization.name'))
  .min(1, translate('qvain.validationMessages.actors.organization.name'))
  .max(1000, translate('qvain.validationMessages.actors.name.max'))
  .required(translate('qvain.validationMessages.actors.organization.name'))

const organizationEmailSchema = yup
  .string(translate('qvain.validationMessages.actors.email.string'))
  .max(1000, translate('qvain.validationMessages.actors.email.max'))
  .email(translate('qvain.validationMessages.actors.email.email'))
  .nullable()

const organizationNameTranslationsSchema = yup.lazy(translations => {
  // Each value in the translations must be an organization name string.
  const obj = Object.keys(translations).reduce((o, translation) => {
    o[translation] = organizationNameSchema
    return o
  }, {})
  // At least one translation is required.
  if (Object.keys(obj).length === 0) {
    obj.und = organizationNameSchema
  }
  return yup.object().shape(obj)
})

const organizationIdentifierSchema = yup
  .string()
  .max(1000, translate('qvain.validationMessages.actors.identifier.max'))
  .nullable()

const actorOrganizationSchema = yup.object().shape({
  type: yup
    .mixed()
    .oneOf(
      [ENTITY_TYPE.PERSON, ENTITY_TYPE.ORGANIZATION],
      translate('qvain.validationMessages.actors.type.oneOf')
    )
    .required(translate('qvain.validationMessages.actors.type.required')),
  organization: yup.mixed().when('type', {
    is: ENTITY_TYPE.PERSON,
    then: yup.object().required(translate('qvain.validationMessages.actors.organization.required')),
    otherwise: yup.object(translate('qvain.validationMessages.actors.organization.object')).shape({
      value: yup
        .string(translate('qvain.validationMessages.actors.organization.string'))
        .nullable(),
    }),
  }),
})

// Data catalog
const dataCatalogSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.dataCatalog.required'))
  .matches(
    /urn:nbn:fi:att:data-catalog-(?!dft)/,
    translate('qvain.validationMessages.files.dataCatalog.wrongType')
  )

// Data catalog for draft
const dataCatalogSchemaDraft = yup.string()

// CUMULATIVE STATE
const cumulativeStateSchema = yup
  .mixed()
  .oneOf([CUMULATIVE_STATE.NO, CUMULATIVE_STATE.YES, CUMULATIVE_STATE.CLOSED])

// FILE AND DIRECTORY (IDA RESOURCES) VALIDATION

const fileUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.useCategory.required'))

const fileTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.title.required'))

const fileDescriptionSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.file.description.required'))

const fileSchema = yup.object().shape({
  title: fileTitleSchema,
  description: fileDescriptionSchema,
  useCategory: fileUseCategorySchema,
  fileType: yup.string().nullable(),
})

const filesSchema = yup.array().of(fileSchema)

const directoryTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.directory.title.required'))

const directoryDescriptionSchema = yup.string()

const directoryUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.directory.useCategory.required'))

const directorySchema = yup.object().shape({
  title: directoryTitleSchema,
  description: directoryDescriptionSchema,
  useCategory: directoryUseCategorySchema,
  fileType: yup.string().nullable(),
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
    und: yup.string().required(translate('qvain.organizationSelect.validation.name')),
  }),
  email: yup.string().email(translate('qvain.organizationSelect.validation.email')),
})

const organizationObjectSchema = yup.object().shape({
  organization: organizationSelectSchema
    .nullable()
    .required(translate('qvain.organizationSelect.validation.name')),
  department: organizationSelectSchema.nullable(),
  subDepartment: organizationSelectSchema.nullable(),
})

const fundingAgencySchema = yup.object().shape({
  identifier: yup
    .string()
    .nullable()
    .required(
      translate('qvain.project.inputs.fundingAgency.contributorType.identifier.validation')
    ),
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
      then: yup.string(translate('qvain.project.inputs.title.validation.string')),
      otherwise: yup
        .string(translate('qvain.project.inputs.title.validation.string'))
        .required(translate('qvain.project.inputs.title.validation.required')),
    }),
    titleEn: yup.string(translate('qvain.project.inputs.title.validation.string')),
    identifier: yup.string(),
    fundingIdentifier: yup.string(),
    funderType: yup.object().nullable(),
  }),
  organizations: yup.array().min(1, translate('qvain.project.inputs.organization.validation')),
  fundingAgencies: yup.array().min(0),
})

// EXTERNAL RESOURCES VALIDATION

const externalResourceTitleSchema = yup
  .string()
  .required(translate('qvain.validationMessages.externalResources.title.required'))

// Use category is one of preset 7 options (all strings)
const externalResourceUseCategorySchema = yup
  .string()
  .required(translate('qvain.validationMessages.externalResources.useCategory.required'))

const externalResourceAccessUrlSchema = yup
  .string()
  .url(translate('qvain.validationMessages.externalResources.accessUrl.validFormat'))

const externalResourceDownloadUrlSchema = yup
  .string()
  .url(translate('qvain.validationMessages.externalResources.downloadUrl.validFormat'))

const externalResourceSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  accessUrl: externalResourceAccessUrlSchema,
  downloadUrl: externalResourceDownloadUrlSchema,
})

// ENTIRE ACTOR SCHEMAS

const personSchema = yup.object().shape({
  name: personNameSchema.required(translate('qvain.validationMessages.actors.name.required')),
  email: personEmailSchema,
  identifier: personIdentifierSchema,
})

const personSchemaDraft = yup.object().shape({
  name: personNameSchemaDraft,
  email: personEmailSchema,
  identifier: personIdentifierSchema,
})

const organizationSchema = yup.object().shape({
  name: organizationNameTranslationsSchema,
  identifier: organizationIdentifierSchema,
})

const actorSchema = yup.object().shape({
  type: actorType,
  roles: actorRolesSchema,
  person: yup.object().when('type', {
    is: ENTITY_TYPE.PERSON,
    then: personSchema.required(),
    otherwise: yup.object().nullable(),
  }),
  organizations: yup
    .array()
    .min(1, translate('qvain.validationMessages.actors.organization.required'))
    .of(organizationSchema)
    .required(translate('qvain.validationMessages.actors.organization.required')),
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

const actorsSchema = yup
  .array()
  .of(actorSchema)
  // Test: loop through the actor list and the roles of each actor
  // A Creator must be found in the actor list in order to allow the dataset to be posted to the database
  .test(
    'contains-creator',
    translate('qvain.validationMessages.actors.requiredActors.mandatoryActors.creator'),
    value => {
      let foundCreator = false
      for (let i = 0; i < value.length; i += 1) {
        for (let j = 0; j < value[i].roles.length; j += 1) {
          if (value[i].roles[j] === ROLE.CREATOR) {
            foundCreator = true
          }
        }
      }
      if (foundCreator) {
        return true
      }
      return false
    }
  )
  .test(
    'is-doi-and-contains-publisher',
    translate('qvain.validationMessages.actors.requiredActors.mandatoryActors.publisher'),
    value => {
      let foundPublisher = false
      for (let i = 0; i < value.length; i += 1) {
        for (let j = 0; j < value[i].roles.length; j += 1) {
          if (value[i].roles[j] === ROLE.PUBLISHER) {
            foundPublisher = true
          }
        }
      }
      if (foundPublisher) {
        return true
      }
      return false
    }
  )
  .required(translate('qvain.validationMessages.actors.requiredActors.atLeastOneActor'))

// Actors schema for draft
const actorsSchemaDraft = yup.array().of(actorSchemaDraft)

// SPATIAL VALIDATION
const spatialNameSchema = yup
  .string()
  .required('qvain.temporalAndSpatial.spatial.error.nameRequired')

const spatialAltitudeSchema = yup
  .number()
  .typeError('qvain.temporalAndSpatial.spatial.error.altitudeNan')

// TEMPORAL VALIDATION
const temporalDateSchema = yup.object().shape({
  startDate: yup.date().required('qvain.temporalAndSpatial.temporal.error.startDateMissing'),
  endDate: yup.date().required('qvain.temporalAndSpatial.temporal.error.endDateMissing'),
})

// RELATED RESOURCE
const relatedResourceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string('qvain.history.relatedResource.error.nameRequired'),
    otherwise: yup
      .string('qvain.history.relatedResource.error.nameRequired')
      .required('qvain.history.relatedResource.error.nameRequired'),
  }),
  en: yup.string('qvain.history.relatedResource.error.nameRequired'),
})

const relatedResourceTypeSchema = yup
  .object()
  .required('qvain.history.relatedResource.error.typeRequired')

// PROVENANCE
const provenanceNameSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup.string('qvain.history.provenance.error.nameRequired'),
    otherwise: yup
      .string('qvain.history.provenance.error.nameRequired')
      .required('qvain.history.provenance.error.nameRequired'),
  }),
  en: yup.string('qvain.history.provenance.error.nameRequired'),
})

const provenanceStartDateSchema = yup
  .date()
  .required('qvain.history.provenance.error.startDateMissing')

const provenanceEndDateSchema = yup.date().required('qvain.history.provenance.error.endDateMissing')

// Entire form validation for normal dataset
const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  issuedDate: yup.mixed().when('useDoi', {
    is: true,
    then: yup.date().required(translate('qvain.validationMessages.issuedDate.requiredIfUseDoi')),
    otherwise: yup.date().nullable(),
  }),
  fieldOfScience: fieldsOfScienceSchema,
  keywords: keywordsSchema,
  otherIdentifiers: otherIdentifiersArraySchema,
  accessType: accessTypeSchema,
  license: yup.mixed().when('dataCatalog', {
    is: DATA_CATALOG_IDENTIFIER.IDA,
    then: licenseArraySchema.required(translate('qvain.validationMessages.license.requiredIfIDA')),
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
  issuedDate: yup.date().nullable(),
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
  titleSchema,
  descriptionSchema,
  issuedDateSchema,
  otherIdentifierSchema,
  otherIdentifiersArraySchema,
  keywordsSchema,
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
  provenanceStartDateSchema,
  provenanceEndDateSchema,
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
