import { useAuthStore } from '@/store/utils/login';
import { useRouter } from 'vue-router';

export default function useLogout() {
    const useLogoutStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await useLogoutStore.logout();
            localStorage.clear(); // Clear any remaining localStorage data
            await router.push({ name: 'login' }); // Redirect to login page
        } catch (error) {
            console.error("Logout process failed:", error);
        }
    };

    return { handleLogout };
}