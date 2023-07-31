function normalizeCategories(categories) {
  return Object.values(categories.data).map((item) => {
    return {
      value: item.id,
      name: item.name,
    }
  })
}

export { normalizeCategories }
