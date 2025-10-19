import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivitySeite.css';


function ActivitySeite() {
    const navigate = useNavigate();
    const [activityName, setActivityName] = useState('');
    const [activityType, setActivityType] = useState('Radfahren'); // Default selection
    const [visibility, setVisibility] = useState('false');
    const [nurFreunde, setNurFreunde] = useState(false); // Nur Freunde Einstellung

    const saveActivityDetails = () => {
        const activityDetails = {
            activityName,
            activityType,
            visibility,
            nurFreunde, //ist eine ergänzte Visibility
        };
        localStorage.setItem('activityDetails', JSON.stringify(activityDetails));
        alert("Activity details saved successfully!");
        navigate('/Bestätigungsseite');  // Navigate to BestätigungsSeite
    };

    return (
        <div className="activity-container">
            <h1>Erfassen Sie Ihre Aktivität</h1>

            <div className="input-container">
                <label>Aktivitätsname:</label>
                <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label>Aktivitätstyp:</label>
                <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                >
                    <option value="Radfahren">Radfahren</option>
                    <option value="Laufen">Laufen</option>
                    <option value="Wandern">Wandern</option>
                    <option value="Spazieren">Spazieren</option>
                </select>
            </div>

            <div className="input-container">
                <label>Sichtbarkeit:</label>
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                >
                    <option value="true">Für alle sichtbar</option>
                    <option value="false">Nur für mich sichtbar</option>
                </select>
            </div>

            {/*Box zum "Nur Freunde" ankreuzen*/}
            <div className="input-container">
                <label>
                    <input
                        type="checkbox"
                        checked={nurFreunde}
                        onChange={(e) => setNurFreunde(e.target.checked)}
                    />
                    Nur Freunde aktivieren ?
                </label>
            </div>

            <button onClick={saveActivityDetails} className="save-button">
                Aktivitätsdaten speichern und fortfahren
            </button>
        </div>
    );
}

export default ActivitySeite;
