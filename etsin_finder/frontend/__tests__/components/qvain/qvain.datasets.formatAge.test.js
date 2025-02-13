import moment from 'moment'
import formatAge from '../../../js/components/qvain/views/datasetsV2/formatAge'
import LocaleClass from '@/stores/view/locale'

const Locale = new LocaleClass()

const now = moment('2021-06-09')
test.each([
  [30, 'second', 'A few moments ago'],
  [1, 'minute', '1 minute ago'],
  [30, 'minute', '30 minutes ago'],
  [1, 'hour', '1 hour ago'],
  [10, 'hour', '10 hours ago'],
  [1, 'day', '1 day ago'],
  [2, 'day', '2 days ago'],
  [1, 'month', '1 month ago'],
  [2, 'month', '2 months ago'],
  [1, 'year', '1 year ago'],
  [2, 'year', '2 years ago'],
  [-1, 'second', 'A few moments ago'], // treat datasets dated in the future as being just created
  [-1, 'hour', 'A few moments ago'],
  [-1, 'day', 'A few moments ago'],
  [-1, 'month', 'A few moments ago'],
  [-1, 'year', 'A few moments ago'],
])('given %d %s difference, should return "%s"', (elapsed, unit, expected) => {
  const then = now.clone().subtract(elapsed, unit)
  formatAge(Locale, now, then).should.eql(expected)
})
