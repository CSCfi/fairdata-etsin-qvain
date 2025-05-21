import {
  getCurrentOption,
  onChange,
  onChangeMulti,
  getGroupLabel,
  getOptionLabel,
  getOptionValue,
  sortGroups,
} from '../../js/components/qvain/utils/select'
import { expect } from 'chai'

jest.mock('axios')

const model = (label, uri) => ({
  label,
  uri,
})

describe('when calling getCurrentOption with getter as object', () => {
  let returnValue

  const model = (labeli, uri) => ({
    labeli,
    uri,
  })

  const getter = {
    label: 'selected',
    uri: 'uri',
  }

  const expectedItem = { labeli: 'selected', uri: 'uri', extraInfo: 'should be included' }

  const options = [
    {
      label: 'not selected',
      uri: 'joku random',
    },
    expectedItem,
  ]

  beforeEach(() => {
    returnValue = getCurrentOption(model, options, getter)
  })

  test('should return option with extraInfo', () => {
    returnValue.should.equal(expectedItem)
  })
})

describe('when calling getCurrentOption with getter as object that has same labelKey than model', () => {
  let returnValue
  const model = (label, uri) => ({
    label,
    uri,
  })

  const getter = {
    label: 'selected',
    uri: 'uri',
  }

  const expectedItem = getter

  const options = [
    {
      label: 'not selected',
      uri: 'joku random',
    },
    { ...expectedItem, extraInfo: 'some extra stuff' },
  ]

  beforeEach(() => {
    returnValue = getCurrentOption(model, options, getter)
  })

  test('should return getter', () => {
    returnValue.should.equal(expectedItem)
  })
})

describe('when calling getCurrentOption with getter as object that cannot be found in options', () => {
  let returnValue
  const model = (labeli, uri) => ({
    labeli,
    uri,
  })

  const getter = {
    label: 'selected',
    uri: 'uri is very different',
  }

  const expectedItem = getter

  const options = [
    {
      label: 'not selected',
      uri: 'joku random',
    },
    { ...expectedItem, uri: 'uri', extraInfo: 'some extra stuff' },
  ]

  beforeEach(() => {
    returnValue = getCurrentOption(model, options, getter)
  })

  test('should return getter', () => {
    returnValue.should.equal(expectedItem)
  })
})

describe("when calling getCurrentOption with getter as object that doesn't have model's uriKey", () => {
  let returnValue
  const model = (labeli, uri) => ({
    labeli,
    uri,
  })

  const getter = {
    label: 'selected',
    url: 'almost correct key but still different',
  }

  const expectedItem = getter

  const options = [
    {
      label: 'not selected',
      uri: 'joku random',
    },
    { uri: 'uri', extraInfo: 'some extra stuff' },
  ]

  beforeEach(() => {
    returnValue = getCurrentOption(model, options, getter)
  })

  test('should return getter', () => {
    returnValue.should.equal(expectedItem)
  })
})

describe('when calling getCurrentOption with getter as Array', () => {
  let returnValue
  const model = (labeli, uri) => ({
    labeli,
    uri,
  })

  const getter = [
    {
      label: 'selected',
      uri: 'uri',
    },
  ]

  const expectedItem = { uri: 'uri', labeli: 'selected', extraInfo: 'should be included' }

  const options = [
    {
      label: 'not selected',
      uri: 'joku random',
    },
    expectedItem,
  ]

  beforeEach(() => {
    returnValue = getCurrentOption(model, options, getter)
  })

  test('should return option with extraInfo', () => {
    returnValue.should.eql([expectedItem])
  })
})

describe('when calling onChange with callback and selection', () => {
  const callback = jest.fn(s => s)
  const selection = 'selection'

  beforeEach(() => {
    onChange(callback)(selection)
  })

  test('should call callback with selection', () => {
    expect(callback).to.have.beenCalledWith(selection)
  })
})

