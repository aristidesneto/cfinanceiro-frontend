<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { alertConfirmed } from '../../config/alert'

const store = useStore()

interface IFormData {
  id: number
  name: string
  type: string
  color: string
  status: boolean
}

const dataCategory = reactive<IFormData>({
  id: 0,
  name: '',
  type: 'income',
  color: '',
  status: false,
})

const data = {
  categoryType: {
    income: 'Receita',
    expense: 'Despesa',
  },
}

const options = ref({
  filter: {
    type: 'all',
    status: 'all',
  },
  paginate: {
    total_page: 10,
    page: 1,
  },
  modal: {
    title: '',
    showCheckbox: false,
  },
  open: false,
})

const categories = computed(() => store.getters.categories_income)
// const categories2 = computed(() => store.state.categories.data_categories)
const meta = computed(() => store.getters.categories_meta_income)

// console.log(categories2)

onMounted(() => {
  getCategories()
})

// Functions
function getCategories(current_page = 1) {
  const payload = {
    type: options.value.filter.type,
    status: options.value.filter.status,
    total_page: options.value.paginate.total_page,
    page: current_page,
  }
  store.dispatch('categories', { payload })
}

async function onCreate() {
  options.value.open = false
  const payload = {
    name: dataCategory.name,
    type: dataCategory.type,
    color: dataCategory.color,
    status: true,
  }
  await store.dispatch('createCategory', { payload })
  getCategories()
}

async function onUpdate() {
  options.value.open = false
  const payload = {
    name: dataCategory.name,
    type: dataCategory.type,
    color: dataCategory.color,
    status: dataCategory.status,
  }
  const id = dataCategory.id
  await store.dispatch('updateCategory', { id, payload })
  getCategories()
}

function onDelete(id: number) {
  alertConfirmed({
    title: 'Deseja remover esse registro?',
    confirmButtonText: 'Sim, remover',
    confirmButtonColor: 'red',
    cancelButtonText: 'Cancelar',
  }).then(async (res) => {
    if (res.isConfirmed) {
      await store.dispatch('deleteCategory', { id })
      getCategories()
    }
  })
}

function openCreate() {
  options.value.modal.title = 'Cadastrar'
  options.value.modal.showCheckbox = false
  options.value.open = true
  dataCategory.id = 0
  dataCategory.name = ''
  dataCategory.type = 'income'
  dataCategory.color = '#d91212'
}

function onEdit(item: IFormData) {
  options.value.modal.title = 'Editar'
  options.value.modal.showCheckbox = true
  options.value.open = true

  dataCategory.id = item.id
  dataCategory.name = item.name
  dataCategory.type = item.type
  dataCategory.color = item.color
  dataCategory.status = Boolean(item.status)
}

