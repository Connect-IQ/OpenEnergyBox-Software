import {onMounted, onUnmounted, reactive} from "vue";

export default function useInputConfig() {
    const value = reactive({
        id: '',
        active: false,
        type: '',
        send_periodically: null,
        send_on_status_change: null,
        send_on_threshold: null,
        send_message_on_count: null,
        energy: {
            phases_to_neutral: false,
            currents: false,
            power: false,
            power_factors: false,
            apparent_power: false,
            reactive_power: false,
            angles: false,
            totals: false
        },
        temperature: {
            unit: 1,
            type: 1
        },
        period: {
            send_every: 1,
            unit: 1
        },
        statuses: {
            data: '',
            status: null
        },
        threshold: {
            lower: 1,
            upper: 1,
            threshold: null,
            time_offset: 0
        },
        flow: {
            unit: 1,
            type: 1
        }
    })

    const loadValueFromCookie = () => {
        const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)myCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (cookieValue) {
            try {
                const savedValue = JSON.parse(cookieValue);
                Object.assign(value, savedValue);
            } catch (error) {
                console.error("Unable to parse saved cookie value: ", error);
            }
        }
    };

    const saveValueToCookie = () => {
        document.cookie = "myCookie=" + JSON.stringify(value);
    };


    onUnmounted(() => {
        window.removeEventListener('beforeunload', saveValueToCookie);
    });

    onMounted(() => {
        loadValueFromCookie();
        window.addEventListener('beforeunload', saveValueToCookie);
    });

    return {
        value
    }
}
