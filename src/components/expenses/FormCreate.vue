<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { vMaska } from 'maska'
import { Input, Select, Toggle } from 'flowbite-vue'
import CategorySelect from '@/composables/forms/CategorySelect.vue'
import { categoriesToSelect } from '@/utils/categories'

const store = useStore()

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

const categories = computed(() => categoriesToSelect(store.state.categories.categories, 'expense'))

const creditCards = computed(() => {
  const cards = store.getters.credit_cards
  const cards_select = []
  Object.values(cards).forEach((item) => {
    return cards_select.push({ name: item.name, value: item.id })
  })
  return cards_select
})

const paymentType = ref([
  { name: 'Cartão de crédito', value: 'credit-card' },
  { name: 'Cartão de débito', value: 'debit-card' },
  { name: 'Dinheiro', value: 'money' },
])

const options = ref({
  isShowModal: false,
})

function closeModal() {
  options.value.isShowModal = false
}

function openModal() {
  options.value.isShowModal = true
}

function calculateRecurring() {
  if (dataExpense.value.payment === 'credit-card') {
    dataExpense.value.is_recurring = false
    return true
  }
  return false
}

const optionsMaska = {
  preProcess: value => value.replace(/[$,]/g, ''),
  postProcess: value => {
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
  // getExpenses()
}

onMounted(() => {
  getCreditCards()
})
</script>

<template>
  <div>
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

        <div class="sm:col-span-3">
          <Input
            v-model="dataExpense.due_date"
            v-maska
            data-maska="##/##/####"
            label="Data de vencimento"
            placeholder="dd/mm/YYYY"
          />
        </div>

        <div class="sm:col-span-3">
          <Input
            v-model="dataExpense.observation"
            label="Observação"
          />
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

    <!-- Modal -->
    <Modal v-if="options.isShowModal" size="7xl" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">
          Detalhes do mês
        </div>
      </template>
      <template #body>
        sffsdfsdf
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
