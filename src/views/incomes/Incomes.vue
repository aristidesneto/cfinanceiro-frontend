<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Input, Modal, Select } from 'flowbite-vue'
import { vMaska } from 'maska'
import { formatReal } from '@/utils/functions'
import { alertConfirmed } from '@/config/alert'
import CategorySelect from '@/composables/forms/CategorySelect.vue'
import { categoriesToSelect } from '@/utils/categories'

const store = useStore()

const optionsMaska = {
  preProcess: value => value.replace(/[$,]/g, ''),
  postProcess: (value) => {
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')
    const options = { minimumFractionDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options)
      .format(Number.parseFloat(value) / 100)
    return `R$ ${result}`
  },
}

interface FormData {
  is_recurring: number
  start_date: object
  category_id: string
  amount: string | number
  amount_sum: string | number
  observation: string
}

const now = new Date()

const dataIncome = ref<FormData>({
  is_recurring: 0,
  start_date: {
    month: now.getMonth(),
    year: now.getFullYear(),
  },
  category_id: '',
  amount_sum: 0,
  amount: 0,
  observation: '',
})

const dataEditIncome = ref({
  start_date: {},
  category_id: '',
  amount_sum: '',
  amount: '',
  observation: '',
})

const options = ref({
  isShowModal: false,
  editItemIncome: {
    edit: false,
    id: 0,
  },
})

const entries = computed(() => store.getters.entries_incomes)
const group_income = computed(() => store.getters.entries_group_income)
const detailed_month = ref()
// const categories = computed(() => store.getters.categories_select)
const categories = computed(() => categoriesToSelect(store.state.categories.categories))

onMounted(() => {
  getIncomes()
})

// Functions
async function getIncomes() {
  const params = {
    type: 'income',
    order_by: '+:start_date',
    start_period: `${now.getFullYear()}-01`,
    end_period: `${now.getFullYear()}-12`,
  }
  await store.dispatch('incomes', { params })
}

// function getCategories() {
//   const payload = {
//     type: 'income',
//     status: 1,
//   }
//   store.dispatch('categories', { payload })
// }

function closeModal() {
  options.value.isShowModal = false
  options.value.editItemIncome.edit = false
}

function getDetailMonth(month: number) {
  return Object.values(entries.value).filter((item) => {
    return item.month_extension === month
  })
}

function editItemIncome(item) {
  options.value.editItemIncome.edit = true
  options.value.editItemIncome.id = item.id
  dataEditIncome.value.start_date = {
    month: item.start_date_month - 1,
    year: item.start_date_year,
  }
  dataEditIncome.value.category_id = item.category.id
  dataEditIncome.value.amount = item.amount
  dataEditIncome.value.observation = item.observation
}

async function saveItemIncome(item) {
  options.value.editItemIncome.edit = false
  const payload = {
    start_date: {
      month: dataEditIncome.value.start_date.month + 1,
      year: dataEditIncome.value.start_date.year,
    },
    category_id: dataEditIncome.value.category_id,
    amount: dataEditIncome.value.amount,
    observation: dataEditIncome.value.observation,
  }
  const id = item.id
  await store.dispatch('updateIncome', { id, payload })
  await getIncomes()
  detailed_month.value = getDetailMonth(item.month_extension)
}

async function onCreate() {
  const payload = {
    type: 'income',
    is_recurring: dataIncome.value.is_recurring,
    start_date: {
      month: dataIncome.value.start_date.month + 1,
      year: dataIncome.value.start_date.year,
    },
    category_id: dataIncome.value.category_id,
    amount: dataIncome.value.amount,
    observation: dataIncome.value.observation,
  }
  await store.dispatch('createIncome', { payload })
  await getIncomes()
  dataIncome.value.start_date = {
    month: now.getMonth(),
    year: now.getFullYear(),
  }
  dataIncome.value.amount = 0
}

async function onDelete(item) {
  alertConfirmed({
    title: 'Deseja remover esse registro?',
    confirmButtonText: 'Sim, remover',
    confirmButtonColor: 'red',
    cancelButtonText: 'Cancelar',
  }).then(async (res) => {
    if (res.isConfirmed) {
      const id = item.id
      await store.dispatch('removeIncome', { id })
      await getIncomes()
      detailed_month.value = getDetailMonth(item.month_extension)
    }
  })
}

async function openEdit(month: number) {
  options.value.isShowModal = true
  detailed_month.value = getDetailMonth(month)
}
</script>

