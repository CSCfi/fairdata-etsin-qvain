/* eslint-disable no-unused-expressions */
import * as yup from 'yup';
import translate from 'counterpart';


const titleSchema = yup.object().shape({
  fi: yup
    .mixed()
    .when('en', {
      is: (val) => val.length > 0,
      then:
        yup
          .string(translate('qvain.validationMessages.title.string'))
          .max(100, translate('qvain.validationMessages.title.max')),
      otherwise:
        yup
          .string(translate('qvain.validationMessages.title.string'))
          .max(100, translate('qvain.validationMessages.title.max'))
          .required(translate('qvain.validationMessages.title.required'))
    }),
  en: yup
    .string(translate('qvain.validationMessages.title.string'))
    .max(100, translate('qvain.validationMessages.title.max'))
})

const descriptionSchema = yup.object().shape({
  fi: yup
    .mixed()
    .when('en', {
      is: (val) => val.length > 0,
      then:
        yup
          .string(translate('qvain.validationMessages.description.string'))
          .max(100, translate('qvain.validationMessages.description.max')),
      otherwise:
        yup
        .string(translate('qvain.validationMessages.description.string'))
        .max(100, translate('qvain.validationMessages.description.max'))
        .required(translate('qvain.validationMessages.description.required'))
    }),
  en: yup
    .string(translate('qvain.validationMessages.description.string'))
    .max(100, translate('qvain.validationMessages.description.max'))
})

const keywordsSchema = yup
  .array().of(
    yup
      .string(translate('qvain.validationMessages.keywords.string'))
      .max(100, translate('qvain.validationMessages.keywords.max'))
  )
  .required(translate('qvain.validationMessages.keywords.required'))

const otherIdentifiersSchema = yup
  .array().of(
    yup
      .string(translate('qvain.validationMessages.otherIdentifiers.string'))
      .url(translate('qvain.validationMessages.otherIdentifiers.url'))
      .max(100, translate('qvain.validationMessages.otherIdentifiers.max'))
  )
  .nullable()

// you have to provide both the license object and the otherLicenseUrl as an object
const licenseSchema = yup.object().shape({
  idaPickerOpen: yup.boolean(),
  license: yup.object().shape({
    name: yup.object().nullable(),
    url: yup.mixed().when('idaPickerOpen', {
      is: true,
      then: yup.string().required(),
      otherwise: yup.string()
    })
  }).nullable(),
  otherLicenseUrl: yup.mixed().when('license.url', {
    is: 'other',
    then: yup
      .string(translate('qvain.validationMessages.license.otherUrl.string'))
      .url(translate('qvain.validationMessages.license.otherUrl.url'))
      .required(translate('qvain.validationMessages.license.otherUrl.required')),
    otherwise: yup.string().url().nullable()
  }).nullable()
})

const accessTypeSchema = yup.object().shape({
  name: yup.string(),
  url: yup
    .string(translate('qvain.validationMessages.accessType.string'))
    .url(translate('qvain.validationMessages.accessType.url'))
    .required(translate('qvain.validationMessages.accessType.required'))
})

const embargoExpDateSchema = yup.date().nullable()

const restrictionGroundsSchema = yup
  .string(translate('qvain.validationMessages.restrictionGrounds.string'))
  .url(translate('qvain.validationMessages.restrictionGrounds.url'))
  .required(translate('qvain.validationMessages.restrictionGrounds.required'))

const participantType = yup
  .mixed()
  .oneOf(['person', 'organization'], translate('qvain.validationMessages.participants.type.oneOf'))
  .required(translate('qvain.validationMessages.participants.type.required'))

const participantRolesSchema = yup
  .array().of(
    yup
      .mixed()
      .oneOf(['creator', 'curator', 'publisher'], translate('qvain.validationMessages.participants.roles.oneOf')),
  )
  .required(translate('qvain.validationMessages.participants.roles.required'))

