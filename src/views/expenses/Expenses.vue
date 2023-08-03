<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Toggle, Input, Select, Tab, Tabs } from 'flowbite-vue'
// import { vMaska } from 'maska'
import GeneralExpense from '@/components/expenses/GeneralExpenseComponent.vue'
import CreditCardExpenseComponent from '@/components/expenses/CreditCardExpenseComponent.vue'
import FormCreate from '@/components/expenses/FormCreate.vue'
// import CategorySelect from '@/composables/forms/CategorySelect.vue'
import { monthExtension } from '@/utils/functions'
// import { categoriesToSelect } from '@/utils/categories'

const store = useStore()


// interface IExpense {
//   title: string
//   is_recurring: boolean
//   start_date: string
//   due_date: string
//   category_id: string
//   credit_card_id: string
//   payment: string
//   parcel: number
//   amount: number
//   observation: string
// }

// const optionsMaska = {
//   preProcess: value => value.replace(/[$,]/g, ''),
//   postProcess: value => {
//     value = value.replace('.', '').replace(',', '').replace(/\D/g, '')
//     const options = { minimumFractionDigits: 2 }
//     const result = new Intl.NumberFormat('pt-BR', options)
//       .format(Number.parseFloat(value) / 100)
//     return `R$ ${result}`
//   },
// }

// const categories = computed(() => categoriesToSelect(store.state.categories.categories, 'expense'))

// const creditCards = computed(() => {
//   const cards = store.getters.credit_cards
//   const cards_select = []
//   Object.values(cards).forEach((item) => {
//     return cards_select.push({ name: item.name, value: item.id })
//   })
//   return cards_select
// })
// const paymentType = ref([
//   { name: 'Cartão de crédito', value: 'credit-card' },
//   { name: 'Cartão de débito', value: 'debit-card' },
//   { name: 'Dinheiro', value: 'money' },
// ])
const activeTab = ref('first')
const now = new Date()
// const dataExpense = ref<IExpense>({
//   title: '',
//   is_recurring: false,
//   start_date: '',
//   due_date: '',
//   category_id: '',
//   credit_card_id: '',
//   payment: '',
//   parcel: 1,
//   amount: 0,
//   observation: '',
// })

// function calculateRecurring() {
//   if (dataExpense.value.payment === 'credit-card') {
//     dataExpense.value.is_recurring = false
//     return true
//   }
//   return false
// }

onMounted(() => {
  getExpenses()
  // getCreditCards()
})

// Functions
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

// function getCreditCards() {
//   const params = {}
//   store.dispatch('creditCards', { params })
// }

// async function onCreate() {
//   const payload = {
//     type: 'expense',
//     title: dataExpense.value.title,
//     is_recurring: dataExpense.value.is_recurring,
//     start_date: dataExpense.value.start_date,
//     due_date: dataExpense.value.due_date,
//     category_id: dataExpense.value.category_id,
//     credit_card_id: dataExpense.value.credit_card_id,
//     parcel: dataExpense.value.parcel,
//     amount: dataExpense.value.amount,
//     observation: dataExpense.value.observation,
//   }
//   await store.dispatch('createExpense', { payload })
//   getExpenses()
// }
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
          @click="openModal"
          class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
        >
          <FontAwesomeIcon :icon="['far', 'trash-can']" /> Adicionar
        </button>
      </div>
    </div>

    <!-- <FormCreate /> -->

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
  </div>
</template>
