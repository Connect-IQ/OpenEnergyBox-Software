<template>
  <div class="flex flex-col">
    <Box :title="'Configure Input ' + id">
      <div class="flex flex-row">
        <div class="flex flex-col">
          <Checkbox class="mt-2" label="Active" :checked="config.value.active" @updateChecked="config.value.active = $event" />
          <Checkbox class="mt-20" label="Send periodically" :checked="config.value.send_periodically" @updateChecked="config.value.send_periodically = $event" />
          <Checkbox class="mt-2" label="Send after threshold reached" :checked="config.value.send_on_threshold" @updateChecked="config.value.send_on_threshold = $event" />
        </div>
        <div class="flex flex-col ml-10">
          <Select v-model="config.value.type" :options="types" optionLabel="name" optionValue="id" placeholder="Data type" class="mt-2 newborder" />
          <Checkbox class="mt-20" label="Send when status changed" :checked="config.value.send_on_status_change"  @updateChecked="config.value.send_on_status_change = $event" />
          <Checkbox class="mt-2" label="Send after message count" :checked="config.value.send_message_on_count" @updateChecked="config.value.send_message_on_count = $event" />
        </div>
      </div>
    </Box>

    <Box :title="'Energy meter config'" v-if="config.value.type == 1">
      <EnergyMeter :input="config"/>
    </Box>

    <Box :title="'Temperature meter config'" v-if="config.value.type == 4">
      <TemperatureMeter :input="config"/>
    </Box>

    <Box :title="'Waste meter config'" v-if="config.value.type == 3">
      <WasteMeter :input="config"/>
    </Box>

    <Box :title="'Flow meter config'" v-if="config.value.type == 2">
      <FlowMeter :input="config"/>
    </Box>

    <Box :title="'Threshold config'" v-if="config.value.send_on_threshold">

    </Box>

    <Box :title="'Send status config'" v-if="config.value.send_on_status_change">
      <Statuses :input="config"/>
    </Box>

    <Box :title="'Period config'" v-if="config.value.send_periodically">
      <Period :input="config"/>
    </Box>

    <Box :title="'Message count config'" v-if="config.value.send_message_on_count">
      <Messages :input="config"/>
    </Box>

  </div>
</template>

<script setup>
import Select from "primevue/select";
import Box from "./components/Box.vue";
import Checkbox from "./components/Checkbox.vue";
import {ref} from "vue";
import useInputConfig from "./api/inputConfig.js";
import EnergyMeter from "./components/configs/EnergyMeter.vue";
import TemperatureMeter from "./components/configs/TemperatureMeter.vue";
import WasteMeter from "./components/configs/WasteMeter.vue";
import FlowMeter from "./components/configs/FlowMeter.vue";
import Period from "./components/configs/Period.vue";
import Statuses from "./components/configs/Statuses.vue";
import Messages from "./components/configs/Messages.vue";

const types = [{id: 1, name: 'Energy meter'}, {id: 2, name: 'Flow meter'}, {id: 4, name: 'Temperature meter'}]
// {id: 3, name: 'Waste meter'},
const config = useInputConfig()

const props = defineProps({
  id: String
})

const checked = ref(false)
</script>

<style scoped>

</style>
