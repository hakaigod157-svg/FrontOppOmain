// src/composables/useFormattedDate.js
import { ref } from "vue";
import dayjs from "dayjs";

export function useformatDate2() {
  /**
   * Formate une date au format DD/MM/YYYY
   * @param {string|Date} date
   * @returns {string}
   */
  function formatDate(date) {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  }

  return { formatDate };
}
