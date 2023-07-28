<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

interface FormData {
  name: string
  type: number
  color: string
}

const categories = computed(() => store.getters.categories_income)
const dataCategory = reactive<FormData>({
  name: 'Teste',
  type: 1,
  color: '#AAABBB',
})
const typeCategory = {
  income: 'Receita',
  expense: 'Despesa',
}

onMounted(() => {
  getCategories()
})

function getCategories() {
  const payload = {}
  store.dispatch('categories', { payload })
}

function normalizeType(type) {
  return typeCategory[type]
}
</script>

<template>
  <div>
    <div class="flex">
      <h3 class="text-3xl font-semibold text-gray-700">
        Categorias
      </h3>
    </div>
  </div>

  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">
          Cadastro de categorias
        </h2>

        <form>
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
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
                <option v-for="(item, key) in typeCategory" :key="key" :value="key">
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
        {{ dataCategory }}

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
                        class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 w-1 uppercase border-b border-gray-200 bg-gray-50"
                      />
                      <th
                        class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                      >
                        Nome
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                      >
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    <tr v-for="(item, index) in categories" :key="index">
                      <td
                        class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                      >
                        <div class="text-sm leading-5 text-gray-900">
                          <div :style="{ background: item.color, fontSize: '10px', display: 'block', width: '25px', height: '25px' }" />
                          <!-- <span :style="{ width: 25px, height: 25px, display: block,}" /> -->
                          <!-- {{ item.color }} -->
                        </div>
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
                          {{ normalizeType(item.type) }}
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
        </div>
      </div>
    </div>
  </div>
</template>
