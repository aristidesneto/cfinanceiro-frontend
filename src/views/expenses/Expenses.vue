<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Input, Modal, Select, Tab, Tabs, Toggle } from 'flowbite-vue';
import { vMaska } from 'maska';
import TableComponent from '@/components/tables/TableComponent.vue';
import CategorySelect from '@/composables/forms/CategorySelect.vue';
import { alertConfirmed } from '@/config/alert';
import { monthExtension } from '@/utils/functions';
import { categoriesToSelect } from '@/utils/categories';
import useCategoryApi from '@/composables/apis/useCategories';
import useEntriesApi from '@/composables/apis/useEntries';
import CardsComponent from '@/components/CardsComponent.vue';
import { formatReal } from '../../utils/functions';

const store = useStore();

const dataExpense = ref({
  id: null,
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
});

const paymentType = [
  { name: 'Cartão de crédito', value: 'credit-card' },
  { name: 'Cartão de débito', value: 'debit-card' },
  { name: 'Dinheiro', value: 'money' },
];

const activeTab = ref('first');

const now = new Date();
const atual_period = ref({
  month: now.getMonth(),
  year: now.getFullYear()
})

const period_formated = computed(() => monthExtension(atual_period.value.month) + '/' + atual_period.value.year)

const options = ref({
  isShowModal: false,
});

const fields = [
  { id: 'title', name: 'Título' },
  { id: 'category.name', name: 'Categoria' },
  { id: 'due_date', name: 'Data de vencimento' },
  { id: 'amount', name: 'Valor', format: 'money' },
  { id: 'payday', name: 'Pago', badge: 'yellow' },
  { id: 'observation', name: 'Observação' },
];

const fields_cards = [
  { id: 'title', name: 'Título' },
  { id: 'credit_card.name', name: 'Cartão' },
  { id: 'category.name', name: 'Categoria' },
  { id: 'due_date', name: 'Data de vencimento' },
  { id: 'amount', name: 'Valor', format: 'money' },
  { id: 'parcel', name: 'Parcela' },
  { id: 'total_parcel', name: 'Total parcelas' },
  { id: 'observation', name: 'Observação' },
];

const expenses_general = ref([]);
const expenses_credit_cards = ref([]);

const total_general = computed(() => {
  return expenses_general.value.reduce((accumulator, value) => {
    return accumulator + Number.parseFloat(value.amount)
  }, 0)
})

const total_credit_cards = computed(() => {
  return expenses_credit_cards.value.reduce((accumulator, value) => {
    return accumulator + Number.parseFloat(value.amount)
  }, 0)
})

const categories = ref([]);
const dueDateDisabled = ref(false);
const isRecurringDisabled = ref(false);

const creditCards = computed(() => {
  const cards_select: any[] = [];
  Object.values(store.getters.credit_cards).forEach((item) => {
    return cards_select.push({ name: item.name, value: item.id });
  });
  return cards_select;
});

const optionsMaska = {
  preProcess: (value: string) => value.replace(/[$,]/g, ''),
  postProcess: (value: string) => {
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '');
    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      Number.parseFloat(value) / 100,
    );
    return `R$ ${result}`;
  },
};

// created/mounted
onMounted(() => {
  getExpenses();
  getCategories();
  getCreditCards();
});

watch(
  () => dataExpense.value.credit_card_id,
  (newValue, oldValue) => {
    if (Number.parseInt(newValue) > 0) {
      const cards = store.getters.credit_cards;
      const card = cards.filter((item: { id: string }) => {
        return item.id === dataExpense.value.credit_card_id;
      })[0];
      const month = String(atual_period.value.month + 1).padStart(2, '0');
      dataExpense.value.due_date = `${
        card.due_date
      }/${month}/${now.getFullYear()}`;
    }
  },
  { deep: true },
);

watch(
  () => dataExpense.value.payment,
  (newValue, oldValue) => {
    if (newValue === 'credit-card') {
      dataExpense.value.is_recurring = false;
      dueDateDisabled.value = true;
      isRecurringDisabled.value = true;
    } else { 
      isRecurringDisabled.value = false;
      dueDateDisabled.value = false;
    }
    
    if (oldValue !== '') {
      dataExpense.value.due_date = '';
      dataExpense.value.credit_card_id = '';
    }
  },
  { deep: true },
);

