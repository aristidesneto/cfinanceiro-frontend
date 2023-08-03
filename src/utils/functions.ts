function formatReal(value: string) {
  return Number.parseFloat(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date: string) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return [day, month, year].join('/')
}

function monthExtension(month: number) {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return months[month]
}

export { formatReal, formatDate, monthExtension }
