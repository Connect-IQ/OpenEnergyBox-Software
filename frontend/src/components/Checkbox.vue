<template>
  <div class="flex flex-row justify-between px-2 py-2 mt-2 newborder">
    <div class="newtext">{{label}}</div>
    <ToggleSwitch inputId="switch1" class="ml-10" v-model="val" @update:modelValue="changeVal"/>
  </div>
</template>

<script setup>
import ToggleSwitch from "primevue/toggleswitch";
import {onMounted, ref} from "vue";

const props = defineProps({
  checked: Boolean,
  label: String
})
const val = ref(false)


const changeVal = (e) => {
  console.log(e)
  emit('updateChecked', e)
}
const emit = defineEmits(['updateChecked'])

onMounted(() => {
  setTimeout(() => {
    val.value = props.checked
  }, 100)
})
</script>

<style scoped>

</style>
