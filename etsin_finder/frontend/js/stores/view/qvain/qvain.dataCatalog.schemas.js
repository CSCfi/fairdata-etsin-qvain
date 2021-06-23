import yup from '../../../utils/extendedYup'
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

// Use category is one of preset 7 options (all strings)
export const externalResourceUseCategorySchema = yup.lazy(value => {
  switch (typeof value) {
    case 'object':
      return yup.object().shape({
        value: yup
          .string()
          .required('qvain.validationMessages.externalResources.useCategory.required'),
      })
    default:
      return yup
        .string()
        .required('qvain.validationMessages.externalResources.useCategory.required')
  }
})

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
})