// methods/functions
function openModal() {
  emptyFields();
  options.value.isShowModal = true;
}

function closeModal() {
  emptyFields();
  options.value.isShowModal = false;
}

function getCreditCards() {
  const params = {};
  store.dispatch('creditCards', { params });
}

function changeMonth(action: string = 'add') {
  const date = new Date(atual_period.value.year, atual_period.value.month)
  const month = action === 'add' ? date.getMonth() + 1 : date.getMonth() - 1
  date.setMonth(month)
  atual_period.value.month = date.getMonth()
  atual_period.value.year = date.getFullYear()
  getExpenses({ month: atual_period.value.month, year: atual_period.value.year })
}

// GETTERS
async function getCategories() {
  const payload = {
    type: 'expense',
    status: 1,
    paginate: 0,
  };
  const { list } = useCategoryApi();
  const { data } = await list(payload);
  categories.value = categoriesToSelect(data.data, 'expense');
}

async function getExpenses(options = {}) {
  const year = options.year ?? now.getFullYear();
  const month = String((options.month ?? now.getMonth()) + 1).padStart(2, '0');
  const last_day = new Date(year, Number(month), 0).getDate();
  const params = {
    type: 'expense',
    order_by: '-:due_date',
    start_period: `${year}-${month}-01`,
    end_period: `${year}-${month}-${last_day}`,
  };
  const { list } = useEntriesApi();
  const { data } = await list(params);

  expenses_general.value = data.data.filter(
    (item) => item.credit_card === null,
  );
  expenses_credit_cards.value = data.data.filter(
    (item) => item.credit_card !== null,
  );
}

// CREATE
function onSubmit() {
  dataExpense.value.id ? onUpdate() : onCreate()
}

async function onCreate() {
  const payload = {
    type: 'expense',
    title: dataExpense.value.title,
    is_recurring: dataExpense.value.is_recurring,
    start_date: dataExpense.value.start_date,
    due_date: dataExpense.value.due_date,
    category_id: dataExpense.value.category_id,
    credit_card_id:
      dataExpense.value.credit_card_id === ''
        ? null
        : dataExpense.value.credit_card_id,
    parcel: dataExpense.value.parcel,
    amount: dataExpense.value.amount,
    observation: dataExpense.value.observation,
  };
  const { create } = useEntriesApi();
  await create(payload);
  options.value.isShowModal = false

  emptyFields();
  getExpenses({ month: atual_period.value.month, year: atual_period.value.year })
}

function onEdit(item) {
  emptyFields();
  dataExpense.value.id = item.id
  dataExpense.value.title = item.title
  dataExpense.value.is_recurring = item.is_recurring ? true : false
  dataExpense.value.start_date = item.start_date
  dataExpense.value.due_date = item.due_date
  dataExpense.value.category_id = item.category.id
  dataExpense.value.payment = item.credit_card ? 'credit-card' : 'money'
  dataExpense.value.credit_card_id = item.credit_card ? item.credit_card.id : null
  dataExpense.value.parcel = item.parcel
  dataExpense.value.amount = item.amount
  dataExpense.value.observation = item.observation
  options.value.isShowModal = true
}

async function onUpdate() {
  const payload = {
    title: dataExpense.value.title,
    is_recurring: dataExpense.value.is_recurring,
    start_date: dataExpense.value.start_date,
    due_date: dataExpense.value.due_date,
    category_id: dataExpense.value.category_id,
    credit_card_id:
      dataExpense.value.credit_card_id === ''
        ? null
        : dataExpense.value.credit_card_id,
    parcel: dataExpense.value.parcel,
    amount: dataExpense.value.amount,
    observation: dataExpense.value.observation,
  };
  const { update } = useEntriesApi()
  await update(dataExpense.value.id, payload)
  options.value.isShowModal = false

  emptyFields();
  getExpenses({ month: atual_period.value.month, year: atual_period.value.year })
}