describe('when calling onChange with callback but without selection', () => {
  const callback = jest.fn(s => s)
  const selection = null

  beforeEach(() => {
    onChange(callback)(selection)
  })

  test('should call callback without args', () => {
    expect(callback).to.have.beenCalledWith(undefined)
  })
})

describe('when calling onChangeMulti with callback but without selection', () => {
  const callback = jest.fn(s => s)
  const selection = null

  beforeEach(() => {
    onChangeMulti(callback)(selection)
  })

  test('should call callback with empty Array', () => {
    expect(callback).to.have.beenCalledWith([])
  })
})

describe('when calling onChangeMulti with callback but with selection', () => {
  const callback = jest.fn(s => s)
  const selection = 'this probably should be Array but no-one checks that'

  beforeEach(() => {
    onChangeMulti(callback)(selection)
  })

  test('should call callback with empty Array', () => {
    expect(callback).to.have.beenCalledWith(selection)
  })
})

describe('when calling getGroupLabel only with lang', () => {
  let returnValue

  beforeEach(() => {
    returnValue = getGroupLabel(model, 'en')()
  })

  test('should return undefined', () => {
    expect(returnValue).to.be.undefined
  })
})

describe('when calling getGroupLabel with group lang', () => {
  let returnValue
  const group = {
    label: {
      en: 'label',
    },
  }

  beforeEach(() => {
    returnValue = getGroupLabel(model, 'en')(group)
  })

  test('should return label corresponding to lang', () => {
    expect(returnValue).to.eql(group.label.en)
  })
})

describe('when getOptionLabel is called with model, lang. following function called without args', () => {
  let returnValue

  const lang = 'en'

  beforeEach(() => {
    returnValue = getOptionLabel(model, lang)()
  })

  test('should return undefined', () => {
    expect(returnValue).to.be.undefined
  })
})

describe('when getOptionLabel is called with model, lang. following function called with object that has label key', () => {
  let returnValue

  const lang = 'en'
  const opt = {
    label: { en: 'en_label' },
  }

  beforeEach(() => {
    returnValue = getOptionLabel(model, lang)(opt)
  })

  test('should return opt.label.en', () => {
    returnValue.should.eql(opt.label.en)
  })
})

describe('when getOptionLabel is called with model, lang. following function called with object that has url key', () => {
  let returnValue

  const lang = 'en'
  const opt = {
    uri: 'uri',
  }

  beforeEach(() => {
    returnValue = getOptionLabel(model, lang)(opt)
  })

  test('should return opt.url', () => {
    returnValue.should.eql(opt.uri)
  })
})

describe('when calling getOptionValue with model. Calling following function with opt that has url key', () => {
  let returnValue

  const opt = {
    uri: 'uri',
  }

  beforeEach(() => {
    returnValue = getOptionValue(model)(opt)
  })

  test('should return opt.url', () => {
    returnValue.should.eql(opt.uri)
  })
})

describe('when calling sortGroups with sortFunc', () => {
  const lang = 'fi'
  const sortFunc = (a, b) => b === 'b' //b should be first

  const groups = [
    {
      options: ['b', 'a'],
    },
  ]

  beforeEach(async () => {
    await sortGroups(model, lang, groups, sortFunc)
  })

  test('should call options.sort with sortFunc', () => {
    groups[0].options.should.eql(['b', 'a'])
  })
})

describe('when calling sortGroups without sortFunc', () => {
  const lang = 'fi'

  const groups = [
    {
      label: 'bb',
      options: [{ label: { fi: 'b' } }, { label: { fi: 'a' } }],
    },
    {
      label: 'aa',
      options: [{ label: { fi: 'a' } }, { label: { fi: 'b' } }],
    },
  ]

  beforeEach(async () => {
    await sortGroups(model, lang, groups)
  })

  test('should call options.sort with sortFunc', () => {
    groups.should.eql([
      {
        label: 'bb',
        options: [{ label: { fi: 'a' } }, { label: { fi: 'b' } }],
      },
      {
        label: 'aa',
        options: [{ label: { fi: 'a' } }, { label: { fi: 'b' } }],
      },
    ])
  })
})
