// axiosConfig.js
import axios from 'axios';
import Config from "@/utils/config.js";
import router from '@/router';

const instance = axios.create({
    baseURL: Config.SERVER_URL, // Assurez-vous que Config est correctement importé depuis '@/utils/config'
});

instance.interceptors.request.use(function (config) {
    const sessionID = localStorage.getItem('sessionId');
    if (!sessionID) {
        router.push({ name: 'login' });
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

export default instance;
