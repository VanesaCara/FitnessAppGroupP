import axios from 'axios';

// Basis-URL des Backends
const API_BASE_URL = 'http://localhost:8080/nutzer'; // Diese URL entspricht den Endpunkten im Backend
const API_BASE_URL2 = 'http://localhost:8080/freunde'
const API_BASE_URL_3 = 'http://localhost:8080/activities'; // SocialFeed


// Funktion zur Überprüfung, ob der Nutzername verfügbar ist
export const istNutzernameVerfuegbar = async (nutzername) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/istNutzernameVerfuegbar`, {
            params: { nutzername }
        });
        return response.data; // Gibt true zurück, wenn der Nutzername verfügbar ist, ansonsten false
    } catch (error) {
        console.error('Fehler bei der Überprüfung des Nutzernamens:', error);
        throw error;
    }
};

// Funktion zur Überprüfung, ob die E-Mail verfügbar ist
export const istEmailVerfuegbar = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/istEmailVerfuegbar`, {
            params: { email }
        });
        return response.data; // Gibt true zurück, wenn die E-Mail verfügbar ist, ansonsten false
    } catch (error) {
        console.error('Fehler bei der Überprüfung der E-Mail:', error);
        throw error;
    }
};

// Funktion zum Hinzufügen eines neuen Nutzers
export const nutzerHinzufuegen = async (nutzer) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/hinzufuegen`, nutzer);
        return response.data; // Gibt den neu hinzugefügten Nutzer zurück
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Nutzers:', error);
        throw error;
    }
};
export const anmelden = async (nutzername, passwort) => {
    try {
        // Sende die Nutzername und das Passwort als JSON im Body der POST-Anfrage
        const response = await axios.post(`${API_BASE_URL}/anmelden`, { nutzername, passwort });

        // Wenn die Anmeldung erfolgreich ist, gibt das Backend die Nutzer-ID zurück
        return response.data;
    } catch (error) {
        console.error('Fehler bei der Anmeldung:', error);

        // Überprüfen, ob der Fehler auf eine unautorisierte Anmeldung hinweist (z.B. falsche Anmeldedaten)
        if (error.response && error.response.status === 401) {
            throw new Error('Ungültiger Nutzername oder Passwort.');
        } else {
            // Sonstige Fehlerbehandlung, z.B. Verbindungsprobleme
            throw new Error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        }
    }
};
export const verifiziereZfa = async (nutzername, zfaCode) => {
    const response = await axios.post(`${API_BASE_URL}/verifiziereZfa`, { nutzername, zfaCode });
    return response.data;
};

export const getNutzerById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getNutzerById/${id}`);
        return response.data; // Die Daten des Nutzers zurückgeben
    } catch (error) {
        console.error('Fehler beim Abrufen des Nutzers:', error);
        throw error; // Fehler weitergeben
    }
};

export const profilbildHochladen = async (datei, nutzername) =>
{
    const formData = new FormData();
    formData.append('bild', datei);
    formData.append('nutzername', nutzername);

    try
    {
        const response = await axios.post(`${API_BASE_URL}/uploadProfilbild`, formData,
     {
            headers: {
                'Content-Type': 'multipart/form-data',
                     },
            }); //Verweis aufs Backend/NutzerController (uploadProfilbild)
        return response.data;
    }
    catch (error)
    {
        console.error('Fehler beim Hochladen des Profilbildes:', error);
        throw new Error('Fehler beim Hochladen des Profilbildes');
    }
};

export const getProfilbildById = async (id) =>
{
    try
    {
        const response = await axios.get(`${API_BASE_URL}/profilbild/${id}`,
             {
            responseType: 'blob'
                    });
        return URL.createObjectURL(response.data);
    } catch (error)
    {
        console.error('Fehler beim Abrufen des Profilbildes:', error);
        throw error;
    }
};
export const sendeZfaCodeErneut = async (nutzername) =>
{
    try
    {
        const antwort = await axios.post(`${API_BASE_URL}/erneutSenden`, {nutzername});
        return antwort.data;
    }
    catch (error)
    {
        console.error('Fehler beim erneuten Senden des 2FA Codes:', error);
        throw error;
    }
}


export const getAlleNutzer = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/alleuser`);
        return response.data; // Gibt die Nutzer zurück
    } catch (error) {
        console.error('Fehler beim Abrufen der Nutzer:', error);
        throw error;
    }
};
export const anmeldenMitSupercode = async (nutzername, supercode) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/anmeldenMitSupercode`,{ nutzername, supercode });
        return response.data;
    } catch (error) {
        console.error('Fehler bei der Anmeldung mit Supercode:', error);
        throw new Error('Ungültiger Nutzername oder Supercode.');
    }
};

