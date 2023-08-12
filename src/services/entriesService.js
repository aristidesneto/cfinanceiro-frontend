// import { api } from '@/config/api'
import useEntriesApi from '@/composables/apis/useEntries';

export default function entriesServices() {
  const { listExpenses, createExpense } = useEntriesApi('entries');

  return {
    listExpenses,
    createExpense,
  };
}
