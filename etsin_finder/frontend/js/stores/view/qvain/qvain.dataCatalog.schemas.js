import * as yup from 'yup'
import { CUMULATIVE_STATE } from '../../../utils/constants'

// CUMULATIVE STATE
export const cumulativeStateSchema = yup
  .mixed()
  .oneOf([CUMULATIVE_STATE.NO, CUMULATIVE_STATE.YES, CUMULATIVE_STATE.CLOSED])

// USE DOI SCHEMA (IDA)
export const useDoiSchema = yup.boolean()

// Data catalog
export const dataCatalogSchema = yup
  .string()
  .required('qvain.validationMessages.files.dataCatalog.required')
  .matches(
    /urn:nbn:fi:att:data-catalog-(?!dft)/,
    'qvain.validationMessages.files.dataCatalog.wrongType'
  )

// Data catalog for draft
export const dataCatalogDraftSchema = yup.string()

// EXTERNAL RESOURCES VALIDATION

export const externalResourceTitleSchema = yup
  .string()
  .required('qvain.validationMessages.externalResources.title.required')

// Use category is one of preset 7 options
export const externalResourceUseCategorySchema = yup
  .object()
  .shape({
    url: yup.string().required('qvain.validationMessages.externalResources.useCategory.required'),
  })
  .typeError('qvain.validationMessages.externalResources.useCategory.required')
  .required('qvain.validationMessages.externalResources.useCategory.required')

export const externalResourceFileTypeSchema = yup
  .object()
  .shape({
    url: yup.string(),
  }).nullable()

export const externalResourceAccessUrlSchema = yup
  .string()
  .url('qvain.validationMessages.externalResources.accessUrl.validFormat')

export const externalResourceDownloadUrlSchema = yup
  .string()
  .url('qvain.validationMessages.externalResources.downloadUrl.validFormat')

export const externalResourceSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  accessUrl: externalResourceAccessUrlSchema,
  downloadUrl: externalResourceDownloadUrlSchema,
  fileType: externalResourceFileTypeSchema,
})
