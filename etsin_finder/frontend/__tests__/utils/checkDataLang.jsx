import checkDataLang from '../../js/utils/checkDataLang'

describe('CheckDataLang function', () => {
  const researchDataset = { publisher: { name: { en: 'English', fi: 'Finnish' } } }
  let lang
  it('should return finnish for lang fi', () => {
    lang = 'fi'
    const checked = checkDataLang(researchDataset.publisher.name, lang)
    expect(checked).toEqual('Finnish')
  })
  it('should return english for lang en', () => {
    lang = 'en'
    const checked = checkDataLang(researchDataset.publisher.name, lang)
    expect(checked).toEqual('English')
  })
})
