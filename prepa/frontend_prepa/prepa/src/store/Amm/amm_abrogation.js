import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const uselistAbrogation = defineStore("listAbrogation", {
    state: () => ({
        listAbrogations: [],

        loading: false,

    }),

    actions: {
        async fetchListAbrogation() {
            const sessionId = localStorage.getItem("sessionId");
            this.loading = true;

            const { handleLogout } = useLogout();


            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/listAbrogation",
                    {
                        headers: {
                            Authorization: sessionId,
                        },
                        
                    },
                );
                if (Array.isArray(response.data)) {
                    this.listAbrogations = response.data;
                } else {
                    this.listAbrogations = [];
                }
            } catch (error) {

                alert(`Error: ${error.message}
                Method: ${error.config?.method?.toUpperCase()}
                URL: ${error.config?.url}`);

                await handleLogout();
                console.log(error);
            } finally {
                this.loading = false;
            }
        }
    ,async updateAbrogation(code,dateValidation) {
          const { handleLogout } = useLogout();
          const sessionId = localStorage.getItem("sessionId");
          try {
            this.loading = true; // Set loading indicator to true
            const response = await axios.post(
              Config.SERVER_URL + "api/updateAbrogation",
              null,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: sessionId,
                },
                params: {
                  code,
                  dateValidation,
                },
              },
            );
            this.data = response.data;
          } catch (error) {
            alert(`Error: ${error.message}
                                  Method: ${error.config?.method.toUpperCase()}
                                  URL: ${error.config?.url}`);
            await handleLogout();
            console.log(error);
          } finally {
            this.loading = false; // Set loading indicator back to false
          }
    }
    }

    
});

