function formatReal(value: string) {
  return Number.parseFloat(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}

export { formatReal }
