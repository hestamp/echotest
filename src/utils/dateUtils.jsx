export function formatDateNow(dateString) {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  })

  return formattedDate
}
