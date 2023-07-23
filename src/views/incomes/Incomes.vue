<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

interface FormData {
  month: string
  category_id: string
  amount: string
  observation: string
}

const dataIncome = ref<FormData>({
  month: '',
  category_id: '',
  amount: '',
  observation: '',
})

// const user = ref<User>({
//   username: '',
//   email: '',
//   password: '',
//   confirm: '',
// })

// interface Incomes {
//   month: string
//   value: string
//   category: string
//   observation: string
// }

// const incomes: Incomes = {
//   month: 'Julho',
//   value: 'R$ 5.000,00',
//   category: 'Salário',
//   observation: 'qq coisa',
// }

// const ListIncomes = ref<Incomes[]>([...Array(10).keys()].map(() => incomes))
const entries = ref({})
const categories = ref({})

onMounted(() => {
  store.dispatch('incomes')
    .then(() => {
      entries.value = store.getters.entries_incomes
    })

  const payload = {
    type: 'income',
  }
  store.dispatch('categories', { payload })
    .then(() => {
      categories.value = store.getters.categories_income
    })
})
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="basis-1/4">
        <h3 class="text-3xl font-semibold text-gray-700">
          Receitas de 2023
        </h3>
      </div>
    </div>

    <div class="flex">
      <div class="flex-none">
        <div class="mt-8">
          <div class="mt-4">
            <div class="p-6 bg-white rounded-md shadow-md">
              <h2 class="text-lg font-semibold text-gray-700 capitalize">
                Cadastrar receita
              </h2>

              <form>
                <div class="grid grid-cols-1 gap-6 mt-4">
                  <div>
                    <label class="text-gray-700" for="username">Mês</label>
                    <input
                      v-model="dataIncome.month"
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>

                  <div>
                    <label class="text-gray-700" for="emailAddress">Categoria</label>
                    <select
                      v-model="dataIncome.category_id"
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    >
                      <option v-for="item in categories" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="text-gray-700" for="password">Valor</label>
                    <input
                      v-model="dataIncome.amount"
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>

                  <div>
                    <label class="text-gray-700" for="passwordConfirmation">Observação</label>
                    <input
                      v-model="dataIncome.observation"
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>
                </div>

                <div class="flex justify-end mt-4">
                  <button
                    class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  >
                    Cadastrar <FontAwesomeIcon :icon="['far', 'floppy-disk']" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 ml-4">
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
                      Mês
                    </th>
                    <th
                      class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                    >
                      Categoria
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
                  <tr v-for="(item, index) in entries" :key="index">
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div class="text-sm font-medium leading-5 text-gray-900">
                          {{ item.start_date }}
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
                        {{ item.amount }}
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                      <button
                        class="px-4 py-2 text-gray-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 mr-2"
                      >
                        Editar <FontAwesomeIcon :icon="['far', 'pen-to-square']" />
                      </button>
                      <button
                        class="px-4 py-2 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 mr-2"
                      >
                        Visualizar <FontAwesomeIcon :icon="['far', 'eye']" />
                      </button>
                      <button
                        class="px-4 py-2 text-gray-200 bg-red-800 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                      >
                        Remover <FontAwesomeIcon :icon="['far', 'trash-can']" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
