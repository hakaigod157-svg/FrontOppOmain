import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";

export const useGroupeStore = defineStore("groupes", {
    state: () => ({
        groupes: [],
        users: [],
        membres: [],
        acces: [],
        sesDroits: [],
        loading: false,
        params: {
            groupe: '',
            users: '',
            droit: '',
            read: true,
            write: true,
        },
    }),
    actions: {
        async fetchGroupe() {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listGroupe', {
                    headers: {
                        'Authorization': sessionId
                    },
                });
                if (Array.isArray(response.data)) {
                    this.groupes = response.data;
                } else {
                    this.groupes = [];
                }
            } catch (error) {
                console.error(error);
                // Handle the error gracefully, e.g., display an error message.
            } finally {
                this.loading = false;
            }
        },


        async fetchUsers(groupe) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listUsers', {
                    headers: {
                        'Authorization': sessionId
                    },
                    params: {
                        groupe,
                    }
                });
                if (Array.isArray(response.data)) {
                    this.users = response.data;
                } else {
                    this.users = [];
                }
            } catch (error) {
                console.error(error);
                // Handle the error gracefully, e.g., display an error message.
            } finally {
                this.loading = false;
            }
        },
        async fetchMembres(groupe) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listMembres', {
                    headers: {
                        'Authorization': sessionId
                    },
                    params: {
                        groupe,
                    }
                });
                if (Array.isArray(response.data)) {
                    this.membres = response.data;
                } else {
                    this.membres = [];
                }
            } catch (error) {
                console.error(error);
                // Handle the error gracefully, e.g., display an error message.
            } finally {
                this.loading = false;
            }
        },
        async fetchAcces(groupe) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listAcces', {
                    headers: {
                        'Authorization': sessionId
                    },
                    params: {
                        groupe,
                    }
                });
                if (Array.isArray(response.data)) {
                    this.acces = response.data;
                } else {
                    this.acces = [];
                }
            } catch (error) {
                console.error(error);
                // Handle the error gracefully, e.g., display an error message.
            } finally {
                this.loading = false;
            }
        },
        async fetchSesDroits(groupe) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/sesDroits', {
                    headers: {
                        'Authorization': sessionId
                    },
                    params: {
                        groupe,
                    }
                });
                if (Array.isArray(response.data)) {
                    this.sesDroits = response.data;
                } else {
                    this.sesDroits = [];
                }
            } catch (error) {
                console.error(error);
                // Handle the error gracefully, e.g., display an error message.
            } finally {
                this.loading = false;
            }
        },

        async insert_droit(accec) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/insert_droit', accec, {
                    headers: {
                        'Authorization': sessionId
                    },
                });
                this.data = response.data;
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async insert_Membres(groupe, users) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/insert_Membres', null, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
                    params: {
                        groupe,
                        users,
                    },
                });
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async delete_Membres(groupe, users) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.delete(Config.SERVER_URL + 'api/delete_Membres', {
                    headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
                    params: {
                        groupe,
                        users,
                    },
                });
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        async delete_Droit(groupe, droit) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                const response = await axios.delete(Config.SERVER_URL + 'api/delete_Droit', {
                    headers: {
                        'Authorization': sessionId
                    },
                    params: {
                        groupe: groupe,
                        droit: droit
                    }
                });
                this.loading = false;
                // Check for a successful response or take further action here
            } catch (error) {
                alert(error);
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async update_Droit(read, write, groupe, droit) {
            const sessionId = localStorage.getItem('sessionId');
            try {
                this.loading = true
                const response = await axios.put(Config.SERVER_URL + 'api/update_Droit', null, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
                    params: {
                        read,
                        write,
                        groupe,
                        droit
                    }
                });
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async insert_groupe(group) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/insert_groupe', group, {
                    headers: {
                        'Authorization': sessionId
                    }
                });
                this.data = response.data;
                this.loading = false
            }
            catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },
    }

});
