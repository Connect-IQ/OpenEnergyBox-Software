import {reactive} from "vue";

export default function useMainConfig() {
    const value = reactive({
        inputs: [],
        ip: '',
        id: '',
        hardware_revision: '',
        device_uptime: ''
    })

    return {
        value
    }
}
