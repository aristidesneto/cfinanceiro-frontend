import useEntriesApi from '@/composables/apis/useEntries';

const url = 'entries';

export const useFetchExpense = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const last_day = new Date(year, Number(month), 0).getDate();
  const params = {
    type: 'expense',
    order_by: '+:due_date',
    start_period: `${year}-${month}-01`,
    end_period: `${year}-${month}-${last_day}`,
  };
  const { list } = useEntriesApi(url);
  const { data } = await list(params);

  const general = data.data.filter((item) => item.credit_card === null);
  const credit_cards = data.data.filter((item) => item.credit_card !== null);

  return { general, credit_cards };
};
