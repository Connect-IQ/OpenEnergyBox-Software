<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Flow type</label>
        <Select v-model="input.value.flow.type" :options="types" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>
    </div>
    <div class="flex flex-col ml-10">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Units</label>
        <Select v-model="input.value.flow.unit" :options="units" optionLabel="name" optionValue="id" placeholder="Unit" class="noborder" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";

const props = defineProps({
  input: Object
})

const units = [{id: 1, name: 'liter'}, {id: 2, name: 'cm3'}]
const types = [{id: 1, name: 'Water'}, {id: 2, name: 'Gas'}]

</script>

<style scoped>

</style>
