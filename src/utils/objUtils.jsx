export const isTodayMatchingLevelDate = (
  activeEcho,
  todaydate,
  userLocalTzpass
) => {
  const lvl = activeEcho.lvl
  const dateArray = activeEcho.dates
  const today = todaydate || new Date()

  // Get the user's local timezone
  const userLocalTz =
    userLocalTzpass || Intl.DateTimeFormat().resolvedOptions().timeZone

  // Set today's date in the user's local timezone
  today.toLocaleString('en-US', { timeZone: userLocalTz })
  today.setHours(0, 0, 0, 0)

  if (lvl >= 0 && lvl < dateArray.length) {
    const levelDate = new Date(activeEcho.next || dateArray[lvl - 1])

    // Parse activeEcho.next to ensure correct date comparison
    const nextDate = new Date(activeEcho.next)
    nextDate.setHours(0, 0, 0, 0)

    levelDate.toLocaleString('en-US', { timeZone: userLocalTz })
    levelDate.setHours(0, 0, 0, 0)

    const timeDifference = nextDate.getTime() <= today.getTime()

    if (timeDifference) {
      return 'tocomplite'
    } else {
      return 'next'
    }
  } else {
    return 'null'
  }
}

export const isDayStreakDone = (nowdate, recorddate, userTimezone) => {
  const nowD = nowdate || new Date().toISOString()
  const recordD = recorddate || '2024-02-25T11:17:14.323Z'

  const tzas = userTimezone || 'UTC'

  const userTimeS = new Date(nowD)

  userTimeS.toLocaleString('en-US', { timeZone: tzas })
  userTimeS.setHours(0, 0, 0, 0)

  const recTimeS = new Date(recordD)

  recTimeS.toLocaleString('en-US', { timeZone: tzas })
  recTimeS.setHours(0, 0, 0, 0)

  // Calculate the difference in milliseconds
  const timeDifference = userTimeS.getTime() - recTimeS.getTime()

  // Convert milliseconds to days
  const daysDifference = timeDifference / (1000 * 3600 * 24)

  // Check if the difference is more than 1 day
  if (daysDifference === 0) {
    return 0 // Same day
  } else if (daysDifference === 1) {
    return 1 // Just 1 day difference
  } else {
    return -1 // More than 1 day difference
  }
}
