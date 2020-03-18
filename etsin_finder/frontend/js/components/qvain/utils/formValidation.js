import * as yup from 'yup'
import translate from 'counterpart'
import { AccessTypeURLs, EntityType, Role, CumulativeStates } from './constants'

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

const keywordsSchema = yup
  .array()
  .of(
    yup
      .string(translate('qvain.validationMessages.keywords.string'))
      .max(1000, translate('qvain.validationMessages.keywords.max'))
  )
  .required(translate('qvain.validationMessages.keywords.required'))

  const fieldsOfScienceSchema = yup
  .array()
  .of(
    yup
      .string()
  )

const issuedDateSchema = yup.date().nullable()

const otherIdentifierSchema = yup
  .string(translate('qvain.validationMessages.otherIdentifiers.string'))
  .min(10, translate('qvain.validationMessages.otherIdentifiers.min'))
  .url(translate('qvain.validationMessages.otherIdentifiers.url'))
  .max(1000, translate('qvain.validationMessages.otherIdentifiers.max'))

const otherIdentifiersSchema = yup
  .array()
  .of(otherIdentifierSchema)
  .nullable()

// LICENSE AND ACCESS VALIDATION

// you have to provide the license object and the otherLicenseUrl
const licenseSchema = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup.string().required(),
  otherLicenseUrl: yup
    .mixed()
    .when('identifier', {
      is: 'other',
      then: yup
        .string(translate('qvain.validationMessages.license.otherUrl.string'))
        .url(translate('qvain.validationMessages.license.otherUrl.url'))
        .required(translate('qvain.validationMessages.license.otherUrl.required')),
      otherwise: yup
        .string()
        .url()
        .nullable(),
    })
    .nullable(),
})

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
  .oneOf([EntityType.PERSON, EntityType.ORGANIZATION], translate('qvain.validationMessages.actors.type.oneOf'))
  .required(translate('qvain.validationMessages.actors.type.required'))

const actorRolesSchema = yup
  .array()
  .of(
    yup
      .mixed()
      .oneOf(
        [Role.CREATOR, Role.CURATOR, Role.PUBLISHER, Role.RIGHTS_HOLDER, Role.CONTRIBUTOR],
        translate('qvain.validationMessages.actors.roles.oneOf')
      )
  )
  .required(translate('qvain.validationMessages.actors.roles.required'))

const actorNameSchema = yup
  .string(translate('qvain.validationMessages.actors.name.string'))
  .max(1000, translate('qvain.validationMessages.actors.name.max'))
  .required(translate('qvain.validationMessages.actors.name.required'))

const actorEmailSchema = yup
  .string(translate('qvain.validationMessages.actors.email.string'))
  .max(1000, translate('qvain.validationMessages.actors.email.max'))
  .email(translate('qvain.validationMessages.actors.email.email'))
  .nullable()

const actorIdentifierSchema = yup
  .string()
  .max(1000, translate('qvain.validationMessages.actors.identifier.max'))
  .nullable()

const actorOrganizationSchema = yup.object().shape({
  type: yup
    .mixed()
    .oneOf(
      [EntityType.PERSON, EntityType.ORGANIZATION],
      translate('qvain.validationMessages.actors.type.oneOf')
    )
    .required(translate('qvain.validationMessages.actors.type.required')),
  organization: yup.mixed().when('type', {
    is: EntityType.PERSON,
    then: yup
      .object()
      .required(translate('qvain.validationMessages.actors.organization.required')),
    otherwise: yup
      .object(translate('qvain.validationMessages.actors.organization.object'))
      .shape({
        value: yup
          .string(translate('qvain.validationMessages.actors.organization.string'))
          .nullable(),
      }),
  }),
})

// DATA CATALOG
const dataCatalogSchema = yup
  .string()
  .required(translate('qvain.validationMessages.files.dataCatalog.required'))

// CUMULATIVE STATE
const cumulativeStateSchema = yup
  .mixed()
  .oneOf([CumulativeStates.NO, CumulativeStates.YES, CumulativeStates.CLOSED])

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

// PAS METADATA VALIDATION

