<template>
  <div class="bg">
    <TopBar/>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import TopBar from "./components/TopBar.vue";
</script>

<style>
.bg {
  width: 100vw;
  height: 100vh;
  background-image: url('/bg.png');
}
</style>
