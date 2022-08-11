import { makeObservable, action } from 'mobx'
import * as yup from 'yup'
import MultiLanguageField from './qvain.multiLanguageField'

export const titleSchema = yup
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
  .requireTranslation('qvain.validationMessages.title.required')
  .required('qvain.validationMessages.title.required')

class Title extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, titleSchema)
    makeObservable(this)
  }

  schema = titleSchema

  @action fromBackend = dataset => {
    this.value = {
      en: dataset.title?.en || '',
      fi: dataset.title?.fi || '',
      sv: dataset.title?.sv || '',
    }
  }
}

export default Title
