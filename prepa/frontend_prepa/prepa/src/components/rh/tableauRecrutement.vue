<template>
  <v-data-table class="rh_header bordered-new" :headers="headers" :items="recruts" :loading="loading"
    loading-text="Chargement..." dense :items-per-page="-1" :fixed-header="true"
    no-data-text="Pas de données disponibles" hover hide-default-footer density="compact" height="450"
    style="margin-top: 53px;">

    <!-- Colonnes standards -->
    <template v-for="col in otherColumns" :key="col" v-slot:[`item.${col}`]="{ item }">
      <span>{{ displayFallback(item[col]) }}</span>
    </template>
    <!-- Colonnes date -->

    <template v-for="col in dateColumns" :key="col" v-slot:[`item.${col}`]="{ item }">
      <span>{{ item[col] ? formatDate(item[col]) : "-" }}</span>
    </template>

    <template v-slot:[`item.recru_code`]="{ item }">
      <span style="display: inline-block; line-height: 1">
        <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Recrutement')"
          @mouseleave="hideTooltip" variant="text" style="
            padding: 0;
            justify-content: flex-start;
            min-width: 100%;
            line-height: 1;
          " class="btn-no-padding">
          {{ item.recru_code }}
        </v-btn>
      </span>
    </template>

    <template v-slot:[`item.recru_demande`]="{ item }">
      {{ item.recru_demande }}
      <br>
      <b>({{ formatDate(item.demande_date) }})</b>
    </template>



  </v-data-table>
  <div class="summary-line">
    {{ recruts.length }} recrutement<span v-if="recruts.length > 1">s</span>
    trouvée<span v-if="recruts.length > 1">s</span>.
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";

export default defineComponent({
  name: "TableauRecrutement",
  props: {
    recruts: { type: Array, required: true },
    headers: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { formatDate } = useformatDate2();
    const dateColumns = ["recru_date", "demande_date"];
    const tooltip = ref();

    const actionDetail = (item) => {
      emit("actionDetail", item);
    };
    // Fonction pour afficher l'info-bulle
    const showTooltip = (event, message) => {
      if (tooltip.value) {
        hideTooltip();
      }

      const div = document.createElement("div");
      div.id = "tooltip";
      div.innerText = message;
      div.style.position = "absolute";
      div.style.backgroundColor = "#333";
      div.style.color = "#fff";
      div.style.padding = "5px 10px";
      div.style.borderRadius = "4px";
      div.style.fontSize = "12px";
      div.style.pointerEvents = "none";
      div.style.top = `${event.clientY + 10}px`;
      div.style.left = `${event.clientX + 10}px`;
      div.style.zIndex = "1000";

      document.body.appendChild(div);
      tooltip.value = div;
    };

    const hideTooltip = () => {
      if (tooltip.value) {
        tooltip.value.remove();
        tooltip.value = null;
      }
    };

    // Fonctions utilitaires
    function displayFallback(value) {
      return value ?? "-";
    }

    // Colonnes
    return {
      formatDate,
      emit,
      displayFallback,
      dateColumns,
      tooltip,
      showTooltip,
      hideTooltip,
      actionDetail,
    };
  },
});
</script>

<style>
.v-data-table.rh_header .v-table__wrapper>table>thead>tr th,
.v-data-table.rh_header .v-table__wrapper>table tbody>tr th {
  background-color: #b3ccb8 !important;
  color: #000000 !important;
}
</style>
