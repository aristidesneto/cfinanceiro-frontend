<script setup lang="ts">
import { Select } from 'flowbite-vue';

const props = defineProps({
  items: {
    type: Object,
  },
});
</script>

<template>
  <Select
    :options="props.items"
    placeholder="Selecione uma categoria"
    label="Categorias"
  />
</template>
