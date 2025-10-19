import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/activities';

export const getActivityByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}/activitieslist`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Aktivitäten:', error);
        throw error;
    }
};

export const getActivitiesOfOtherUsers = async (userId) => { // aktivities von anderen
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}/activitieslistOfOtherUser`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Aktivitäten eines anderen Nutzers:', error);
        throw error;
    }
};

export const getActivitySummary = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/summary/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Fehler :(', error);
        throw error;
    }
};


export const getLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Abrufen des Leaderboards:", error);
        throw error;
    }
};


export const getActivityById = async (activityId) =>
{
    try
    {
        const response = await axios.get(`${API_BASE_URL}/getActivity/${activityId}`);
        return response.data;
    }
    catch(error)
    {
        console.error('Fehler beim Abrufen der Aktivität:', error);
        throw error;
    }
}



