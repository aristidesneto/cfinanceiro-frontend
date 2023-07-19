<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

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

interface Incomes {
  month: string
  value: string
  category: string
  observation: string
}

const incomes: Incomes = {
  month: 'Julho',
  value: 'R$ 5.000,00',
  category: 'Salário',
  observation: 'qq coisa',
}

const ListIncomes = ref<Incomes[]>([...Array(10).keys()].map(() => incomes))
const entries = ref({})

onMounted(() => {
  store.dispatch('incomes')
    .then(response => entries.value = response.data)
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
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>

                  <div>
                    <label class="text-gray-700" for="emailAddress">Categoria</label>
                    <input
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>

                  <div>
                    <label class="text-gray-700" for="password">Valor</label>
                    <input
                      class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                      type="text"
                    >
                  </div>

                  <div>
                    <label class="text-gray-700" for="passwordConfirmation">Observação</label>
                    <input
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
                    <th
                      class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                    >
                      Observação
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
                  </tr>
                </thead>

                <tbody class="bg-white">
                  <tr v-for="(u, index) in entries" :key="index">
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div class="text-sm font-medium leading-5 text-gray-900">
                          {{ u.title }}
                        </div>
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="text-sm leading-5 text-gray-900">
                        {{ u.category_id }}
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="text-sm leading-5 text-gray-900">
                        {{ u.amount }}
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="text-sm leading-5 text-gray-900">
                        {{ u.observation }}
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
    </div>
  </div>
</template>
