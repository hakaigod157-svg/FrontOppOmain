import { ref,computed } from 'vue'

export function useformatDate(date) {
    const m_date = ref(null);
    selectedDateTime.value = new Date(date);

    function selectedDateTimeFormatted(){
        const year = selectedDateTime.value.getFullYear();
        const month = ('0' + (selectedDateTime.value.getMonth() + 1)).slice(-2);
        const day = ('0' + selectedDateTime.value.getDate()).slice(-2);
        const hours = ('0' + selectedDateTime.value.getHours()).slice(-2);
        const minutes = ('0' + selectedDateTime.value.getMinutes()).slice(-2);
        const seconds = ('0' + selectedDateTime.value.getSeconds()).slice(-2);
        m_date.value = `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return { m_date }
}