<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import CardsComponent from '@/components/CardsComponent.vue';

const store = useStore();

interface Incomes {
  name: string;
  due_date: string;
  value: string;
}

const dataIncome: Incomes = {
  name: 'Apartamento',
  due_date: '20/05/2023',
  value: 'R$ 345,55',
};

const income = ref<Incomes[]>([...Array(10).keys()].map(() => dataIncome));
const entries = ref({});

// function getCategories() {
//   const payload = {
//     // type: props.search,
//     status: 1,
//     paginate: 0,
//   }
//   store.dispatch('categories', { payload })
// }

// onMounted(() => {
//   getCategories()
// })
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Dashboard</h3>

    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            title="R$ 10000"
            subtitle="Despesas do mês (UP 1,5%)"
            icon="success"
          />
        </div>
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            title="R$ 2000"
            subtitle="Receitas do mês (UP 1,5%)"
            icon="danger"
          />
        </div>
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            title="R$ 3000"
            subtitle="Saldo do mês (UP 1,5%)"
            icon="info"
          />
        </div>
      </div>
    </div>

    <div class="mt-8" />

    <div class="flex">
      <div class="flex-1">
        <h4 class="text-gray-600">Despesas a vencer (7 dias)</h4>
        <div class="mt-8">
          <div
            class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <div
              class="inline-block min-w-full overflow-hidden align-middle border-b border-green-800 shadow sm:rounded-lg"
            >
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th
                      class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                    >
                      Despesa
                    </th>
                    <th
                      class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                    >
                      Vencimento
                    </th>
                    <th
                      class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                    >
                      Valor
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
                  </tr>
                </thead>
                <tbody class="bg-white">
                  <tr v-for="(u, index) in income" :key="index">
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ u.name }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ u.due_date }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ u.value }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                      <a href="#" class="text-indigo-600 hover:text-indigo-900"
                        >Pagar</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 ml-4">
        <h4 class="text-gray-600">Despesas por categorias</h4>
        <div class="mt-8">
          <p>{{ entries }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
