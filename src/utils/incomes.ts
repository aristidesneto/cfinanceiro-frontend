function groupByIncome(data) {
  // Agrupamento
  const groupBy = data.reduce((group, item) => {
    const { month_extension } = item;
    group[month_extension] = group[month_extension] ?? [];
    group[month_extension].push(item);
    return group;
  }, {});

  // Sum valor mensal
  const months = {};
  Object.keys(groupBy).forEach((key) => {
    const items = groupBy[key];
    const sum = items.reduce((accumulator, value) => {
      return accumulator + Number.parseFloat(value.amount);
    }, 0);
    months[key] = sum;
  });
  return months;
}

export { groupByIncome };
