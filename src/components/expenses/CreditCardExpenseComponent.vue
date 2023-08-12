<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import TableComponent from '@/components/tables/TableComponent.vue';

const store = useStore();

const entries = computed(() => {
  const items = store.state.entries.data_entries_expense;
  return Object.values(items).filter((item) => {
    return item.credit_card;
  });
});

const fields = [
  { id: 'title', name: 'Título' },
  { id: 'credit_card.name', name: 'Cartão' },
  { id: 'category.name', name: 'Categoria' },
  { id: 'due_date', name: 'Data de vencimento' },
  { id: 'amount', name: 'Valor', format: 'money' },
  { id: 'parcel', name: 'Parcela' },
  { id: 'total_parcel', name: 'Total parcelas' },
  { id: 'observation', name: 'Observação' },
];
</script>

<template>
  <TableComponent :items="entries" :fields="fields" />
</template>