async function onDelete(item) {
  alertConfirmed({
    title: `Deseja remover o item: ${item.title}?`,
    confirmButtonText: 'Sim, remover',
    confirmButtonColor: 'red',
    cancelButtonText: 'Cancelar',
  }).then(async (res: any) => {
    if (res.isConfirmed) {
      const { remove } = useEntriesApi();
      await remove(item.id);
      options.value.isShowModal = false
      emptyFields();
      getExpenses({ month: atual_period.value.month, year: atual_period.value.year })
    }
  });  
}

function emptyFields() {
  dataExpense.value.id = null
  dataExpense.value.title = ''
  dataExpense.value.is_recurring = false
  dataExpense.value.start_date = ''
  dataExpense.value.due_date = ''
  dataExpense.value.category_id = ''
  dataExpense.value.credit_card_id = ''
  dataExpense.value.payment = ''
  dataExpense.value.parcel = 1
  dataExpense.value.amount = 0
  dataExpense.value.observation = ''
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h3 class="text-3xl font-semibold text-gray-700">
          Despesas {{ period_formated }}
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

    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            :title="formatReal(total_general)"
            subtitle="Despesas Gerais"
            icon="success"
          />
        </div>
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            :title="formatReal(total_credit_cards)"
            subtitle="Despesas com Cartão de Crédito"
            icon="info"
          />
        </div>
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <CardsComponent
            :title="formatReal(total_general + total_credit_cards)"
            subtitle="Total do mês"
            icon="warning"
          />
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-2 bg-white rounded-md shadow-md">
          <Tabs v-model="activeTab" variant="underline" class="pt-5">
            <Tab name="first" title="Despesas Gerais">
              <TableComponent
                :items="expenses_general"
                :fields="fields"
                @btn-edit-item="onEdit"
                @btn-delete-item="onDelete"
              />
            </Tab>
            <Tab name="second" title="Despesas Cartão de Crédito">
              <TableComponent
                :items="expenses_credit_cards"
                :fields="fields_cards"
                @btn-edit-item="onEdit"
                @btn-delete-item="onDelete"
              />
            </Tab>
          </Tabs>

          <div
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  @click="changeMonth('sub')"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 hover:bg-gray-400 rounded-l"
                >
                  Mês anterior
                </button>
                <button
                  @click="changeMonth('add')"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 hover:bg-gray-400 rounded-r"
                >
                  Próximo mês
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="options.isShowModal" size="5xl" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">
          <span v-if="dataExpense.id">
            <FontAwesomeIcon :icon="['fas', 'pencil']" class="mr-2" />
            Atualizar despesa
          </span>
          <span v-else>
            <FontAwesomeIcon :icon="['fas', 'plus']" class="mr-2" />
            Lançamento de despesa
          </span>
        </div>
        {{ dataExpense }}
      </template>

      <template #body>
        <form @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <Input v-model="dataExpense.title" label="Título" />
            </div>

            <div class="sm:col-span-3 pt-6">
              <Toggle
                v-model="dataExpense.is_recurring"
                :disabled="isRecurringDisabled"
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
                :disabled="dueDateDisabled"
                data-maska="##/##/####"
                label="Data de vencimento"
                placeholder="dd/mm/YYYY"
              />
            </div>

            <div class="sm:col-span-6">
              <Input v-model="dataExpense.observation" label="Observação" />
            </div>

            <div class="sm:col-span-6 text-right">
              <button
                type="button"
                class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mr-2"
                @click="closeModal"
              >
                <FontAwesomeIcon :icon="['fas', 'circle-xmark']" class="mr-1" />
                Fechar
              </button>
              <button
                v-if="dataExpense.id"
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
              >
                <FontAwesomeIcon :icon="['fas', 'refresh']" class="mr-1" />
                Salvar
              </button>
              <button
                v-else
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
              >
                <FontAwesomeIcon :icon="['fas', 'floppy-disk']" class="mr-1" />
                Cadastrar
              </button>
            </div>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>
