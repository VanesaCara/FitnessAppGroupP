import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/achievements';

export const getAchievements = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Achievements:', error);
        throw error;
    }
};
