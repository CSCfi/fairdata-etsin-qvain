import * as yup from 'yup'
import ReferenceField from './qvain.referenceField'
import { LICENSE_URL } from '../../../utils/constants'
import { touch } from './track'

const referenceLicenseScheme = 'http://uri.suomi.fi/codelist/fairdata/license/'

const licenseUrlSchema = yup
  .string()
  .typeError('qvain.validationMessages.license.otherUrl.string')
  .url('qvain.validationMessages.license.otherUrl.url')

export const licenseQvainSchema = yup
  .object()
  .shape({
    name: yup.object().nullable(),
    identifier: yup.string(),
    otherLicenseUrl: yup.string().when('identifier', {
      is: prop => !prop,
      then: licenseUrlSchema
        .nullable()
        .required('qvain.validationMessages.license.otherUrl.required'),
    }),
  })
  .noUnknown()

const licenseMetaxSchema = yup
  .object()
  .shape({
    identifier: licenseUrlSchema,
    license: yup.string().when('identifier', {
      is: prop => !prop,
      then: licenseUrlSchema.required('qvain.validationMessages.license.otherUrl.required'),
    }),
  })
  .noUnknown()

export const licenseArrayMetaxSchema = yup.array().of(licenseMetaxSchema).nullable()

export const Model = (name, identifier) => ({
  name,
  identifier,
})

export const CustomLicenseModel = (name, otherLicenseUrl) => ({
  name,
  otherLicenseUrl,
})

class Licenses extends ReferenceField {
  constructor(Parent) {
    super(Parent, () => [Model(undefined, LICENSE_URL.CCBY4)])
  }

  schema = licenseQvainSchema

  fromBackend = dataset => {
    const l = dataset.access_rights?.license ? dataset.access_rights.license : undefined
    if (l !== undefined) {
      this.item = undefined
      this.storage = l.map(license => {
        if (license.identifier !== undefined) {
          if (license.identifier.startsWith(referenceLicenseScheme)) {
            touch(license) // license is from reference data, don't warn about unsupported fields or translations
          }
          return this.Model(license.title, license.identifier)
        }
        const name = {
          en: `Other (URL): ${license.license}`,
          fi: `Muu (URL): ${license.license}`,
        }
        return this.CustomLicenseModel(name, license.license)
      })
    } else {
      this.item = undefined
      this.storage = []
    }
  }

  toBackend = () =>
    this.storage.map(lic =>
      lic.otherLicenseUrl ? { license: lic.otherLicenseUrl } : { identifier: lic.identifier }
    )

  Model = Model

  CustomLicenseModel = CustomLicenseModel
}

export default Licenses
