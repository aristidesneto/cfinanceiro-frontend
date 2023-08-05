<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Input, Modal, Select, Tab, Tabs, Toggle } from 'flowbite-vue'
import { vMaska } from 'maska'
import GeneralExpense from '@/components/expenses/GeneralExpenseComponent.vue'
import CreditCardExpenseComponent from '@/components/expenses/CreditCardExpenseComponent.vue'
import CategorySelect from '@/composables/forms/CategorySelect.vue'
import { monthExtension } from '@/utils/functions'
import { categoriesToSelect } from '@/utils/categories'

const store = useStore()

// data
interface IExpense {
  title: string
  is_recurring: boolean
  start_date: string
  due_date: string
  category_id: string
  credit_card_id: string
  payment: string
  parcel: number
  amount: number
  observation: string
}

const dataExpense = ref<IExpense>({
  title: '',
  is_recurring: false,
  start_date: '',
  due_date: '',
  category_id: '',
  credit_card_id: '',
  payment: '',
  parcel: 1,
  amount: 0,
  observation: '',
})

const paymentType = ref([
  { name: 'Cartão de crédito', value: 'credit-card' },
  { name: 'Cartão de débito', value: 'debit-card' },
  { name: 'Dinheiro', value: 'money' },
])

const activeTab = ref('first')

const now = new Date()

const options = ref({
  isShowModal: false,
})

// computed
const categories = computed(() => categoriesToSelect(store.state.categories.categories, 'expense'))

const creditCards = computed(() => {
  const cards_select = []
  Object.values(store.getters.credit_cards).forEach((item) => {
    return cards_select.push({ name: item.name, value: item.id })
  })
  return cards_select
})

// created/mounted
onMounted(() => {
  getExpenses()
})

// methods/functions
function openModal() {
  getCategories()
  getCreditCards()
  options.value.isShowModal = true
}

function closeModal() {
  options.value.isShowModal = false
}

function calculateRecurring() {
  if (dataExpense.value.payment === 'credit-card') {
    dataExpense.value.is_recurring = false
    return true
  }
  return false
}

function getCategories() {
  const payload = {
    status: 1,
    paginate: 0,
  }
  store.dispatch('categories', { payload })
}

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

function getCreditCards() {
  const params = {}
  store.dispatch('creditCards', { params })
}

function getExpenses() {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const last_day = new Date(year, Number(month), 0).getDate()
  const params = {
    type: 'expense',
    order_by: '+:due_date',
    start_period: `${year}-${month}-01`,
    end_period: `${year}-${month}-${last_day}`,
  }
  store.dispatch('expenses', { params })
}

async function onCreate() {
  const payload = {
    type: 'expense',
    title: dataExpense.value.title,
    is_recurring: dataExpense.value.is_recurring,
    start_date: dataExpense.value.start_date,
    due_date: dataExpense.value.due_date,
    category_id: dataExpense.value.category_id,
    credit_card_id: dataExpense.value.credit_card_id,
    parcel: dataExpense.value.parcel,
    amount: dataExpense.value.amount,
    observation: dataExpense.value.observation,
  }
  await store.dispatch('createExpense', { payload })
  getExpenses()
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h3 class="text-3xl font-semibold text-gray-700">
          Despesas {{ monthExtension(now.getMonth()) }}/{{ now.getFullYear() }}
        </h3>
      </div>
      <div class="flex-1 text-right">
        <button
          class="px-4 py-2 text-blue-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          @click="openModal"
        >
          <FontAwesomeIcon :icon="['fas', 'circle-plus']" /> Adicionar
        </button>
      </div>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-2 bg-white rounded-md shadow-md">
          <Tabs v-model="activeTab" variant="underline" class="pt-5">
            <Tab name="first" title="Despesas Gerais">
              <GeneralExpense />
            </Tab>
            <Tab name="second" title="Despesas Cartão de Crédito">
              <CreditCardExpenseComponent />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="options.isShowModal" size="5xl" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">
          <FontAwesomeIcon :icon="['fas', 'circle-plus']" class="mr-2" /> Lançamento de despesa
        </div>
      </template>

      <template #body>
        <form @submit.prevent="onCreate">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <Input
                v-model="dataExpense.title"
                label="Título"
              />
            </div>

            <div class="sm:col-span-3 pt-6">
              <Toggle
                v-model="dataExpense.is_recurring"
                :disabled="calculateRecurring()"
                label="Despesa recorrente"
              />
            </div>

            <div class="sm:col-span-3">
              <Input
                v-model="dataExpense.start_date"
                v-maska
                data-maska="##/##/####"
                label="Data da despesa"
                placeholder="dd/mm/YYYY"
              />
            </div>

            <div class="sm:col-span-3">
              <CategorySelect
                v-model="dataExpense.category_id"
                :items="categories"
              />
            </div>

            <div class="sm:col-span-3">
              <Select
                v-model="dataExpense.payment"
                :options="paymentType"
                placeholder="Selecione a forma de pagamento"
                label="Forma de pagamento"
                @change="calculateRecurring"
              />
            </div>

            <div class="sm:col-span-3">
              <Select
                v-if="dataExpense.payment === 'credit-card'"
                v-model="dataExpense.credit_card_id"
                :options="creditCards"
                placeholder="Selecione cartão de crédito"
                label="Cartão de crédito"
              />
            </div>

            <div
              v-if="dataExpense.payment === 'credit-card'"
              class="sm:col-span-2"
            >
              <Input
                v-model="dataExpense.parcel"
                v-maska
                data-maska="#00"
                data-maska-tokens="0:[0-9]:optional"
                label="Número de parcelas"
              />
            </div>

            <div class="sm:col-span-2">
              <Input
                v-model="dataExpense.amount"
                v-maska:[optionsMaska]
                label="Valor"
              />
            </div>

            <div class="sm:col-span-2">
              <Input
                v-model="dataExpense.due_date"
                v-maska
                data-maska="##/##/####"
                label="Data de vencimento"
                placeholder="dd/mm/YYYY"
              />
            </div>

            <div class="sm:col-span-6">
              <Input
                v-model="dataExpense.observation"
                label="Observação"
              />
            </div>

            <div class="sm:col-span-6 text-right">
              <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <FontAwesomeIcon :icon="['fas', 'floppy-disk']" class="mr-1" /> Cadastrar
              </button>
              <button
                class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-4"
                @click="closeModal"
              >
                <FontAwesomeIcon :icon="['fas', 'circle-xmark']" class="mr-1" /> Fechar
              </button>
            </div>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>
