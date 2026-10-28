import { ref,computed } from 'vue'
import dayjs from 'dayjs'

export default function useDateTime( date) {
  const format = 'YYYY-MM-DD HH:mm';
  const dateTime = ref(dayjs(date).format(format))
  return { dateTime }
}

