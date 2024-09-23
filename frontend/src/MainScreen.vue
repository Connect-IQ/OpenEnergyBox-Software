<template>
  <div class="flex flex-col">
    <Box :title="'Main Screen'">
      <div class="flex flex-row">
        <div class="flex flex-col">
          <Button class="mt-3" :label="'IP: ' + ip" severity="info" outlined />
          <Button class="mt-3" label="ID: oeb_9BE600" severity="info" outlined />
          <Button class="mt-3" label="Hardware revision: 1.1" severity="info" outlined />
          <Button class="mt-3" :label="`Device uptime: ${hours} h ${minutes} m`" severity="info" outlined />
        </div>
        <div class="flex flex-col ml-10">
          <Button class="mt-3 text-white" label="5G Connected" severity="success" raised />
          <Button class="mt-3 text-white" label="Database connected" severity="success" raised />
        </div>
      </div>
    </Box>
    <Box :title="'Inputs configuration'">
      <div class="flex flex-row">
        <div class="flex flex-col">
          <Button class="mt-3" label="Input 1: Energy meter" severity="info" outlined  icon="pi pi-pencil"  iconPos="right" @click="$router.push('/input/1')"/>
          <Button class="mt-3" label="Input 2: Flow meter" severity="info" outlined  icon="pi pi-pencil" iconPos="right" @click="$router.push('/input/2')"/>
          <Button class="mt-3" label="Input 3: Waste meter" severity="info" outlined  icon="pi pi-pencil" iconPos="right" @click="$router.push('/input/3')"/>
        </div>
        <div class="flex flex-col ml-10">
          <Button class="mt-3" label="Input 4: Energy meter" severity="info" outlined  icon="pi pi-pencil" iconPos="right" @click="$router.push('/input/4')"/>
          <Button class="mt-3" label="Input 5: Flow meter" severity="info" outlined  icon="pi pi-pencil" iconPos="right" @click="$router.push('/input/5')"/>
          <Button class="mt-3" label="Input 6: Temperature meter" severity="info" outlined  icon="pi pi-pencil" iconPos="right" @click="$router.push('/input/6')"/>
        </div>
      </div>
    </Box>
</div>
</template>

<script setup>
import Button from "primevue/button";
import Box from "./components/Box.vue";
import {onMounted, ref} from "vue";
import axios from 'axios';

const seconds = ref(0)
const minutes =ref(21)
const hours = ref(2)
const days = ref(0)


const ip = ref('')
const getIP = () => {
  fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        ip.value = data.ip
      })
      .catch(error => {
        console.log('Error:', error);
      });
}

const getConfig = () => {
  axios.get('http://0.0.0.0:3000/api/config')
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log('Error:', error);
      });
}

onMounted(() => {
  getConfig()
  setInterval(() => {
    seconds.value++
    if (seconds === 60) {
      seconds.value = 0
      minutes.value++
    }
    if (minutes === 60) {
      minutes.value = 0
      hours.value++
    }
    if (hours === 24) {
      hours.value = 0
      days.value++
    }
  }, 1000)
  getIP()
})
</script>

<style>
.p-button-icon {
  color: #5e5e5e !important;
}
</style>
