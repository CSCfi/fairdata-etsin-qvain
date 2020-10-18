import translate from 'counterpart'
import moment from 'moment'

const formatAge = (currentTime, eventTime) => {
  const timestampCurrentTime = moment(currentTime)
  const timestampEvent = moment(eventTime)

  const secondsSinceCreation = timestampCurrentTime.diff(timestampEvent, 'seconds')
  const monthsSinceCreation = timestampCurrentTime.diff(timestampEvent, 'months')

  let formattedDate
  const duration = moment.duration(secondsSinceCreation, 'seconds')
  const t = duration._data

  // Years (in plural), compare by years
  if (t.years !== 0) {
    if (t.years === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneYear')
    } else {
      formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'years')} ${translate(
        'qvain.datasets.tableRows.dateFormat.years'
      )}`
    }
  } else if (t.months !== 0) {
    if (t.months === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMonth')
    } else {
      formattedDate = `${monthsSinceCreation} ${translate(
        'qvain.datasets.tableRows.dateFormat.months'
      )}`
    }
  } else if (t.days !== 0) {
    if (t.days === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneDay')
    } else {
      formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'days')} ${translate(
        'qvain.datasets.tableRows.dateFormat.days'
      )}`
    }
  } else if (t.hours !== 0) {
    if (t.hours === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneHour')
    } else {
      formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'hours')} ${translate(
        'qvain.datasets.tableRows.dateFormat.hours'
      )}`
    }
  } else if (t.minutes !== 0) {
    if (t.minutes === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMinute')
    } else {
      formattedDate = `${timestampCurrentTime.diff(timestampEvent, 'minutes')} ${translate(
        'qvain.datasets.tableRows.dateFormat.minutes'
      )}`
    }
  } else {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.moments')
  }

  return formattedDate
}

export default formatAge
