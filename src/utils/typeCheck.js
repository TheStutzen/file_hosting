export async function checkType(type, str) {
  const match = str.match(/filename="(.+?)"/)

  if (!match) {
    return false
  }

  switch (type) {
    case '.mov':
      return /\.mov$/i.test(match[1])
    case '.iso':
      return /\.iso$/i.test(match[1])
    default:
      return false
  }
}
