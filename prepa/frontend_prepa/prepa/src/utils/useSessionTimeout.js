import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/utils/login';

export default function useSessionTimeout(sessionDurationInMinutes, router) {
  const sessionID = localStorage.getItem('sessionId');
  let expirationTime = Number(localStorage.getItem('sessionExpiration')); // Convert to number
  const useLogoutStore = useAuthStore();
  let timeoutId = null;

  const checkSessionExpiration = async() => {
    if (sessionID === null || expirationTime === null || expirationTime && Date.now() > expirationTime) {
      await useLogoutStore.logout();
      localStorage.clear();
      router.push({ name: 'login' });
    } else {
      updateExpirationTime();
    }
  };

  const resetSessionTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkSessionExpiration, sessionDurationInMinutes);
  };

  const updateExpirationTime = () => {
    expirationTime = Date.now() + sessionDurationInMinutes;
    localStorage.setItem('sessionExpiration', expirationTime);
  };

  const resetAndUpdateTimeOnUserActivity = () => {
    resetSessionTimeout();
    updateExpirationTime();

    // Broadcast the updated expiration time to other tabs
    localStorage.setItem('sessionExpiration', expirationTime);
  };

  const startResettingAndUpdatingOnUserActivity = () => {
    window.addEventListener('click', resetAndUpdateTimeOnUserActivity);
    window.addEventListener('keydown', resetAndUpdateTimeOnUserActivity);

    // window.addEventListener('beforeunload', (event) => {
      
    //     event.preventDefault();
    //     event.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter la page ?';
        
    // });
  };

  const stopResettingAndUpdatingOnUserActivity = () => {
    window.removeEventListener('click', resetAndUpdateTimeOnUserActivity);
    window.removeEventListener('keydown', resetAndUpdateTimeOnUserActivity);
    // Supprimez la confirmation de fermeture d'onglet ici
    // window.removeEventListener('beforeunload', (event) => {
    //   event.preventDefault();
    // });
  };

  const handleStorageEvent = (event) => {
    if (event.key === 'sessionExpiration') {
      expirationTime = Number(event.newValue); // Update the expiration time
    }
  };

  onMounted(() => {
    resetSessionTimeout();
    startResettingAndUpdatingOnUserActivity();

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageEvent);
  });

  onUnmounted(() => {
    clearTimeout(timeoutId);
    stopResettingAndUpdatingOnUserActivity();
    window.removeEventListener('storage', handleStorageEvent);
  });
}

