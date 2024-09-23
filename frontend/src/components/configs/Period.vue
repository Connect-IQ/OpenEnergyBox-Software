<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Send every - value </label>
        <InputNumber v-model="input.value.period.send_every" class="mt-2 noborder" />
      </div>

    </div>
    <div class="flex flex-col ml-10">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Send every - unit</label>
        <Select v-model="input.value.period.unit" :options="units" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";

const props = defineProps({
  input: Object
})

const units = [{id: 1, name: 'Minutes'}, {id: 2, name: 'Hours'}, {id: 3, name: 'Seconds'}]

</script>

<style scoped>

</style>
