// useCheckSessionID.js
export default function useCheckSessionID() {
    const checkSessionID = (to, from, next) => {
        const sessionID = localStorage.getItem('sessionId');
        const expirationTime = localStorage.getItem('sessionExpiration');

        if (sessionID && (!expirationTime || Date.now() <= expirationTime)) {
            if (to.name === 'login') {
                // Rediriger vers la dernière page visitée si authentifié
                const lastVisitedPage = localStorage.getItem('lastVisitedPage');
                if (lastVisitedPage) {
                    localStorage.removeItem('lastVisitedPage');
                    next({ path: lastVisitedPage });
                } else {
                    next({ path: '/AccueilPage' }); // Rediriger vers la page d'accueil si pas de dernière page enregistrée
                }
            } else {
                // Enregistrer l'URL de la page actuelle avant de continuer vers la route demandée
                localStorage.setItem('lastVisitedPage', to.fullPath);
                next();
            }
        } else {
            if (to.name !== 'login') {
                next({ name: 'login' }); // Rediriger vers la page de connexion si non authentifié
            } else {
                next(); // Continuer vers la page de connexion
            }
        }
    };

    return {
        checkSessionID
    };
}



