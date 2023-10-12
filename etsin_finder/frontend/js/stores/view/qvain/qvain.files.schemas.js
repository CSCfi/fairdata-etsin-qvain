import * as yup from 'yup'

export const fileMetadataSchema = yup.object().shape({
  fileFormat: yup.string().required(),
  formatVersion: yup.string(),
  encoding: yup.string().required(),
  csvHasHeader: yup.boolean().required(),
  csvDelimiter: yup.string().required(),
  csvRecordSeparator: yup.string().required(),
  csvQuotingChar: yup.string().required(),
})

// FILE AND DIRECTORY (IDA RESOURCES) VALIDATION

export const fileUseCategorySchema = yup
  .object()
  .required('qvain.validationMessages.files.file.useCategory.required')

export const fileTitleSchema = yup
  .string()
  .required('qvain.validationMessages.files.file.title.required')

export const fileDescriptionSchema = yup.string()

export const fileSchema = yup.object().shape({
  title: fileTitleSchema,
  description: fileDescriptionSchema,
  useCategory: fileUseCategorySchema,
  fileType: yup.object().nullable(),
})

export const filesSchema = yup.array().of(fileSchema)

export const directoryTitleSchema = yup
  .string()
  .required('qvain.validationMessages.files.directory.title.required')

export const directoryDescriptionSchema = yup.string()

export const directoryUseCategorySchema = yup
  .object()
  .required('qvain.validationMessages.files.directory.useCategory.required')

export const directorySchema = yup.object().shape({
  title: directoryTitleSchema,
  description: directoryDescriptionSchema,
  useCategory: directoryUseCategorySchema,
  fileType: yup.object().nullable(),
})

export const directoriesSchema = yup.array().of(directorySchema)
