import actorFunc from '../../js/components/qvain/utils/actor'

describe('Utils: actor', () => {
  let returnValue, actor

  describe('when calling with actor that has other than array as label', () => {
    beforeEach(() => {
      actor = {
        label: 'label',
      }

      returnValue = actorFunc(actor, undefined)
    })

    test('should return actor.label', () => {
      const expectedReturn = actor.label
      returnValue.should.eql(expectedReturn)
    })
  })

  describe('when calling with actor that has array as label and language', () => {
    beforeEach(() => {
      const actor = {
        label: [{ en: 'general store', und: 'lähikauppa' }, { und: 'Tuusulanniemi' }],
      }
      const language = 'en'

      returnValue = actorFunc(actor, language)
    })

    test('should return parsed label based on language', () => {
      const expectedReturn = 'general store, Tuusulanniemi'

      returnValue.should.eql(expectedReturn)
    })
  })
})
