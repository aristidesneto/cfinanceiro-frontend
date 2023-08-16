<script setup lang="ts">
import {
  Badge,
} from 'flowbite-vue';
import { formatReal } from '@/utils/functions';

const emit = defineEmits(['btnEditItem', 'btnDeleteItem', 'btnPaydayItem'])

const props = defineProps({
  items: {
    type: Object,
  },
  fields: {
    type: Object,
  },
  buttonView: {
    type: Boolean,
    default: false,
  },
  buttonPay: {
    type: Boolean,
    default: false,
  },
  buttonEdit: {
    type: Boolean,
    default: true,
  },
  buttonRemove: {
    type: Boolean,
    default: true,
  },
});

function normalizeField(field, item) {
  const arr = field.split('.');
  return item[arr[0]][arr[1]];
}

function fieldIsRelationship(field) {
  return field.includes('.');
}
</script>

<template>
  <!-- <Table hoverable>
    <TableHead>
      <TableHeadCell v-for="(item, key) in props.fields" :key="key">
        {{ item.name }}
      </TableHeadCell>
      <TableHeadCell class="text-center">
        Ação
      </TableHeadCell>
    </TableHead>
    <TableBody>
      <TableRow v-for="item in props.items" :key="item">
        <TableCell v-for="(value, key) in props.fields" :key="key">
          <div v-if="value.format === 'money'">
            {{ formatReal(item[value.id]) }}
          </div>
          <div v-else-if="fieldIsRelationship(value.id)">
            {{ normalizeField(value.id, item) }}
          </div>
          <div v-else-if="value.badge">
            <div v-if="item[value.id] === null">
              <Badge :type="value.badge"> Pendente </Badge>
            </div>
            <div v-else>
              <Badge :type="value.badge">
                {{ item[value.id] }}
              </Badge>
            </div>
          </div>
          <div v-else>
            {{ item[value.id] }}
          </div>
        </TableCell>
        <TableCell>
          <button
            v-if="props.buttonView"
            class="px-2 py-1 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 mr-2"
            title="Visualizar registro"
          >
            <FontAwesomeIcon :icon="['fas', 'eye']" />
          </button>
          <button
            v-if="props.buttonPay"
            class="px-2 py-1 text-gray-200 bg-yellow-800 rounded-md hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700 mr-2"
            title="Pagar despesa"
            @click="emit('btnPaydayItem', item)"
          >
            <FontAwesomeIcon :icon="['fas', 'money-bill']" />
          </button>
          <button
            v-if="props.buttonEdit"
            class="px-2 py-1 text-gray-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 mr-2"
            title="Editar registro"
            @click="emit('btnEditItem', item)"
          >
            <FontAwesomeIcon :icon="['fas', 'pencil']" />
          </button>
          <button
            v-if="props.buttonRemove"
            class="px-2 py-1 text-gray-200 bg-red-800 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
            title="Remover registro"
            @click="emit('btnDeleteItem', item)"
          >
            <FontAwesomeIcon :icon="['fas', 'trash-can']" />
          </button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table> -->
  <hr>
  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th v-for="(item, key) in props.fields" :key="key" class="px-4 py-3" scope="col">
          {{ item.name }}
        </th>
        <th scope="col" class="px-4 py-3 text-center"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.items" :key="item" class="border-b dark:border-gray-700">
        <td v-for="(value, key) in props.fields" :key="key" class="px-4 py-3">
          <div v-if="value.format === 'money'">
            {{ formatReal(item[value.id]) }}
          </div>
          <div v-else-if="fieldIsRelationship(value.id)">
            {{ normalizeField(value.id, item) }}
          </div>
          <div v-else-if="value.badge">
            <div v-if="item[value.id] === null">
              <Badge :type="value.badge"> Pendente </Badge>
            </div>
            <div v-else>
              <Badge :type="value.badge">
                {{ item[value.id] }}
              </Badge>
            </div>
          </div>
          <div v-else-if="item.credit_card && value.id === 'title' && item.total_parcel > 1">
            {{ item.title }} ( {{ item.parcel + '/' + item.total_parcel }} )
          </div>
          <div v-else>
            {{ item[value.id] }}
          </div>
        </td>                            
        <td class="px-4 py-3 flex items-center justify-end">
          <div class="flex items-center space-x-3 w-full md:w-auto">
            <button
              v-if="props.buttonView"
              class="px-2 py-1 text-blue-800 bg-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              title="Visualizar registro"
            >
              <FontAwesomeIcon :icon="['fas', 'eye']" />
            </button>
            <button
              v-if="props.buttonPay"
              class="px-2 py-1 text-yellow-800 bg-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              title="Pagar despesa"
              @click="emit('btnPaydayItem', item)"
            >
              <FontAwesomeIcon :icon="['fas', 'hand-holding-dollar']" /> 
            </button>
            <button
              v-if="props.buttonEdit"
              class="px-2 py-1 text-green-800 bg-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              title="Editar registro"
              @click="emit('btnEditItem', item)"
            >
              <FontAwesomeIcon :icon="['fas', 'pencil']" />
            </button>
            <button
              v-if="props.buttonRemove"
              class="px-2 py-1 text-red-800 bg-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              title="Remover registro"
              @click="emit('btnDeleteItem', item)"
            >
              <FontAwesomeIcon :icon="['fas', 'trash-can']" />
            </button>                         
          </div>
        </td>
      </tr>                                
    </tbody>
  </table>
</template>
