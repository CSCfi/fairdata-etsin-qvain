import moment from 'moment'

const formatAge = (Locale, currentTime, eventTime) => {
  const { translate } = Locale
  const timestampCurrentTime = moment(currentTime)
  const timestampEvent = moment(eventTime)

  let formattedDate

  const t = {
    years: timestampCurrentTime.diff(timestampEvent, 'years'),
    months: timestampCurrentTime.diff(timestampEvent, 'months'),
    days: timestampCurrentTime.diff(timestampEvent, 'days'),
    hours: timestampCurrentTime.diff(timestampEvent, 'hours'),
    minutes: timestampCurrentTime.diff(timestampEvent, 'minutes'),
  }

  // Years (in plural), compare by years
  if (t.years > 0) {
    if (t.years === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneYear')
    } else {
      formattedDate = `${t.years} ${translate('qvain.datasets.tableRows.dateFormat.years')}`
    }
  } else if (t.months > 0) {
    if (t.months === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMonth')
    } else {
      formattedDate = `${t.months} ${translate('qvain.datasets.tableRows.dateFormat.months')}`
    }
  } else if (t.days > 0) {
    if (t.days === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneDay')
    } else {
      formattedDate = `${t.days} ${translate('qvain.datasets.tableRows.dateFormat.days')}`
    }
  } else if (t.hours > 0) {
    if (t.hours === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneHour')
    } else {
      formattedDate = `${t.hours} ${translate('qvain.datasets.tableRows.dateFormat.hours')}`
    }
  } else if (t.minutes > 0) {
    if (t.minutes === 1) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMinute')
    } else {
      formattedDate = `${t.minutes} ${translate('qvain.datasets.tableRows.dateFormat.minutes')}`
    }
  } else {
    formattedDate = translate('qvain.datasets.tableRows.dateFormat.moments')
  }

  return formattedDate
}

export default formatAge
