function categoriesToSelect(categories: object, type: string = 'income') {
  return Object.values(categories).filter((item) => {
    return item.type === type
  }).map((item) => {
    return {
      value: item.id,
      name: item.name,
    }
  })
}

export { categoriesToSelect }
