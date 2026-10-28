import { createApp } from "vue";
import App from "./App.vue";
import { loadFonts } from "./plugins/webfontloader";
import router from './router';
import { createPinia } from "pinia";
import vuetifyConf from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@mdi/font/css/materialdesignicons.css'
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import '@/assets/scss/main.scss';
import Draggable from 'vuedraggable';
import { Form, Field, defineRule, configure } from 'vee-validate';
import * as yup from 'yup';



loadFonts();





const app = createApp(App)
app.component('draggable', Draggable);
app.use(Form);
app.use(Field);

configure({
    generateMessage: (ctx) => ctx.message,
});
const schema = yup.object();
const veeValidate = {
    install(app) {
        app.config.globalProperties.$yup = yup;
        app.config.globalProperties.$schema = schema;
        app.provide('veeValidate', app.config.globalProperties.$validator);
    },
};
app.use(veeValidate);
// Ajouter dayjs à l'objet global de Vue.js
app.config.globalProperties.$dayjs = dayjs
// Ajouter Pinia à l'application
const pinia = createPinia()
app.use(pinia)
// Ajouter Vuetify à l'application
app.use(vuetifyConf)
app.use(router)
app.use(VueSweetalert2);
app.mount('#app')

