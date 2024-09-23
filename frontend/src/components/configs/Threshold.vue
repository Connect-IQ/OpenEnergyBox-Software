<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Threshold value</label>
        <Select v-model="input.value.statuses.status" :options="statuses" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Amount </label>
        <InputNumber v-model="input.value.statuses.amount" class="mt-2 noborder" />
      </div>

    </div>
    <div class="flex flex-col ml-10">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Count status</label>
        <Select v-model="input.value.statuses.status" :options="statuses" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
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

const statuses = [{id: 1, name: 'Any'}, {id: 2, name: 'No power'}, {id: 3, name: 'No connectivity'}]

</script>

<style scoped>

</style>
