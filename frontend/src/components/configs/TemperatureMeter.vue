<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Unit</label>
        <Select v-model="input.value.temperature.unit" :options="units" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>
    </div>
    <div class="flex flex-col ml-10">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Type</label>
        <Select v-model="input.value.temperature.type" :options="types" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";

const props = defineProps({
  input: Object
})

const units = [{id: 1, name: 'Celsius'}, {id: 2, name: 'Fahrenheit'}, {id: 3, name: 'Kelvin'}]
const types = [{id: 1, name: 'Ambient temperature'}, {id: 2, name: 'Product temperature'}, {id: 3, name: 'Humidity'}]

</script>

<style scoped>

</style>