export const fileMetadataSchema = yup.object().shape({
  fileFormat: yup.string().required(),
  formatVersion: yup.string(),
  encoding: yup.string().required(),
  csvHasHeader: yup.boolean().required(),
  csvDelimiter: yup.string().required(),
  csvRecordSeparator: yup.string().required(),
  csvQuotingChar: yup.string().required()
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

const actorSchema = yup.object().shape({
  type: actorType,
  role: actorRolesSchema,
  name: actorNameSchema,
  email: actorEmailSchema,
  identifier: actorIdentifierSchema,
  organization: yup.mixed().when('type', {
    is: EntityType.PERSON,
    then: yup
      .object()
      .required(translate('qvain.validationMessages.actors.organization.required')),
    otherwise: yup
      .object()
      .nullable(),
  }),
})

const actorsSchema = yup
  .array()
  .of(
    yup.object().shape({
      type: actorType,
      role: actorRolesSchema,
      name: actorNameSchema,
      email: actorEmailSchema,
      identifier: actorIdentifierSchema,
      organization: yup.mixed().when('type', {
        is: EntityType.PERSON,
        then: yup
          .object()
          .required(translate('qvain.validationMessages.actors.organization.required')),
        otherwise: yup
          .object()
          .nullable(),
      }),
    })
  )
  // Test: loop through the actor list and the roles of each actor
  // A Creator must be found in the actor list in order to allow the dataset to be posted to the database
  .test(
    'contains-creator',
    translate('qvain.validationMessages.actors.requiredActors.mandatoryActors'),
    (value) => {
      let foundCreator = false;
        for (let i = 0; i < value.length; i += 1) {
          for (let j = 0; j < value[i].role.length; j += 1) {
          if (value[i].role[j] === Role.CREATOR) {
            foundCreator = true;
          }
        }
      }
      if (foundCreator) {
        return true;
      }
      return false;
    })
  .required(translate('qvain.validationMessages.actors.requiredActors.atLeastOneActor'))

// ENTIRE FORM VALIDATION

const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  fieldOfScience: fieldsOfScienceSchema,
  keywords: keywordsSchema,
  otherIdentifiers: otherIdentifiersSchema,
  accessType: accessTypeSchema,
  license: yup
    .mixed()
    .when('dataCatalog', {
      is: 'urn:nbn:fi:att:data-catalog-ida',
      then: yup.object().shape({
        name: yup.object().nullable(),
        identifier: yup.string()
        }).required(translate('qvain.validationMessages.license.requiredIfIDA')),
      otherwise: yup.object().shape({
        name: yup.object().nullable(),
        identifier: yup.string()
        }),
    }),
  otherLicenseUrl: yup
    .mixed()
    .when('license.identifier', {
      is: 'other',
      then: yup
        .string(translate('qvain.validationMessages.license.otherUrl.string'))
        .url(translate('qvain.validationMessages.license.otherUrl.url'))
        .required(translate('qvain.validationMessages.license.otherUrl.required')),
      otherwise: yup
        .string()
        .url()
        .nullable(),
    })
    .nullable(),
  restrictionGrounds: yup.mixed().when('accessType.url', {
    is: url => url !== AccessTypeURLs.OPEN,
    then: restrictionGroundsSchema,
  }),
  actors: actorsSchema,
  dataCatalog: dataCatalogSchema,
  cumulativeState: cumulativeStateSchema,
  files: filesSchema,
  directories: directoriesSchema,
})

export {
  qvainFormSchema,
  titleSchema,
  descriptionSchema,
  issuedDateSchema,
  otherIdentifierSchema,
  otherIdentifiersSchema,
  keywordsSchema,
  accessTypeSchema,
  licenseSchema,
  embargoExpDateSchema,
  restrictionGroundsSchema,
  actorsSchema,
  actorSchema,
  actorType,
  actorNameSchema,
  actorRolesSchema,
  actorEmailSchema,
  actorIdentifierSchema,
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
  externalResourceSchema,
  externalResourceTitleSchema,
  externalResourceAccessUrlSchema,
  externalResourceDownloadUrlSchema,
}
