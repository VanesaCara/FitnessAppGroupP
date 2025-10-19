import React, { useEffect, useState } from 'react';
import { getAchievements } from '../../Services/AchievementsService';
import './Erfolge.css';

const Erfolge = ({ userId }) => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const data = await getAchievements(userId);
                setAchievements(data);
            } catch (error) {
                console.error('Fehler beim Laden der Achievements:', error);
            }
        };

        fetchAchievements();
    }, [userId]);

    return (
        <div className="erfolge-container">
            <h2>Erfolge</h2>
            <div className="erfolge-grid">
                {achievements.length > 0 ? (
                    achievements.map((badge, index) => (
                        <div key={index} className="achievement-badge">
                            <img
                                src={badge}
                                alt={`Achievement ${index}`}
                                className="badge-image"
                            />
                        </div>
                    ))
                ) : (
                    <p>Noch keine Achievements erreicht :(.</p>
                )}
            </div>
        </div>
    );
};

export default Erfolge;
