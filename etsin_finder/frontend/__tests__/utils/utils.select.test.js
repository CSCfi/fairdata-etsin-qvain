import 'chai/register-expect'
import { getCurrentOption, onChange, onChangeMulti } from '../../js/components/qvain/utils/select'

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