function normalizeType(type) {
  return data.categoryType[type]
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">
      Categorias
    </h3>
  </div>

  <div class="mt-4">
    <div class="mt-6">
      <div class="flex flex-col mt-3 sm:flex-row">
        <div class="flex">
          <div class="relative">
            <select
              v-model="options.paginate.total_page"
              class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
              @change="getCategories"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
            >
              <svg
                class="w-4 h-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>

          <div class="relative">
            <select
              v-model="options.filter.status"
              class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              @change="getCategories"
            >
              <option value="all">Todos</option>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
            >
              <svg
                class="w-4 h-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>

          <div class="relative">
            <select
              v-model="options.filter.type"
              class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              @change="getCategories"
            >
              <option value="all">Todos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
            >
              <svg
                class="w-4 h-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="relative block mt-2 sm:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg
              viewBox="0 0 24 24"
              class="w-4 h-4 text-gray-500 fill-current"
            >
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
              />
            </svg>
          </span>

          <input
            placeholder="Search"
            class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
          >
        </div>

        <button
          type="submit"
          class="px-4 py-2 text-green-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 ml-2"
          @click="openCreate()"
        >
          <FontAwesomeIcon :icon="['far', 'square-plus']" class="mr-2" /> Cadastrar
        </button>
      </div>

      <!-- modal -->
      <div
        :class="`modal ${
          !options.open && 'opacity-0 pointer-events-none'
        } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
      >
        <div
          class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
          @click="options.open = false"
        />

        <div
          class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
        >
          <!-- Add margin if you want to see some of the overlay behind the modal -->
          <div class="px-6 py-4 text-left modal-content">
            <!-- Title -->
            <div class="flex items-center justify-between pb-3">
              <p class="text-2xl font-bold">
                <span v-text="options.modal.title" /> categoria
              </p>
            </div>

            <!-- Body -->
            <form>
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
                <div>
                  <label class="text-gray-700" for="username">Nome</label>
                  <input
                    v-model="dataCategory.name"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="emailAddress">Tipo</label>
                  <select
                    v-model="dataCategory.type"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  >
                    <option v-for="(item, key) in data.categoryType" :key="key" :value="key">
                      {{ item }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="text-gray-700" for="password">Cor</label>
                  <input
                    v-model="dataCategory.color"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="color"
                  >
                </div>

                <div v-if="options.modal.showCheckbox">
                  <label>
                    <input
                      v-model="dataCategory.status"
                      type="checkbox"
                      class="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500"
                    ><span class="ml-2 text-gray-700">Ativo</span>
                  </label>
                </div>
              </div>
            </form>

            <!-- Footer -->
            <div class="flex justify-end mt-8">
              <button
                class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
                @click="options.open = false"
              >
                Fechar
              </button>
              <button
                v-if="dataCategory.id > 0"
                class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                @click="onUpdate()"
              >
                Atualizar
              </button>
              <button
                v-else
                class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                @click="onCreate()"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="my-6 overflow-hidden bg-white rounded-md shadow">
        <table class="w-full text-left border-collapse">
          <thead class="border-b">
            <tr>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 w-1"
              />
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                Nome
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                Tipo
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                Status
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
              v-for="(item, index) in categories.data" :key="index"
              class="hover:bg-gray-200"
            >
              <td class="px-6 py-4 text-gray-700 border-b">
                <div
                  :style="{ background: item.color, fontSize: '10px', display: 'block', width: '25px', height: '25px' }" 
                  :title="item.color"
                />
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                {{ normalizeType(item.type) }}
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                <span
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-white rounded-full"
                  :class="[item.status ? 'bg-green-600' : 'bg-red-400']"
                >
                  {{ item.status ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 border-b text-center">
                <button
                  class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none mr-2"
                  title="Editar registro"
                  @click="onEdit(item)"
                >
                  <FontAwesomeIcon :icon="['far', 'edit']" class="" />
                </button>
                <button
                  class="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none"
                  title="Remover registro"
                  @click="onDelete(item.id)"
                >
                  <FontAwesomeIcon :icon="['far', 'trash-can']" class="" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
        >
          <span class="text-xs text-gray-900 xs:text-sm">
            Mostrando {{ meta.from }} ao {{ meta.to }} de {{ meta.total }} registros
          </span>

          <div class="inline-flex mt-2 xs:mt-0">
            <button
              :disabled="(meta.current_page - 1) === 0"
              :class="[(meta.current_page - 1) === 0 ? 'bg-gray-100 hover:bg-gray-100' : 'bg-gray-300 hover:bg-gray-400']"
              class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-l"
              @click="getCategories(meta.current_page - 1)"
            >
              Anterior
            </button>
            <button
              :disabled="(meta.current_page + 1) === meta.last_page + 1"
              :class="[(meta.current_page + 1) === meta.last_page + 1 ? 'bg-gray-100 hover:bg-gray-100' : 'bg-gray-300 hover:bg-gray-400']"
              class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-r"
              @click="getCategories(categories.meta.current_page + 1)"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
