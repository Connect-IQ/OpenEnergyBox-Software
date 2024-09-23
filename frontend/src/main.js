import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router'
import MainScreen from "./MainScreen.vue";
import ConfigureInput from "./ConfigureInput.vue";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';

const routes = [
    { path: '/', component: MainScreen },
    { path: '/input/:id', component: ConfigureInput, props: true },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).mount('#app')
