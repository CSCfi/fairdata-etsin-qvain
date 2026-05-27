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
  .object()
  .shape({
    fi: yup
      .string()
      .typeError('qvain.validationMessages.title.string')
      .max(500, 'qvain.validationMessages.title.max'),
    en: yup
      .string()
      .typeError('qvain.validationMessages.title.string')
      .max(500, 'qvain.validationMessages.title.max'),
  })
  .requireTranslation('qvain.validationMessages.externalResources.title.required')
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
  })
  .nullable()

export const externalResourceDataServiceSchema = yup
  .object()
  .shape({
    url: yup.string().required(),
  })
  .typeError('qvain.validationMessages.externalResources.dataService.required')
  .required('qvain.validationMessages.externalResources.dataService.required')
  .nullable()

const isValidHttpUrl = value => {
  if (!/^https?:\/\//i.test(value)) {
    return false
  }
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const filePathPattern =
  /^(file:\/\/|~\/|\.{1,2}[\\/]|[A-Za-z]:[\\/]|\\\\|\/|[^\\/?%*:|"<>]+[\\/]).+/

export const isValidFilePath = value => filePathPattern.test(value)

const urlSchema = message =>
  yup
    .string()
    .test('http-url', message, value => !value || isValidHttpUrl(value))

export const externalResourceAccessUrlSchema = yup
  .string()
  .test(
    'http-or-file-path',
    'qvain.validationMessages.externalResources.accessUrl.validFormat',
    value => !value || isValidHttpUrl(value) || isValidFilePath(value)
  )

export const externalResourceDownloadUrlSchema = yup
  .string()
  .test(
    'http-or-file-path',
    'qvain.validationMessages.externalResources.downloadUrl.validFormat',
    value => !value || isValidHttpUrl(value) || isValidFilePath(value)
  )

export const externalResourceAccessUrlStrictSchema = urlSchema(
  'qvain.validationMessages.externalResources.accessUrl.validFormat'
)

export const externalResourceDownloadUrlStrictSchema = urlSchema(
  'qvain.validationMessages.externalResources.downloadUrl.validFormat'
)

export const externalResourceSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  accessUrl: externalResourceAccessUrlStrictSchema,
  downloadUrl: externalResourceDownloadUrlStrictSchema,
  fileType: externalResourceFileTypeSchema,
})

export const externalResourceDaasSchema = yup.object().shape({
  title: externalResourceTitleSchema,
  useCategory: externalResourceUseCategorySchema,
  accessUrl: externalResourceAccessUrlSchema,
  downloadUrl: externalResourceDownloadUrlSchema,
  fileType: externalResourceFileTypeSchema,
  dataService: externalResourceDataServiceSchema,
})
