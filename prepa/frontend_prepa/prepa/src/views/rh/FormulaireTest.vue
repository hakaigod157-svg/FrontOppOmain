<template>
    <div class="text-h6 font-weight-bold mb-4">
        <!-- <u>{{ cvCodeTest }} - {{ cvNomTest }}</u> -->
        <u>{{ cvNomTest }}</u>
        <!-- <br> -->
        <!-- {{ dateTest }} - {{ dateEnregcvTtest }} -->
    </div>
    <v-row>
        <!-- Date -->
        <v-col cols="5">
            <v-text-field v-model="dateEntretien" label="Date" type="date" density="compact" variant="outlined" />
        </v-col>

        <!-- Heure -->
        <v-col cols="3">
            <v-text-field v-model="heureEntretien" label="Heure" type="time" density="compact" variant="outlined" />
        </v-col>
    </v-row>

    <v-row>
        <!-- <v-col cols="12">
            <v-checkbox v-model="test" label="TEST" hide-details density="compact" />

            <v-checkbox v-model="entretien" label="ENTRETIEN" hide-details density="compact" />
        </v-col> -->

        <v-col cols="12">

            <!-- TEST visible uniquement en mode test -->
            <v-checkbox v-if="mode === 'test'" v-model="test" label="TEST" hide-details density="compact" />

            <!-- ENTRETIEN visible dans les 2 modes -->
            <v-checkbox v-model="entretien" label="ENTRETIEN" hide-details density="compact" />

        </v-col>
    </v-row>

    <div class="d-flex justify-end mt-4">
        <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="cancel">
            Annuler
        </v-btn>

        <v-btn density="compact" color="blue-darken-3" class="ml-2" @click="valider">
            Valider
        </v-btn>
    </div>

</template>

<script>
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2";

export default defineComponent({
    name: "FormulaireEntretien",

    props: {
        defaultCode: { type: String, default: "" },
        recruCode: { type: String, default: "" },
        cvCode: String,
        cvNom: String,
        mode: String,
        date_cvEnrg: Date,
        date_entretien: Date,
        date_test: Date,
    },

    emits: ["saved", "cancel"],

    setup(props, { emit }) {


        const now = new Date();

        const dateEntretien = ref(now.toISOString().split("T")[0]);
        // const heureEntretien = ref(now.toTimeString().slice(0, 5));

        // const dateEntretien = ref("");
        const heureEntretien = ref("");

        const test = ref(false);
        const entretien = ref(false);

        const dateTestInitiale = ref(props.date_test);

        const valider = () => {

            if (!dateEntretien.value || !heureEntretien.value) {
                Swal.fire({
                    icon: 'warning',
                    title: "Veuillez renseigner la date et l'heure",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    background: '#FFF3E0',
                });


                return;
            }

            // 2. Vérif TEST ou ENTRETIEN obligatoire
            if (!test.value && !entretien.value) {

                Swal.fire({
                    icon: 'warning',
                    title: "Veuillez cocher au moins TEST ou ENTRETIEN",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    background: '#FFF3E0',
                });
                return;
            }

            // Vérification de la date test par rapport à la date du CV
            if (test.value) {

                const dateSaisie = new Date(dateEntretien.value);
                const dateEnreg = new Date(props.date_cvEnrg);

                // Supprime l'heure pour comparer uniquement les dates
                dateSaisie.setHours(0, 0, 0, 0);
                dateEnreg.setHours(0, 0, 0, 0);

                if (dateSaisie < dateEnreg) {
                    Swal.fire({
                        icon: 'warning',
                        title: "La date de TEST ne peut pas être antérieure à la date de l'enregistrement du CV",
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        background: '#FFF3E0',
                    });

                    return;
                }
            }
                // 4. Si ENTRETIEN coché (seul ou avec TEST)
            if (entretien.value) {

                const dateSaisie = new Date(dateEntretien.value);
                const dateEnreg = new Date(props.date_cvEnrg);

                // Supprime l'heure pour comparer uniquement les dates
                dateSaisie.setHours(0, 0, 0, 0);
                dateEnreg.setHours(0, 0, 0, 0);

                if (dateSaisie < dateEnreg) {
                    Swal.fire({
                        icon: 'warning',
                        title: "La date ENTRETIENT ne peut pas être antérieure à la date de l'enregistrement du CV",
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        background: '#FFF3E0',
                    });

                    return;
                }
            }


            

            // Vérification de la date entretien par rapport à la date du test
            if (entretien.value && props.date_test) {

                const dateSaisie = new Date(dateEntretien.value);
                const dateTest = new Date(props.date_test);

                // Supprime l'heure pour comparer uniquement les dates
                dateSaisie.setHours(0, 0, 0, 0);
                dateTest.setHours(0, 0, 0, 0);

                if (dateSaisie < dateTest) {
                    Swal.fire({
                        icon: 'warning',
                        title: "La date de l'ENTRETIEN ne peut pas être antérieure à la date du test",
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        background: '#FFF3E0',
                    });

                    return;
                }
            }



            const data = {
                date: dateEntretien.value,
                heure: heureEntretien.value,
                test: test.value,
                entretien: entretien.value,
                cvCodeTest: props.cvCode,
                recruCodeTest: props.recruCode,
                mode: props.mode,
            };

            // console.log("Données envoyées :", data);
            emit("saved", data);
        };

        const cancel = () => {
            emit("cancel");
        };

        return {
            cvCodeTest: props.cvCode,
            recruCodeTest: props.recruCode,
            cvNomTest: props.cvNom,
            modeTest: props.mode,
            dateTest: props.date_test,
            dateEntretienTest: props.date_entretien,
            dateEnregcvTtest: props.date_cvEnrg,
            dateEntretien,
            heureEntretien,
            test,
            entretien,
            valider,
            cancel,
        };
    },
});
</script>