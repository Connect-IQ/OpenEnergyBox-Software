<template>
  <div class="box">
    <div class="box-header">
      <h3 class="text-black ml-7 font-bold text-2xl">{{title}}</h3>
    </div>
    <div class="break"></div>
    <div class="box-content mx-7">
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>

<style scoped>
.box {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  margin-left:15px;
  margin-right: 15px;
  padding-bottom: 50px;
}

.break {
  margin-left: 30px;
  margin-right: 30px;
  border: 3px solid #13199A;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.25);
}
</style>
