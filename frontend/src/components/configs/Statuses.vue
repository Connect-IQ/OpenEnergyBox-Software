<template>
  <div class="flex flex-row">
    <div class="flex flex-col">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Status</label>
        <Select v-model="input.value.statuses.status" :options="statuses" optionLabel="name" optionValue="id" placeholder="Type" class="noborder" />
      </div>

    </div>
    <div class="flex flex-col ml-10">
      <div class="newborder mt-2 flex flex-col">
        <label class="text-black text-xs pl-1 pt-1">Additional data</label>
        <InputText v-model="input.value.statuses.data" class="noborder" placeholder="{device: 'xyz'}"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Select from "primevue/select";

const props = defineProps({
  input: Object
})

const statuses = [{id: 1, name: 'Any'}, {id: 2, name: 'No power'}, {id: 3, name: 'No connectivity'}]

</script>

<style scoped>

</style>
