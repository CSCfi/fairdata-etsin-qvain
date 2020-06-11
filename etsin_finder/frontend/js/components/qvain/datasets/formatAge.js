import translate from 'counterpart'
import moment from 'moment'

const formatAge = (currentTime, eventTime) => {
  const timestampCurrentTime = moment(currentTime)
  const timestampEvent = moment(eventTime)

  const secondsSinceCreation = timestampCurrentTime.diff(timestampEvent, 'seconds')

  let formattedDate

  // Time intervals retrieved from Moment.js documentation
  // For instance, 45 seconds is not exactly a minute, but roughly a minute, and can be displayed as one.
  if (secondsSinceCreation < 45) {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.moments')
  } else if (secondsSinceCreation < 90) {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMinute')
  } else if (secondsSinceCreation < 3700) {
    formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'minutes')} ${translate(
      'qvain.datasets.tableRows.dateFormat.minutes'
    )}`
  } else if (secondsSinceCreation < 5400) {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneHour')
  } else if (secondsSinceCreation < 79200) {
    formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'hours')} ${translate(
      'qvain.datasets.tableRows.dateFormat.hours'
    )}`
  } else if (secondsSinceCreation < 129600) {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneDay')
  } else if (secondsSinceCreation < 2160000) {
    formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'days')} ${translate(
      'qvain.datasets.tableRows.dateFormat.days'
    )}`
  } else {
    // More than a month ago, compare by months
    const monthsSinceCreation = timestampCurrentTime.diff(timestampEvent, 'months')

    if (monthsSinceCreation >= 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMonth')
    } else if (monthsSinceCreation >= 10) {
      formattedDate = `${monthsSinceCreation} ${translate(
        'qvain.datasets.tableRows.dateFormat.months'
      )}`
    } else if (monthsSinceCreation >= 18) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneYear')
    } else {
      // Years (in plural), compare by years
      formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'years')} ${translate(
        'qvain.datasets.tableRows.dateFormat.years'
      )}`
    }
  }

  return formattedDate
}

export default formatAge
