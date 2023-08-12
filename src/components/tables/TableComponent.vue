<script setup lang="ts">
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-vue';
import { formatReal } from '@/utils/functions';

const props = defineProps({
  items: {
    type: Object,
  },
  fields: {
    type: Object,
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
  <Table hoverable>
    <TableHead>
      <TableHeadCell v-for="(item, key) in props.fields" :key="key">
        {{ item.name }}
      </TableHeadCell>
      <TableHeadCell> Ação </TableHeadCell>
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
            v-if="props.buttonEdit"
            class="px-2 py-1 text-gray-200 bg-green-800 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700 mr-2"
            title="Editar registro"
          >
            <FontAwesomeIcon :icon="['far', 'pen-to-square']" />
          </button>
          <button
            v-if="props.buttonRemove"
            class="px-2 py-1 text-gray-200 bg-red-800 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
            title="Remover registro"
          >
            <FontAwesomeIcon :icon="['far', 'trash-can']" />
          </button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
