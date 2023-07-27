<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { formatReal, formatDate } from '../../utils/functions'

const store = useStore()

interface User {
  username: string
  email: string
  password: string
  confirm: string
}

const user = ref<User>({
  username: '',
  email: '',
  password: '',
  confirm: '',
})

interface Expenses {
  name: string
  category: string
  due_date: string
  value: string
  observation: string
}

const entries = computed(() => store.getters.entries_expense)

const expenses: Expenses = {
  name: 'Apartamento',
  category: 'Habitação',
  due_date: '20/05/2023',
  value: 'R$ 345,55',
  observation: 'Débito automático',
}

const ListExpenses = ref<Expenses[]>([...Array(10).keys()].map(() => expenses))

function register() {
  const data = JSON.parse(JSON.stringify(user.value))
  // eslint-disable-next-line no-console
  console.log('Registered: ', data)
}

onMounted(() => {
  getIncomes()
})

const startDate = new Date()

// Functions
function getIncomes() {
  const year = startDate.getFullYear()
  const month = String(startDate.getMonth() + 1).padStart(2, '0')
  const last_day = new Date(year, Number(month), 0).getDate()
  const params = {
    type: 'expense',
    order_by: '+:due_date',
    start_period: `${year}-${month}-01`,
    end_period: `${year}-${month}-${last_day}`,
  }
  store.dispatch('expenses', { params })
}
</script>

<template>
  <div>
    <div class="flex">
      <h3 class="text-3xl font-semibold text-gray-700">
        Despesas Julho/2023 - R$ 3.456,98
      </h3>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            Cadastrar despesas
          </h2>

          <form @submit.prevent="register">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
              <div>
                <label class="text-gray-700" for="username">Despesa</label>
                <input
                  v-model="user.username"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                >
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">Categoria</label>
                <input
                  v-model="user.email"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="email"
                >
              </div>

              <div>
                <label class="text-gray-700" for="password">Data vencimento</label>
                <input
                  v-model="user.password"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="password"
                >
              </div>

              <div>
                <label class="text-gray-700" for="passwordConfirmation">Valor</label>
                <input
                  v-model="user.confirm"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="password"
                >
              </div>

              <div>
                <label class="text-gray-700" for="passwordConfirmation">Observação</label>
                <input
                  v-model="user.confirm"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="password"
                >
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
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
                  Categoria
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
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Observação
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(item, index) in entries" :key="index">
                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex items-center">
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      {{ item.title }}
                    </div>
                  </div>
                </td>

                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ item.category.name }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ formatDate(item.due_date) }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ formatReal(item.amount) }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ item.observation }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-2">Editar</a>
                  <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-2">Detalhes</a>
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">Remover</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