<template>
  <div>
    <div class="flex">
      <h3 class="text-3xl font-semibold text-gray-700">
        Receitas de {{ now.getFullYear() }}
      </h3>
    </div>

    <div class="mt-8">
      <div class="flex">
        <!-- Column 1 -->
        <div class="flex-1 mr-8">
          <div class="p-6 bg-white rounded-md shadow-md">
            <h2 class="text-lg font-semibold text-gray-700">
              Lançamento de Receitas
            </h2>

            <form @submit.prevent="onCreate">
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
                <div>
                  <VueDatePicker
                    v-model="dataIncome.start_date"
                    month-picker
                  />
                </div>

                <div>
                  <CategorySelect
                    v-model="dataIncome.category_id"
                    :items="categories"
                  />
                </div>

                <div>
                  <Input
                    v-model="dataIncome.amount"
                    v-maska:[optionsMaska]
                    label="Valor"
                  />
                </div>

                <div>
                  <Input
                    v-model="dataIncome.observation"
                    label="Observação"
                  />
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
            {{ dataIncome }}
          </div>
        </div>
        <!-- Column 2 -->
        <div class="flex-1">
          <div class="overflow-hidden bg-white rounded-md shadow">
            <table class="w-full text-left border-collapse">
              <thead class="border-b">
                <tr>
                  <th
                    class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                  >
                    Mês
                  </th>
                  <th
                    class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                  >
                    Valor total
                  </th>
                  <th
                    class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 text-center"
                  >
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in group_income" :key="key"
                  class="hover:bg-gray-200"
                >
                  <td class="px-6 py-4 text-gray-700 border-b">
                    {{ key }}
                  </td>
                  <td class="px-6 py-4 text-gray-700 border-b">
                    {{ formatReal(value) }}
                  </td>
                  <td class="px-6 py-4 text-gray-500 border-b text-center">
                    <button
                      class="px-2 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none mr-2"
                      title="Editar registro"
                      @click="openEdit(key)"
                    >
                      <FontAwesomeIcon :icon="['far', 'eye']" class="" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="options.isShowModal" size="7xl" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">
          Detalhes do mês
        </div>
      </template>
      <template #body>
        <table class="min-w-full">
          <thead class="border-b">
            <tr>
              <th class="px-4 py-2 text-xs leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200 bg-gray-600">
                Mês
              </th>
              <th class="px-4 py-2 text-xs leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200 bg-gray-600">
                Categoria
              </th>
              <th class="px-4 py-2 text-xs leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200 bg-gray-600">
                Valor
              </th>
              <th class="px-4 py-2 text-xs leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200 bg-gray-600">
                Observação
              </th>
              <th class="px-4 py-2 text-xs leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200 bg-gray-600 text-center">
                Ação
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(item, index) in detailed_month" :key="index"
              class="hover:bg-gray-200"
            >
              <td
                class="px-4 py-4 border-b border-gray-200 whitespace-nowrap"
              >
                <VueDatePicker
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  v-model="dataEditIncome.start_date"
                  month-picker
                />
                <div v-else class="flex items-center">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ item.month_extension }}
                  </div>
                </div>
              </td>

              <td
                class="px-4 py-2 border-b border-gray-200 whitespace-nowrap"
              >
                <Select
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  v-model="dataEditIncome.category_id"
                  :options="categories"
                />
                <div v-else class="text-sm leading-5 text-gray-900">
                  {{ item.category.name }}
                </div>
              </td>

              <td
                class="px-4 py-2 border-b border-gray-200 whitespace-nowrap"
              >
                <Input
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  v-model="dataEditIncome.amount"
                  v-maska:[optionsMaska]
                />
                <div v-else class="text-sm leading-5 text-gray-900">
                  {{ formatReal(item.amount) }}
                </div>
              </td>

              <td
                class="px-4 py-2 border-b border-gray-200 whitespace-nowrap"
              >
                <Input
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  v-model="dataEditIncome.observation"
                />
                <div v-else class="text-sm leading-5 text-gray-900">
                  {{ item.observation }}
                </div>
              </td>

              <td
                class="px-4 py-2 text-sm font-medium leading-5 text-center border-b border-gray-200 whitespace-nowrap"
              >
                <button
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  class="px-2 py-1 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 mr-2"
                  title="Salvar alterações"
                  @click="saveItemIncome(item)"
                >
                  <FontAwesomeIcon :icon="['far', 'save']" />
                </button>
                <button
                  v-else
                  class="px-2 py-1 text-gray-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 mr-2"
                  title="Editar registro"
                  @click="editItemIncome(item)"
                >
                  <FontAwesomeIcon :icon="['far', 'pen-to-square']" />
                </button>
                <button
                  v-if="options.editItemIncome.edit && options.editItemIncome.id === item.id"
                  class="px-2 py-1 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700 mr-2"
                  title="Cancelar edição"
                  @click="options.editItemIncome.edit = false"
                >
                  <FontAwesomeIcon :icon="['fa', 'arrow-rotate-left']" />
                </button>
                <button
                  class="px-2 py-1 text-gray-200 bg-red-800 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                  title="Remover registro"
                  @click="onDelete(item)"
                >
                  <FontAwesomeIcon :icon="['far', 'trash-can']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <div class="flex flex-row-reverse">
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="closeModal"
          >
            Fechar
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style>
.dp__action_select {
  --dp-primary-text-color: #212121;
}
</style>
