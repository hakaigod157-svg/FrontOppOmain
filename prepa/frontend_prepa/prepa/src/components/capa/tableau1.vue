<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-table class="tableau" height ="530px">
        <thead>
            <tr>
                <th class="text-left">Numero</th>
                <th class="text-left">Date</th>
                <th class="text-left">Mode Detection</th>
                <th class="text-left">Emmetteur</th>
                <th class="text-left">Dpt/Service</th>
                <th class="text-left">Description</th>
                <th class="text-left">Type</th>
                <th class="text-left">Cause Racine</th>
                <th class="text-left">Action</th>
                <th class="text-left">Détails</th>
            </tr>
        </thead>
        <tbody v-if="capaDetails.length">
            <tr v-for="item in capaDetails" :key="item.numero">
                <td>{{ item.code }}</td>
                <td class="date">{{ item.date }}</td>
                <td>{{ item.modeDetect }}</td>
                <td>{{ item.emetteur }}</td>
                <td class="depart">{{ item.libelleDep }}</td>
                <td v-html="item.description"></td>
                <td class="type">{{ item.libelleType }}</td>
                <td class="cause">{{ item.nbCauseRacine }}</td>
                <td class="action">{{ item.nbAction }}</td>
                <td>
                    <v-icon @click="$emit('show-details', item)" class="details-icon">mdi-information-outline </v-icon>
                </td>
            </tr>
        </tbody>
        <div v-else class="no-data">Pas de données disponibles</div>
    </v-table>
</template>

<script>
import { ref, onMounted ,watch} from 'vue';
import { useCapaDetailStore } from '@/store/Capa/Capa';

export default {
    props: {
        items: {
            type: Array, 
            required: true
        }
    },
    setup(props) {
        const store = useCapaDetailStore();
        const capaDetails = ref([...props.items]);

        const appeltab = async () => {
            await store.fetchCapaDetails();
            capaDetails.value = store.capaDetails;
        };

        const refresh = async () => {
            console.log('refrech appelé');
            await store.fetchCapaDetails();
            capaDetails.value = store.capaDetails;
        };


        onMounted(async () => {
            await appeltab();
        });

        watch(() => props.items, (newItems) => {
            capaDetails.value = [...newItems]; 
        }, { immediate: true });

        return {
            capaDetails,
            appeltab,
            refresh
        };
    }
};
</script>
    <style lang="scss">
    .tableau{
        animation: tableau 1s;
        box-shadow:inset  -10px 0 5px rgba(0, 0, 0, 0.473);
        thead{
            color: black;
            font-size: 11px;
            white-space: nowrap;
            tr{
                background: #d4d0e6;
                box-shadow: 10px 0 5px rgba(0, 0, 0, 0.491);
                z-index: 2;
                position: sticky;
                border-bottom: 1px solid #b8b3cc;
                top: 0;
            }
            tr:hover{
                background: #d4d0e6;
            }
        }
        tr{
            transition: all 0.3s;
            td{
                padding-left: 25px;
                .details-icon{
                    z-index: 1;
                    font-size: 19px;
                    color: blue;
                }
            }
    
            .type{
                white-space: nowrap;
            }
            .cause{
                color: red;
            }
            .action{
                color: rgb(36, 60, 0);
            }
            .date{
                width: 100px;

            }
            .depart{
                width: 200px;
            }
        }
        tr:hover{
            background: rgba(0, 144, 233, 0.105);
        }
        .no-data{
            position: absolute;
            width: 100%;
            text-align: center;
            padding: 1rem;
        }
    }
    @keyframes tableau{
        from{
            transform: translateY(100px);
        }
        to{
            transform: translateY(0)
        }
    }      
    </style>
