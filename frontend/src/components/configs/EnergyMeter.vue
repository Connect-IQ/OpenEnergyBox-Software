<template>
<div class="flex flex-row">
  <div class="flex flex-col">
    <Checkbox class="mt-2" label="Phases to neutral" :checked="input.value.energy.phases_to_neutral" @update:checked="input.value.energy.phases_to_neutral = $event" />
    <Checkbox class="mt-2" label="Currents" :checked="input.value.energy.currents" @update:checked="input.value.energy.currents = $event" />
    <Checkbox class="mt-2" label="Power" :checked="input.value.energy.power" @update:checked="input.value.energy.power = $event" />
    <Checkbox class="mt-2" label="Power factors" :checked="input.value.energy.power_factors" @update:checked="input.value.energy.power_factors = $event" />
  </div>
  <div class="flex flex-col ml-10">
    <Checkbox class="mt-2" label="Apparent power" :checked="input.value.energy.apparent_power" @update:checked="input.value.energy.apparent_power = $event" />
    <Checkbox class="mt-2" label="Reactive power" :checked="input.value.energy.reactive_power" @update:checked="input.value.energy.reactive_power = $event" />
    <Checkbox class="mt-2" label="Angles" :checked="input.value.energy.angles" @update:checked="input.value.energy.angles = $event" />
    <Checkbox class="mt-2" label="Totals & Averages" :checked="input.value.energy.totals" @update:checked="input.value.energy.totals = $event" />
  </div>
</div>
</template>

<script setup>

import Checkbox from "../Checkbox.vue";

const props = defineProps({
  input: Object
})

</script>

<style scoped>

</style>
