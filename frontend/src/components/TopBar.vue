<template>
  <div class="flex background-white rounded-2xl w-100 h-20 flex-row justify-between">
    <img src="/logo.png" class="h-20 ml-6 py-2"/>
    <h3>{{name}}</h3>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String
})
</script>

<style scoped>
.background-white {
  background-color: white;
}
</style>
