<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Input, Select } from 'flowbite-vue';
import { alertConfirmed } from '@/config/alert';
import useCategoryApi from '@/composables/apis/useCategories';

interface IFormData {
  id: number;
  name: string;
  type: string;
  color: string;
  status: boolean;
}

const dataCategory = reactive<IFormData>({
  id: 0,
  name: '',
  type: 'income',
  color: '',
  status: false,
});

const data = {
  categoryType: {
    income: 'Receita',
    expense: 'Despesa',
  },
  paginate: [
    { value: 5, name: '5' },
    { value: 10, name: '10' },
    { value: 15, name: '15' },
    { value: 20, name: '20' },
  ],
  filter: [
    { value: 'all', name: 'Todos' },
    { value: '1', name: 'Ativo' },
    { value: '0', name: 'Inativo' },
  ],
  types: [
    { value: 'all', name: 'Todos' },
    { value: 'income', name: 'Receita' },
    { value: 'expense', name: 'Despesa' },
  ],
  types_select() {
    return data.types.filter((item) => item.value !== 'all');
  },
};

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
  is_loading: false,
});

const categories_data = ref([]);
const categories_meta = ref([]);

onMounted(() => {
  getCategories();
});

function isLoading() {
  options.value.is_loading = !options.value.is_loading;
}

// Functions
async function getCategories(current_page = 1) {
  const payload = {
    type: options.value.filter.type,
    status: options.value.filter.status,
    total_page: options.value.paginate.total_page,
    page: current_page,
  };
  const { list } = useCategoryApi();
  const { data } = await list(payload);
  categories_data.value = data.data;
  categories_meta.value = data.meta;
}

async function onCreate() {
  isLoading();
  const payload = {
    name: dataCategory.name,
    type: dataCategory.type,
    color: dataCategory.color,
    status: true,
  };
  const { store } = useCategoryApi();
  await store(payload)
    .then(() => {
      options.value.open = false;
      getCategories();
    })
    .catch(() => {
      isLoading();
    });
}

async function onUpdate() {
  options.value.open = false;
  const payload = {
    name: dataCategory.name,
    type: dataCategory.type,
    color: dataCategory.color,
    status: dataCategory.status,
  };
  const { update } = useCategoryApi();
  await update(dataCategory.id, payload);
  getCategories();
}

function onDelete(item: any) {
  alertConfirmed({
    title: `Deseja remover o item: ${item.name}?`,
    confirmButtonText: 'Sim, remover',
    confirmButtonColor: 'red',
    cancelButtonText: 'Cancelar',
  }).then(async (res: any) => {
    if (res.isConfirmed) {
      const { remove } = useCategoryApi();
      await remove(item.id);
      getCategories();
    }
  });
}

function openCreate() {
  options.value.modal.title = 'Cadastrar';
  options.value.modal.showCheckbox = false;
  options.value.open = true;
  dataCategory.id = 0;
  dataCategory.name = '';
  dataCategory.type = 'income';
  dataCategory.color = '#d91212';
}

function onEdit(item: IFormData) {
  options.value.modal.title = 'Editar';
  options.value.modal.showCheckbox = true;
  options.value.open = true;

  dataCategory.id = item.id;
  dataCategory.name = item.name;
  dataCategory.type = item.type;
  dataCategory.color = item.color;
  dataCategory.status = Boolean(item.status);
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Categorias</h3>
  </div>

  <div class="mt-4">
    <div class="mt-6">
      <div class="flex flex-col mt-3 sm:flex-row">
        <div class="flex">
          <Select
            v-model="options.paginate.total_page"
            :options="data.paginate"
            @change="getCategories"
            label="Registros por página"
          />
          <Select
            v-model="options.filter.status"
            :options="data.filter"
            @change="getCategories"
            label="Status"
          />
          <Select
            v-model="options.filter.type"
            :options="data.types"
            @change="getCategories"
            label="Tipo"
          />
        </div>

        <div class="flex-1 text-right mt-7">
          <button
            class="px-4 py-2 text-blue-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            @click="openCreate()"
          >
            <FontAwesomeIcon :icon="['fas', 'circle-plus']" /> Adicionar
          </button>
        </div>
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
                  <Input v-model="dataCategory.name" label="Nome" />
                </div>

                <div>
                  <Select
                    v-model="dataCategory.type"
                    :options="data.types_select()"
                    label="Tipo"
                  />
                </div>

                <div>
                  <label class="text-gray-800 font-medium text-sm">Cor</label>
                  <input
                    v-model="dataCategory.color"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="color"
                  />
                </div>

                <div v-if="options.modal.showCheckbox">
                  <label>
                    <input
                      v-model="dataCategory.status"
                      type="checkbox"
                      class="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500"
                    /><span class="ml-2 text-gray-700">Ativo</span>
                  </label>
                </div>
              </div>
            </form>

            <!-- Footer -->
            <div class="flex justify-end mt-8">
              <button
                class="px-4 px-2 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
                @click="options.open = false"
              >
                Fechar
              </button>
              <button
                v-if="dataCategory.id > 0"
                class="px-4 py-2 text-green-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
                @click="onUpdate()"
              >
                <FontAwesomeIcon icon="fa fa-floppy-disk" class="mr-2" />
                Atualizar
              </button>
              <button
                v-else
                class="px-4 py-2 text-green-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
                @click="onCreate()"
              >
                <FontAwesomeIcon icon="fa fa-floppy-disk" class="mr-2" />
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col mt-6">
        <div
          class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div
            class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
          >
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200 w-1"
                  />
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Nome
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Tipo
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200 text-center"
                  >
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(item, index) in categories_data" :key="index">
                  <td class="px-6 py-4 border-b border-gray-200">
                    <div
                      :style="{
                        background: item.color,
                        fontSize: '10px',
                        display: 'block',
                        width: '25px',
                        height: '25px',
                      }"
                      :title="item.color"
                    />
                  </td>
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      {{ item.name }}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      {{ data.categoryType[item.type] }}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div
                      class="inline-flex px-4 text-xs leading-5 font-semibold text-white rounded-full"
                      :class="[item.status ? 'bg-green-800' : 'bg-red-600']"
                    >
                      {{ item.status ? 'Ativo' : 'Inativo' }}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center"
                  >
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
                      @click="onDelete(item)"
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
              <span class="text-xs text-gray-900 xs:text-sm mt-2">
                Mostrando {{ categories_meta.from }} ao
                {{ categories_meta.to }} de
                {{ categories_meta.total }} registros
              </span>

              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="categories_meta.current_page - 1 === 0"
                  :class="[
                    categories_meta.current_page - 1 === 0
                      ? 'bg-gray-100 hover:bg-gray-100'
                      : 'bg-gray-300 hover:bg-gray-400',
                  ]"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-l"
                  @click="getCategories(categories_meta.current_page - 1)"
                >
                  Anterior
                </button>
                <button
                  :disabled="
                    categories_meta.current_page + 1 ===
                    categories_meta.last_page + 1
                  "
                  :class="[
                    categories_meta.current_page + 1 ===
                    categories_meta.last_page + 1
                      ? 'bg-gray-100 hover:bg-gray-100'
                      : 'bg-gray-300 hover:bg-gray-400',
                  ]"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 rounded-r"
                  @click="getCategories(categories_meta.current_page + 1)"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
