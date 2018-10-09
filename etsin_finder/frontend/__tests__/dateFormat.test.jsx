import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import dateFormat from '../js/utils/dateFormat'

describe('check date', () => {
  it('should return only year', () => {
    const dateformat = dateFormat('2017')
    expect(dateformat).toEqual(2017)
  })
  it('should change into human-readable datetime', () => {
    const dateformat = dateFormat(1516007145830)
    expect(dateformat).toEqual('January 15, 2018, 11:05 AM')
  })
  it('should return Finnish time with -00:00 timezone-part', () => {
    const dateformat = dateFormat('2000-01-01T00:00:00-00:00')
    expect(dateformat).toEqual('January 1, 2000, 2:00 AM')
  })
})
