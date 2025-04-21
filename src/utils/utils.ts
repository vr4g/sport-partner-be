export const convertDataObjectKeysToArray = (data: any) => {
  return Object.keys(data)
    .filter((key) => key !== 'id')
    .map((key, index) => `${key}=$${index + 1}`)
    .join(', ')
}
