import { ref } from "vue";
import { useTransfertStore } from "@/store/Transfert/transfert";
import { useNewID } from '@/store/utils/newID';
import swal from 'sweetalert2';
import { useReportBPStore } from "@/store/report/printBP";

export default function useValidationTransfert(selected, listRotation1, typeTransfert, articles, commentaires, searchEvent, org, dest) {
    const store = useTransfertStore();
    const storeID = useNewID();
    const listAtransferer = ref([]);
    const chagmt = ref(false);
    const listStockError = ref([]);
    const isPasVide = ref(false);
    const empl = ref('');
    const isSelect = ref(false);
    const isStock = ref(false);
    const storePrint = useReportBPStore();
    const isPasEmp = ref(false);
    const m_article = ref('')



    const chargeListFinale = async () => {
        listAtransferer.value = [];
        await selected.value.forEach(itemA => {
            const matchingItems = listRotation1.value.filter(itemB => (
                itemB.article.trim() === itemA.article.trim() && 
                itemB.lot.trim() === itemA.lot.trim() &&
                itemB.empl_org.trim() === itemA.empl_org.trim() && 
                itemB.empl_dest.trim() === itemA.empl_dest.trim()
            ));
            
            listAtransferer.value.push(...matchingItems);
        });
    };

    const testSTock = async () => {
        listStockError.value = [];
        for (let i = 0; i < listAtransferer.value.length; i++) {
            const item = listAtransferer.value[i];
            await store.listProblemStock(item.article.trim(), item.qte, item.depot_org, item.lettre, item.empl_org);
            if (store.problemStock && store.problemStock.qteTransfert > 0) {
                listStockError.value.push(store.problemStock);
            }
        }
        if (listStockError.value.length > 0) {
            isStock.value = true;
        }

    }

    const stockPasVide = async () => {

        for (let i = 0; i < listAtransferer.value.length; i++) {
            empl.value = '';
            const item = listAtransferer.value[i];
            await store.stockPasVide(item.depot_dest, item.empl_dest);
            if (store.stockNonVide > 0) {
                isPasVide.value = true;
                empl.value = item.empl_dest;
                break;
            }
        }

    }

    const testEmplDest = async () => {
        for (let i = 0; i < listAtransferer.value.length; i++) {
            empl.value = '';
            const item = listAtransferer.value[i];
            if (item.empl_dest === " " || item.empl_dest === null || item.empl_dest.trim().length === 0) {
                isPasEmp.value = true;
                m_article.value = item.libelle;
                break;
            }
        }
        console.log(isPasEmp.value);
    }

    const valideTransfert = async () => {
        if (selected.value.length > 0) {
            swal
                .fire({
                    title: 'Etes-vous sûr(e) de transférer ' + typeTransfert + ' ?',
                    showDenyButton: true,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    confirmButtonText: 'Oui',
                    denyButtonText: `Non`,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await chargeListFinale();
                        await testSTock();
                        if (typeTransfert !== 'Conseil Reappro') {
                            await testEmplDest();
                        }
                        if (typeTransfert === 'ROTATION') {
                            await stockPasVide();
                        }
                        if (!isStock.value && !isPasVide.value && !isPasEmp.value) {
                            chagmt.value = true;
                            await storeID.getId();
                            for (let i = 0; i < listAtransferer.value.length; i++) {
                                const item = listAtransferer.value[i];
                                item.myId = storeID.myId;
                                item.ip_web = localStorage.getItem('ip_local');
                                articles.value = item.article + "[" + item.empl_org + "=>" + item.empl_dest + "]";
                                if (typeTransfert !== 'Conseil Reappro') {
                                    const { article, libelle, labo, depot_org, empl_org, depot_dest, empl_dest, lot, datePer, lettre, qte, numarm1, numarm2, devise, padev, paht, frais, ug, qteNonEt, qteEnCoursEt, qteEt, myId,ip_web } = item;
                                    await store.insertL6_transfert(item);
                                } else {
                                    const { article, libelle, labo, depot_org, empl_org, depot_dest, empl_dest, lot, datePer, lettre, qte, numarm1, numarm2, devise, padev, paht, frais, commentaire, ug, urg, qteNonEt, qteEnCoursEt, qteEt, myId,ip_web } = item;
                                    await store.insertL6_transfertConseil(item);
                                }
                            }
                            const params = {
                                ids: storeID.myId,
                                commentaire: commentaires,
                                depOrg: org.value,
                                depDest: dest.value,
                                user_web: localStorage.getItem('username')
                            }
                            await store.insertFSIL(params);
                            
                            articles.value = "Impression " + store.codeTD;
                            try {
                                const response = await storePrint.generateReportTD(store.codeTD, org.value, dest.value, 0, localStorage.getItem('username'));
                                const blob = new Blob([response.data], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');

                                URL.revokeObjectURL(url);

                            } catch (error) {
                                console.error(error);
                            }
                            chagmt.value = false;
                            await searchEvent();

                        }

                    } else if (result.isDenied) {
                        console.log('Transfer was denied.');
                    }
                });
        } else {
            isSelect.value = true;
        }
    }

    return {
        isSelect,
        valideTransfert,
        listAtransferer,
        store,
        chagmt,
        listStockError,
        isStock,
        isPasVide,
        empl,
        isPasEmp,
        m_article
    };

}