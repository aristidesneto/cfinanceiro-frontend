function formatReal(value: string) {
  return Number.parseFloat(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date: string) {
  const d = new Date(date)
  d.toLocaleString('pt-br', {
    timeZone: 'America/Sao_Paulo',
  })
  console.log(d)
  const day = d.getDate()
  // const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return [day, month, year].join('/')
}

export { formatReal, formatDate }
