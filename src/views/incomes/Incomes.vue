<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { formatReal } from '../../utils/functions'

const store = useStore()

interface FormData {
  is_recurring: number
  start_date: string
  category_id: number
  amount: string
  amount_sum: string
  observation: string
}

const dataIncome = reactive<FormData>({
  is_recurring: 0,
  start_date: '07/2023',
  category_id: 23,
  amount_sum: '',
  amount: '5000,45',
  observation: 'Teste',
})

const open = ref(false)
const entries = computed(() => store.getters.entries_incomes)
const group_income = computed(() => store.getters.entries_group_income)
const categories = computed(() => store.getters.categories_income)
const entry_id = ref({
  amount: '',
  category: '',
  observation: '',
  month_extension: '',
})

onMounted(() => {
  getIncomes()
  getCategories()
})

const startDate = new Date()

// Functions
function getIncomes() {
  const params = {
    type: 'income',
    order_by: '+:start_date',
    start_period: `${startDate.getFullYear()}-01`,
    end_period: `${startDate.getFullYear()}-12`,
  }
  store.dispatch('incomes', { params })
}

function getCategories() {
  const payload = {
    type: 'income',
    status: 'active',
  }
  store.dispatch('categories', { payload })
}

async function onCreate() {
  const payload = {
    type: 'income',
    is_recurring: dataIncome.is_recurring,
    start_date: dataIncome.start_date,
    category_id: dataIncome.category_id,
    amount: dataIncome.amount,
    observation: dataIncome.observation,
  }
  await store.dispatch('createIncome', { payload })
  getIncomes()
}

async function onDelete(id) {
  await store.dispatch('removeIncome', { id })
  getIncomes()
}

// async function getByID(item) {
//   entry_id.value = item
//   open.value = true
// }
</script>

<template>
  <div>
    <div class="flex">
      <h3 class="text-3xl font-semibold text-gray-700">
        Receitas de 2023
      </h3>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700">
            Lançamento de Receitas
          </h2>

          <form @submit.prevent="onCreate">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
              <div>
                <label class="text-gray-700" for="username">Mês</label>
                <input
                  v-model="dataIncome.start_date"
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
                  <option v-for="item in categories.data" :key="item.id" :value="item.id">
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
                type="submit"
                class="px-4 py-2 text-green-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
              >
                <FontAwesomeIcon :icon="['far', 'floppy-disk']" class="mr-2" /> Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex">
        <div class="flex-1 mt-8">
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
                      Valor total
                    </th>
                    <!-- <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" /> -->
                  </tr>
                </thead>

                <tbody class="bg-white">
                  <tr v-for="(value, key) in group_income" :key="key">
                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="flex items-center">
                        <div class="text-sm font-medium leading-5 text-gray-900">
                          {{ key }}
                        </div>
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                    >
                      <div class="text-sm leading-5 text-gray-900">
                        {{ formatReal(value) }}
                      </div>
                    </td>

                    <!-- <td
                      class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                    >
                      <button
                        class="px-4 py-2 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 mr-2"
                        title="Visualizar registro"
                      >
                        <FontAwesomeIcon :icon="['far', 'eye']" />
                      </button>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex-1 ml-8">
          <div class="mt-8">
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
                    <tr v-for="(item, index) in entries" :key="index">
                      <td
                        class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                      >
                        <div class="flex items-center">
                          <div class="text-sm font-medium leading-5 text-gray-900">
                            {{ item.month_extension }}
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
                        <!-- <button
                          class="px-4 py-2 text-gray-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 mr-2"
                          title="Editar registro"
                          @click="getByID(item)"
                        >
                          <FontAwesomeIcon :icon="['far', 'pen-to-square']" />
                        </button> -->
                        <button
                          class="px-4 py-2 text-gray-200 bg-red-800 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                          title="Remover registro"
                          @click="onDelete(item.id)"
                        >
                          <FontAwesomeIcon :icon="['far', 'trash-can']" />
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

    <!-- Modal -->
    <div
      :class="`modal ${
        !open && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
        @click="open = false"
      />

      <div
        class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
      >
        <!-- <div
          class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close"
        >
          <svg
            class="text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
          <span class="text-sm">(Esc)</span>
        </div> -->

        <!-- Add margin if you want to see some of the overlay behind the modal -->
        <div class="px-6 py-4 text-left modal-content">
          <!-- Title -->
          <div class="flex items-center justify-between pb-3">
            <p class="text-2xl font-bold">
              Modal Title
            </p>
            <!-- <div class="z-50 cursor-pointer modal-close" @click="open = false">
              <svg
                class="text-black fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div> -->
          </div>

          <!-- Body -->
          <p>Mês: {{ entry_id.month_extension }}</p>
          <p>Valor: {{ entry_id.amount }}</p>
          <p>Categoria: {{ entry_id.category.name }}</p>
          <p>Observação: {{ entry_id.observation }}</p>

          <!-- Footer -->
          <div class="flex justify-end pt-2">
            <button
              class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
              @click="open = false"
            >
              Close
            </button>
            <button
              class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
            >
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