// Bereich Freundeslisten:

// Abrufen der Freunde eines Nutzers
export const fetchFriends = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL2}/friendsList/getAllFriends/${userId}`);

        return response.data; // Liste der Freunde wird zurückgegeben
    } catch (error) {
        console.error('Fehler beim Abrufen der Freundesliste:', error);
        throw error;
    }
};
// Abrufen der Freundschaftsanfragen eines Nutzers
export const fetchFriendRequests = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL2}/friendsList/getRequests/${userId}`);
        return response.data; // Liste der Freundschaftsanfragen
    } catch (error) {
        console.error('Fehler beim Abrufen der Freundschaftsanfragen:', error);
        throw error;
    }
};

// Senden einer Freundschaftsanfrage XXXXX BEI ALLE USER XXXXX
export const sendFriendRequest = async (friendEmail, senderId) => {
    try {
        const response = await axios.post(`${API_BASE_URL2}/friendRequest/sendFriendRequest`,
            new URLSearchParams({ requestedEmail: friendEmail, senderId }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } // Passend zum Backend-Endpunkt
        );
        return response.data; // Erfolgsmeldung oder relevante Daten
    } catch (error) {
        console.error('Fehler beim Senden der Freundschaftsanfrage:', error);
        throw error;
    }
};

// Akzeptieren einer Freundschaftsanfrage
export const acceptFriendRequest = async (receiverId, senderId) => {
    try {
        const response = await axios.post(`${API_BASE_URL2}/friendsList/${receiverId}/accepted/${senderId}`);
        return response.data; // Erfolgsmeldung oder relevante Daten
    } catch (error) {
        console.error('Fehler beim Akzeptieren der Freundschaftsanfrage:', error);
        throw error;
    }
};

// Ablehnen einer Freundschaftsanfrage
export const declineFriendRequest = async (receiverId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL2}/declineRequest`,
            new URLSearchParams({ receiverId, userId }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } // Passend zum Backend-Endpunkt
        );
        return response.data; // Erfolgsmeldung oder relevante Daten
    } catch (error) {
        console.error('Fehler beim Ablehnen der Freundschaftsanfrage:', error);
        throw error;
    }
};

// Entfernen eines Freundes aus der Freundesliste
export const removeFriend = async (userID, friendId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL2}/friendsList/${userID}/remove/${friendId}`);
        return response.data; // Erfolgsmeldung oder relevante Daten
    } catch (error) {
        console.error('Fehler beim Entfernen des Freundes:', error);
        throw error;
    }
};

// Privatsphäre der Freundesliste umschalten (öffentlich/privat)
export const toggleFriendListPrivacy = async (userId, isPrivate) => {
    try {
        const response = await axios.put(`${API_BASE_URL2}/friendsList/${userId}/privacy`,
            { isPrivate },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Erfolgsmeldung oder relevante Daten
    } catch (error) {
        console.error('Fehler beim Ändern der Privatsphäre der Freundesliste:', error);
        throw error;
    }
};

// Freundesliste für Benutzerprofile
export const fetchFriendsForProfile = async (userId, senderId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL2}/friendsList/getList/${userId}`,
            { params: { senderId } }
        );
        return response.data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Freundesliste für das Profil:', error);
        throw error;
    }
};
export const isAdmin = async (nutzerId) =>
{
    try
    {
        const a = await   axios.get(`${API_BASE_URL}/${nutzerId}/isAdmin`);
        return a.data;
    }
    catch(error)
    {
        console.error('Fehler bei der Adminüberprüfung: ', error);
        throw error;
    }
};
// SOCIAL FEED BEREICH

// Social Feed für reguläre Nutzer
export const getSocialFeed = async (nutzerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL_3}/${nutzerId}/socialFeed`);
        return response.data; // Gibt die Social Feed Daten zurück -> mit  Sichtbarkeitsbegrenzung
    } catch (error) {
        console.error('Fehler beim Abrufen des Social Feeds:', error);
        throw error;
    }
};

// Social Feed für Admins
export const getSocialFeedAdmin = async (nutzerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL_3}/${nutzerId}/getSocialFeedAdmin`);
        return response.data; // Gibt die Social Feed Daten für Admin zurück -> ALLES
    } catch (error) {
        console.error('Fehler beim Abrufen des Social Feeds für Admin:', error);
        throw error;
    }
};





