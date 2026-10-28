
import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "axios";
import { encryptPassword, decryptPassword } from '@/utils/cryptoUtils';

export const useAuthStore = defineStore('login', {
    state: () => ({
        username: '',
        password: '',
        sessionId: '', // New state to store the session ID
        servers: [],
        name_server: '',
        ip_local: '',
    }),
    actions: {
        async login() {
            const credentials = {
                username: this.username,
                password: this.password,
                name_server: this.name_server,
            };

            try {
                const response = await axios.post(Config.SERVER_URL + 'api/login', credentials, { withCredentials: true });
                this.sessionId = response.data;
                localStorage.setItem('sessionId', this.sessionId);

                return response;
            } catch (error) {
                console.error("Login failed:", error);
                throw new Error("Nom d'utilisateur ou mot de passe incorrect"); // Custom error message
            }
        },
        // ... Autres actions (comme getlisteServer) si nécessaire


        async logout() {
            const username = localStorage.getItem('username');
            const encryptedPassword = localStorage.getItem('password');
            const password = encryptedPassword ? decryptPassword(encryptedPassword) : null;
            const sessionId = localStorage.getItem('sessionId');
            try {
                const response = await axios.get(`${Config.SERVER_URL}api/logout`, {
                    headers: {
                        Authorization: sessionId
                    },
                    params: {
                        username: username,
                        password: password
                    },
                    responseType: 'text', // Indicate that the response will be plain text
                    withCredentials: true
                });

                localStorage.clear();
            } catch (error) {
                console.error("Logout failed: ", error);
            } finally {
                this.sessionId = '';
                localStorage.removeItem('sessionId');
            }
        },

        async getlisteServer() {
            this.loading = true
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listServer')
                this.servers = response.data
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        isAuthenticated() {
            return !!this.sessionId; // Return true if the session ID exists, otherwise false
        },

        async fetchLocalIp() {
            this.loading = true
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/local-ip')
                this.ip_local = response.data
                this.loading = false
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'adresse IP locale privée:', error);
            }
        }
    }
});