const participantNameSchema = yup
  .string(translate('qvain.validationMessages.participants.name.string'))
  .max(100, translate('qvain.validationMessages.participants.name.max'))
  .required(translate('qvain.validationMessages.participants.name.required'))

const participantEmailSchema = yup
  .string(translate('qvain.validationMessages.participants.email.string'))
  .max(100, translate('qvain.validationMessages.participants.email.max'))
  .email(translate('qvain.validationMessages.participants.email.email'))
  .nullable()

const participantIdentifierSchema = yup
  .string()
  .max(100, translate('qvain.validationMessages.participants.identifier.max'))
  .nullable()

const participantOrganizationSchema = yup.object().shape({
  type: yup
    .mixed()
    .oneOf(['person', 'organization'], translate('qvain.validationMessages.participants.type.oneOf'))
    .required(translate('qvain.validationMessages.participants.type.required')),
  organization: yup
    .mixed()
    .when('type', {
      is: 'person',
      then:
        yup.object(translate('qvain.validationMessages.participants.organization.object')).shape({
          value: yup
            .string(translate('qvain.validationMessages.participants.organization.string'))
        })
        .required(translate('qvain.validationMessages.participants.organization.required')),
      otherwise:
        yup.object(translate('qvain.validationMessages.participants.organization.object')).shape({
          value: yup
            .string(translate('qvain.validationMessages.participants.organization.string'))
            .nullable()
        })
      })
})

const externalResourceUrlSchema = yup
  .string()
  .url(translate('qvain.validationMessages.externalResources.url.url'))
  .required(translate('qvain.validationMessages.externalResources.url.required'))

const externalResourceSchema = yup.object().shape({
  id: yup.number().nullable(),
  title: yup.string().nullable(),
  url: externalResourceUrlSchema
})

const participantSchema = yup
  .object().shape({
    type: participantType,
    role: participantRolesSchema,
    name: participantNameSchema,
    email: participantEmailSchema,
    identifier: participantIdentifierSchema,
    organization: yup
      .mixed()
      .when('type', {
        is: 'person',
        then:
          yup
            .string(translate('qvain.validationMessages.participants.organization.string'))
            .required(translate('qvain.validationMessages.participants.organization.required')),
        otherwise:
          yup
            .string(translate('qvain.validationMessages.participants.organization.string'))
            .nullable()
        })
  })

const participantsSchema = yup
  .array().of(
    yup
      .object().shape({
        type: participantType,
        role: participantRolesSchema,
        name: participantNameSchema,
        email: participantEmailSchema,
        identifier: participantIdentifierSchema,
        organization: yup
          .mixed()
          .when('type', {
            is: 'person',
            then:
              yup
                .string(translate('qvain.validationMessages.participants.organization.string'))
                .required(translate('qvain.validationMessages.participants.organization.required')),
            otherwise:
              yup
                .string(translate('qvain.validationMessages.participants.organization.string'))
                .nullable()
            })
          })
  )
  .required()

const qvainFormSchema = yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  fieldOfScience: yup
    .string(),
  keywords: keywordsSchema,
  otherIdentifiers: otherIdentifiersSchema,
  accessType: accessTypeSchema,
  license: licenseSchema,
  restrictionGrounds: yup
    .mixed()
    .when('accessType.value', {
      is: 'Open',
      then: restrictionGroundsSchema
    }),
  participants: participantsSchema
});

export {
  qvainFormSchema,
  titleSchema,
  descriptionSchema,
  otherIdentifiersSchema,
  keywordsSchema,
  accessTypeSchema,
  licenseSchema,
  embargoExpDateSchema,
  restrictionGroundsSchema,
  participantsSchema,
  participantSchema,
  participantType,
  participantNameSchema,
  participantRolesSchema,
  participantEmailSchema,
  participantIdentifierSchema,
  participantOrganizationSchema,
  externalResourceSchema,
  externalResourceUrlSchema
};
