export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date)

  return {
    getString: `${day}${formatOrdinal(day)} ${month}`,
    getOrdinalSuffix: formatOrdinal(day),
    day: day,
    dayWithOrdinal: `${day}${formatOrdinal(day)}`,
    month: month,
    year: date.getFullYear()
  }
}

// Add ordinal suffix (st, nd, rd, th)
export function formatOrdinal(number: number): string {
  const pluralRules = new Intl.PluralRules("en-US", { type: "ordinal" })
  const suffixes: { [key: string]: string } = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th"
  }
  const suffix = suffixes[pluralRules.select(number)]
  return suffix
}

export function getWeekDay(dayNumber: number): string {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days[dayNumber]
}
