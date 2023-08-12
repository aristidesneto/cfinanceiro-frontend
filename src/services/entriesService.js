import useEntriesApi from '@/composables/apis/useEntries';

export default function entriesServices() {
  const { list, create, update, remove } = useEntriesApi('entries');

  return {
    list,
    create,
    update,
    remove,
  };
}
